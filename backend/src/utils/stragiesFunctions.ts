import { Profile } from "passport";
import { AuthProvider } from "../models/AuthProvider";
import { execute, SQL_TABLES } from "./dbConfig";
import { ResultSetHeader } from "mysql2";
import { User } from "../models/User";

// check if providerUserId exsit in auth-provider db (if user was saved before)
const queryProviderData = async (profile: Profile) => {
  const query = `SELECT * FROM ${SQL_TABLES.authProvider} WHERE provider = ? AND providerUserId = ?`;
  const providerData = await execute<AuthProvider>(query, [
    profile.provider,
    profile.id,
  ]);
  return providerData;
};

// get the user based on auth-provider row id
const getUserByAuthProviderId = async (authProviderId: number) => {
  const query = `SELECT * FROM ${SQL_TABLES.users} WHERE authProviderId = ?`;
  const user = await execute<User>(query, [authProviderId]);
  return user;
};

// checking and retriving user | null based on strategy profile
export const getUserByProfile = async (
  profile: Profile
): Promise<User | null> => {
  const arrayData = await queryProviderData(profile);
  if (!arrayData.length) return null;
  const providerData = arrayData[0];
  const userArray = await getUserByAuthProviderId(providerData.id);
  if (!userArray.length) return null;
  return userArray[0];
};

// add provider data to auth-provider DB
const addProviderDataToDB = async (profile: Profile) => {
  const provider: Omit<AuthProvider, "id"> = {
    provider: profile.provider as "google",
    providerUserId: profile.id,
  };
  const query = `INSERT INTO ${SQL_TABLES.authProvider} (provider, providerUserId)
    VALUES (?, ?)`;
  const [results] = await execute<ResultSetHeader>(query, [
    provider.provider,
    provider.providerUserId,
  ]);
  return results.insertId;
};

// add newUser data to users DB
const addUserDataToDB = async (
  profile: Profile,
  providerRowId: number
): Promise<User> => {
  const newUser: Omit<User, "id"> = {
    fullName: profile.displayName,
    authProviderId: providerRowId,
    primaryAddressId: null,
    restaurantId: null,
    password: null,
  };
  const query = `INSERT INTO ${SQL_TABLES.users} (authProviderId, primaryAddressId, restaurantId, fullName)
    VALUES (?, ?, ?, ?)`;

  const [results] = await execute<ResultSetHeader>(query, [
    newUser.authProviderId,
    newUser.primaryAddressId,
    newUser.restaurantId,
    newUser.fullName,
  ]);

  return { ...newUser, id: results.insertId };
};

export const createNewUserAndProvider = async (
  profile: Profile
): Promise<User> => {
  const providerRowId = await addProviderDataToDB(profile);
  const user = await addUserDataToDB(profile, providerRowId);
  return user;
};
