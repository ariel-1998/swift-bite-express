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

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("google");
      let connection: PoolConnection | null = null;
      try {
        //look for user in database in
        connection = await pool.getConnection();
        await connection.beginTransaction();
        ///////////////////////////////only server errors ca accure///////////////////
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
        console.log(error);
        await connection?.rollback();
        if (error instanceof FunctionError) done(error);
        done(new FunctionError("Server Error", 500));
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
    async (req, email, password, done) => {
      let connection: PoolConnection | null = null;
      const userInfo: RegistrationData = {
        email,
        password,
        fullName: (req.body as RegistrationData).fullName,
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
        console.log(error);

        connection?.rollback();
        if (error instanceof FunctionError) done(error);
        else done(new FunctionError("Server Error.", 500));
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
      let connection: PoolConnection | null = null;
      try {
        connection = await pool.getConnection();
        const user = await localProvider.userLoginHandler(connection, {
          email,
          password,
        });

        done(null, user);
      } catch (error) {
        console.log(error);
        connection?.rollback();
        if (error instanceof FunctionError) done(error);
        else done(new FunctionError("Server Error.", 500));
      } finally {
        connection?.release();
      }
    }
  )
);

const getUserById = async (userId: string): Promise<User | null> => {
  const {
    tableName,
    columns: { id },
  } = DB.tables.users;

  const query = `SELECT * FROM ${tableName} WHERE ${id} = ?`;
  const params = [userId];
  const connection = await pool.getConnection();
  const [rows] = await executeQuery<User[]>(connection, { query, params });
  connection.release();
  return rows[0];
};

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (error) {
    done(new FunctionError("Server Error.", 500));
  }
});
