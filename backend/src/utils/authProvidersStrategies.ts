import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { AuthProvider, ProviderLiterals } from "../models/AuthProvider";
// import { ResultSetHeader } from "mysql2";
// import { IsOwner, User } from "../models/User";
import { IsOwner, User } from "../models/User";
import { Profile } from "passport-google-oauth20";
import { SQL_TABLES, executeQuery } from "./dbConfig";

class AuthProviderStrategies {
  // check if providerUserId exsit in auth-provider db (if user was saved before)
  private queryProviderData = async (
    connection: PoolConnection,
    profile: Profile
  ): Promise<AuthProvider | null> => {
    const query = `SELECT * FROM ${SQL_TABLES.authProvider} WHERE provider = ? AND providerUserId = ?`;
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
    const query = `SELECT * FROM ${SQL_TABLES.users} WHERE authProviderId = ?`;
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
    const query = `INSERT INTO ${SQL_TABLES.authProvider} (id, provider, providerUserId) VALUES (?, ?, ?)`;
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
    const query = `INSERT INTO ${SQL_TABLES.users} (authProviderId, primaryAddressId,  fullName, isRestaurantOwner, email) VALUES (?, ?, ?, ?, ?)`;
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

export const authProviderStrategies = new AuthProviderStrategies();
