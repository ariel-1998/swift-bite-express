import { AuthProvider } from "../models/AuthProvider";
import { execute, SQL_TABLES } from "./dbConfig";
import { ResultSetHeader } from "mysql2";
import { IsOwner, User } from "../models/User";
import { Profile } from "passport-google-oauth20";

// check if providerUserId exsit in auth-provider db (if user was saved before)
const queryProviderData = async (
  profile: Profile
): Promise<AuthProvider | null> => {
  const query = `SELECT * FROM ${SQL_TABLES.authProvider} WHERE provider = ? AND providerUserId = ?`;
  const [providerData] = await execute<AuthProvider[]>(query, [
    profile.provider,
    profile.id,
  ]);
  return providerData[0];
};
// get the user based on auth-provider row id
const getUserByAuthProviderId = async (
  authProviderId: number
): Promise<User | null> => {
  const query = `SELECT * FROM ${SQL_TABLES.users} WHERE authProviderId = ?`;
  const [user] = await execute<User[]>(query, [authProviderId]);
  return user[0];
};

// checking and retriving user | null based on strategy profile
export const getUserByProfile = async (
  profile: Profile
): Promise<User | null> => {
  const providerData = await queryProviderData(profile);
  if (!providerData) return null;
  const userData = await getUserByAuthProviderId(providerData.id);
  if (!userData) return null;
  return userData;
};

// add provider data to auth-provider DB
const addProviderDataToDB = async (profile: Profile) => {
  const provider: Omit<AuthProvider, "id"> = {
    provider: profile.provider as "google",
    providerUserId: profile.id,
  };
  const query = `INSERT INTO ${SQL_TABLES.authProvider} (provider, providerUserId) VALUES (?, ?)`;
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
  const { _json: jsonData } = profile;

  const newUser: Omit<User, "id"> = {
    fullName: profile.displayName,
    authProviderId: providerRowId,
    primaryAddressId: null,
    password: null,
    isRestaurantOwner: IsOwner.false,
    email: jsonData.email!,
  };
  const query = `INSERT INTO ${SQL_TABLES.users} (authProviderId, primaryAddressId,  fullName, isRestaurantOwner, email)
    VALUES (?, ?, ?, ?, ?)`;

  const [results] = await execute<ResultSetHeader>(query, [
    newUser.authProviderId,
    newUser.primaryAddressId,
    newUser.fullName,
    newUser.isRestaurantOwner,
    newUser.email,
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
