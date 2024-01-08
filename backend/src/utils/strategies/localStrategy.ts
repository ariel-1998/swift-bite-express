import { PoolConnection } from "mysql2/promise";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { DB } from "../DB/tables";
import { executeQuery } from "../DB/dbConfig";
import { Credentials, User } from "../../models/User";

class LocalProvider {
  private getUserByEmail = async (
    connection: PoolConnection,
    { email }: Pick<Credentials, "email">
  ): Promise<User | null> => {
    const query = `SELECT * FROM ${DB.tables.users.tableName} WHERE ${DB.tables.users.columns.email} = ?`;
    const params = [email];
    const [user] = await executeQuery<User[]>(connection, {
      query,
      params,
    });
    return user[0];
  };
}

const localProvider = new LocalProvider();

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      // passReqToCallback: true, // If true, the request object is passed as the first argument to the verify callback (default is false)
    },
    (email, password, done) => {
      console.log("register");
      done(null, { email });
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
    (email, password, done) => {
      console.log("login");
      done(null, { email });
      //if user exist return user
      //if user does NOT exist return error
    }
  )
);
