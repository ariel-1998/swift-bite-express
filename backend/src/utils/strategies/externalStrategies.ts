import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { AuthProvider, ProviderLiterals } from "../../models/AuthProvider";
import { Role, User } from "../../models/User";
import { Profile, VerifyCallback } from "passport-google-oauth20";
import { executeQuery, pool } from "../DB/dbConfig";
import { DB } from "../DB/tables";
import { handleErrorTypes } from "../../middleware/errorHandler";

export class ExternalAuthProvider {
  // check if providerUserId exsit in auth-provider db (if user was saved before)
  protected queryProviderData = async (
    connection: PoolConnection,
    profile: Profile
  ): Promise<AuthProvider | undefined> => {
    const { columns, tableName } = DB.tables.auth_provider;
    const query = `SELECT * FROM ${tableName} WHERE ${columns.provider} = ? AND ${columns.providerUserId} = ?`;
    const params = [profile.provider, profile.id];
    const [providerData] = await executeQuery<AuthProvider[]>(
      connection,
      {
        query,
        params,
      },
      "auth_provider"
    );
    return providerData[0];
  };

  // get the user based on auth-provider row id
  protected getUserByAuthProviderId = async (
    connection: PoolConnection,
    authProviderId: string
  ): Promise<User | undefined> => {
    const { columns, tableName } = DB.tables.users;
    const query = `SELECT * FROM ${tableName} WHERE ${columns.authProviderId} = ?`;
    const params = [authProviderId];
    const [users] = await executeQuery<User[]>(
      connection,
      { query, params },
      "users"
    );
    return users[0];
  };

  // checking and retriving user | null based on strategy profile
  getUserByProfile = async (
    connection: PoolConnection,
    profile: Profile
  ): Promise<User | undefined> => {
    const providerData = await this.queryProviderData(connection, profile);
    if (!providerData) return;
    const userData = await this.getUserByAuthProviderId(
      connection,
      providerData.id
    );
    return userData;
  };

  protected createDefaultProviderOBJ = (
    profile: Profile,
    id: string
  ): AuthProvider => {
    return {
      id,
      provider: profile.provider as ProviderLiterals,
      providerUserId: profile.id,
    };
  };

  protected addProviderDataToDB = async (
    connection: PoolConnection,
    profile: Profile
  ) => {
    const { tableName, columns } = DB.tables.auth_provider;
    const id = this.generateAuthProviderIdForDB(profile);
    const provider = this.createDefaultProviderOBJ(profile, id);
    const query = `INSERT INTO ${tableName} (${columns.id}, ${columns.provider}, ${columns.providerUserId}) VALUES (?, ?, ?)`;
    const params = [provider.id, provider.provider, provider.providerUserId];

    await executeQuery(connection, { query, params }, "auth_provider");
    return id;
  };

  protected createDefaultUserOBJ = (
    profile: Profile,
    dbRowId: string
  ): Omit<User, "id"> => {
    const { _json: jsonData } = profile;

    return {
      fullName: profile.displayName,
      authProviderId: dbRowId,
      primaryAddressId: null,
      password: null,
      role: Role.user,
      email: jsonData.email!,
    };
  };

  protected addUserDataToDB = async (
    connection: PoolConnection,
    profile: Profile,
    providerRowId: string
  ): Promise<User> => {
    const { columns, tableName } = DB.tables.users;
    const newUser = this.createDefaultUserOBJ(profile, providerRowId);
    const query = `INSERT INTO ${tableName} (${columns.authProviderId}, ${columns.primaryAddressId},  ${columns.fullName}, ${columns.role}, ${columns.email}) VALUES (?, ?, ?, ?, ?)`;
    const params = [
      newUser.authProviderId,
      newUser.primaryAddressId,
      newUser.fullName,
      newUser.role,
      newUser.email,
    ];
    const [results] = await executeQuery<ResultSetHeader>(
      connection,
      {
        query,
        params,
      },
      "users"
    );

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

  protected generateAuthProviderIdForDB(profile: Profile) {
    return `${profile.provider}-${profile.id}` as const;
  }
}
export const externalAuthProvider = new ExternalAuthProvider();

export async function externalAuthStrategy(
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback
) {
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
