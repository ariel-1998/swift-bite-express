import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { pool } from "../DB/dbConfig";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { AuthProvider, ProviderLiterals } from "../../models/AuthProvider";
import { IsOwner, User } from "../../models/User";
import { Profile } from "passport-google-oauth20";
import { executeQuery } from "../DB/dbConfig";
import { DB } from "../DB/tables";

class ExternalAuthProvider {
  // check if providerUserId exsit in auth-provider db (if user was saved before)
  private queryProviderData = async (
    connection: PoolConnection,
    profile: Profile
  ): Promise<AuthProvider | null> => {
    const query = `SELECT * FROM ${DB.tables.auth_provider.tableName} WHERE provider = ? AND providerUserId = ?`;
    const params = [profile.provider, profile.id];
    const [providerData] = await executeQuery<AuthProvider[]>(connection, {
      query,
      params,
    });
    return providerData[0];
  };

  // get the user based on auth-provider row id
  private getUserByAuthProviderId = async (
    connection: PoolConnection,
    authProviderId: string
  ): Promise<User | null> => {
    const query = `SELECT * FROM ${DB.tables.users.tableName} WHERE authProviderId = ?`;
    const params = [authProviderId];
    const [user] = await executeQuery<User[]>(connection, { query, params });
    return user[0];
  };

  // checking and retriving user | null based on strategy profile
  getUserByProfile = async (
    connection: PoolConnection,
    profile: Profile
  ): Promise<User | null> => {
    const providerData = await this.queryProviderData(connection, profile);
    if (!providerData) return null;
    const userData = await this.getUserByAuthProviderId(
      connection,
      providerData.id
    );
    return userData;
  };

  private addProviderDataToDB = async (
    connection: PoolConnection,
    profile: Profile
  ) => {
    const id = this.generateAutProviderIdForDB(profile);
    const provider: AuthProvider = {
      id,
      provider: profile.provider as ProviderLiterals,
      providerUserId: profile.id,
    };
    const query = `INSERT INTO ${DB.tables.auth_provider.tableName} (id, provider, providerUserId) VALUES (?, ?, ?)`;
    const params = [provider.id, provider.provider, provider.providerUserId];

    await executeQuery(connection, { query, params });
    return id;
  };

  private addUserDataToDB = async (
    connection: PoolConnection,
    profile: Profile,
    providerRowId: string
  ): Promise<User> => {
    const { _json: jsonData } = profile;

    const newUser: Omit<User, "id"> = {
      fullName: profile.displayName,
      authProviderId: providerRowId,
      primaryAddressId: null,
      password: null,
      isRestaurantOwner: IsOwner.false,
      email: jsonData.email!,
    };
    const query = `INSERT INTO ${DB.tables.users.tableName} (authProviderId, primaryAddressId,  fullName, isRestaurantOwner, email) VALUES (?, ?, ?, ?, ?)`;
    const params = [
      newUser.authProviderId,
      newUser.primaryAddressId,
      newUser.fullName,
      newUser.isRestaurantOwner,
      newUser.email,
    ];
    const [results] = await executeQuery<ResultSetHeader>(connection, {
      query,
      params,
    });

    return { ...newUser, id: results.insertId };
  };

  createNewUserAndProvider = async (
    connection: PoolConnection,
    profile: Profile
  ): Promise<User> => {
    const providerRowId = await this.addProviderDataToDB(connection, profile);
    const user = await this.addUserDataToDB(connection, profile, providerRowId);
    return user;
  };

  private generateAutProviderIdForDB(profile: Profile) {
    return `${profile.provider}-${profile.id}`;
  }
}
const externalAuthProvider = new ExternalAuthProvider();

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
        if (connection) await connection.rollback();
        const errMsg = "You might have signed in a different way";
        done({ message: errMsg, name: "providerError" });
      } finally {
        if (connection) connection.release();
      }
    }
  )
);
