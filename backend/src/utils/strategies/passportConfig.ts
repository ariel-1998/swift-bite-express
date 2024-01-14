import passport from "passport";
import { RegistrationData, User } from "../../models/User";
import { DB } from "../DB/tables";
import { executeQuery, pool } from "../DB/dbConfig";
import { FunctionError } from "../../models/Errors/ErrorConstructor";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { externalAuthProvider } from "./externalStrategies";
import { PoolConnection } from "mysql2/promise";
import { Strategy as LocalStrategy } from "passport-local";
import { localProvider } from "./localStrategy";
import { handleErrorTypes } from "../../middleware/errorHandler";
import { Request } from "express";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let connection: PoolConnection | undefined = undefined;
      try {
        //look for user in database in
        connection = await pool.getConnection();
        await connection.beginTransaction();
        ///////////////////////////////only server errors can accure///////////////////
        const user = await externalAuthProvider.getUserByProfile(
          connection,
          profile
        );
        //if user exist return the user and exit the function
        if (user) return done(null, user);
        //add provider to auth-provider DB
        const newUser = await externalAuthProvider.createNewUserAndProvider(
          connection,
          profile
        );
        await connection.commit();
        // const newUser = await createNewUserAndProvider(profile);
        done(null, newUser);
      } catch (error) {
        //if it failed that means that the email provided in profile already exist in DB(email is unique)
        await connection?.rollback();
        const handledError = handleErrorTypes(error);
        done(handledError as Error);
      } finally {
        connection?.release();
      }
    }
  )
);

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true, // If true, the request object is passed as the first argument to the verify callback (default is false)
    },
    async (
      req: Request<unknown, unknown, RegistrationData>,
      email,
      password,
      done
    ) => {
      let connection: PoolConnection | undefined = undefined;
      const userInfo: RegistrationData = {
        email,
        password,
        fullName: req.body.fullName,
      };
      try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const user = await localProvider.userRegistrationHandler(
          connection,
          userInfo
        );
        //commit connection
        await connection.commit();

        done(null, user);
      } catch (error) {
        connection?.rollback();
        const handledError = handleErrorTypes(error);
        done(handledError as Error);
      } finally {
        connection?.release();
      }
    }
  )
);

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      // passReqToCallback: true, // If true, the request object is passed as the first argument to the verify callback (default is false)
    },
    async (email, password, done) => {
      let connection: PoolConnection | undefined = undefined;
      try {
        connection = await pool.getConnection();
        const user = await localProvider.userLoginHandler(connection, {
          email,
          password,
        });

        done(null, user);
      } catch (error) {
        connection?.rollback();
        const handledError = handleErrorTypes(error);
        done(handledError as Error);
      } finally {
        connection?.release();
      }
    }
  )
);

const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const {
      tableName,
      columns: { id },
    } = DB.tables.users;
    const query = `SELECT * FROM ${tableName} WHERE ${id} = ?`;
    const params = [userId];
    const connection = await pool.getConnection();
    const [rows] = await executeQuery<User[]>(connection, { query, params });
    connection?.release();
    return rows[0];
  } catch (error) {
    throw new FunctionError("Server Error.", 500);
  }
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
