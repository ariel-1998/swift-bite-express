import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { AuthProvider, ProviderLiterals } from "../../models/AuthProvider";
import { IsOwner, User } from "../../models/User";
import { Profile } from "passport-google-oauth20";
import { executeQuery } from "../DB/dbConfig";
import { DB } from "../DB/tables";
import { FunctionError } from "../../models/Errors/ErrorConstructor";

class ExternalAuthProvider {
  // check if providerUserId exsit in auth-provider db (if user was saved before)
  private queryProviderData = async (
    connection: PoolConnection,
    profile: Profile
  ): Promise<AuthProvider | undefined> => {
    const { columns, tableName } = DB.tables.auth_provider;
    const query = `SELECT * FROM ${tableName} WHERE ${columns.provider} = ? AND ${columns.providerUserId} = ?`;
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
  ): Promise<User | undefined> => {
    const { columns, tableName } = DB.tables.users;
    const query = `SELECT * FROM ${tableName} WHERE ${columns.authProviderId} = ?`;
    const params = [authProviderId];
    const [user] = await executeQuery<User[]>(connection, { query, params });
    return user[0];
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

  private createDefaultProviderOBJ = (
    profile: Profile,
    id: string
  ): AuthProvider => {
    return {
      id,
      provider: profile.provider as ProviderLiterals,
      providerUserId: profile.id,
    };
  };

  private addProviderDataToDB = async (
    connection: PoolConnection,
    profile: Profile
  ) => {
    const { tableName, columns } = DB.tables.auth_provider;
    const id = this.generateAutProviderIdForDB(profile);
    const provider = this.createDefaultProviderOBJ(profile, id);
    const query = `INSERT INTO ${tableName} (${columns.id}, ${columns.provider}, ${columns.providerUserId}) VALUES (?, ?, ?)`;
    const params = [provider.id, provider.provider, provider.providerUserId];

    await executeQuery(connection, { query, params });
    return id;
  };

  private createDefaultUserOBJ = (
    profile: Profile,
    dbRowId: string
  ): Omit<User, "id"> => {
    const { _json: jsonData } = profile;

    return {
      fullName: profile.displayName,
      authProviderId: dbRowId,
      primaryAddressId: null,
      password: null,
      isRestaurantOwner: IsOwner.false,
      email: jsonData.email!,
    };
  };

  private addUserDataToDB = async (
    connection: PoolConnection,
    profile: Profile,
    providerRowId: string
  ): Promise<User> => {
    try {
      const { columns, tableName } = DB.tables.users;
      const newUser = this.createDefaultUserOBJ(profile, providerRowId);
      const query = `INSERT INTO ${tableName} (${columns.authProviderId}, ${columns.primaryAddressId},  ${columns.fullName}, ${columns.isRestaurantOwner}, ${columns.email}) VALUES (?, ?, ?, ?, ?)`;
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
    } catch (error) {
      throw new FunctionError("You Signed In a with a different method.", 409);
    }
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
export const externalAuthProvider = new ExternalAuthProvider();
