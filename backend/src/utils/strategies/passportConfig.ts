import passport from "passport";
import { User } from "../../models/User";
import { DB } from "../DB/tables";
import { MixedArray, executeSingleQuery } from "../DB/dbConfig";
import { FunctionError } from "../../models/Errors/ErrorConstructor";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { externalAuthStrategy } from "./externalStrategies";
import { Strategy as LocalStrategy } from "passport-local";
import { localLoginStrategy, localSignupStrategy } from "./localStrategy";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    externalAuthStrategy
  )
);

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    localSignupStrategy
  )
);

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    localLoginStrategy
  )
);

const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const {
      tableName,
      columns: { id },
    } = DB.tables.users;
    const query = `SELECT * FROM ${tableName} WHERE ${id} = ?`;
    const params: MixedArray = [userId];
    const [rows] = await executeSingleQuery<User[]>(query, params);
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
