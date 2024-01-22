import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { DB } from "../DB/tables";
import { executeQuery } from "../DB/dbConfig";
import {
  Credentials,
  IsOwner,
  RegistrationData,
  User,
  userRegistrationSchema,
} from "../../models/User";
import { hashPassword, verifyPassword } from "../bcrypt";
import { FunctionError } from "../../models/Errors/ErrorConstructor";
import { parseSchemaThrowZodErrors } from "../../models/Errors/ZodErrors";

export class LocalProvider {
  protected getUserByEmail = async (
    connection: PoolConnection,
    email: string
  ): Promise<User | undefined> => {
    const query = `SELECT * FROM ${DB.tables.users.tableName} WHERE ${DB.tables.users.columns.email} = ?`;
    const params = [email];
    const [rows] = await executeQuery<User[]>(connection, {
      query,
      params,
    });
    return rows[0];
  };

  userLoginHandler = async (
    connection: PoolConnection,
    { email, password }: Credentials
  ): Promise<User | undefined> => {
    const user = await this.getUserByEmail(connection, email);
    if (!user) throw new FunctionError("Email or Password are incorrect", 401); //need to check if error is needed to be thrown for 401 unAuthorized
    if (!user.password) {
      throw new FunctionError("You registered with a different method", 409);
    }
    await verifyPassword(password, user.password);
    return user;
  };

  protected createDefaultUserOBJ = (
    { email, fullName }: RegistrationData,
    hashedPassword: string
  ): Omit<User, "id"> => {
    return {
      fullName: fullName,
      email: email,
      password: hashedPassword,
      authProviderId: null,
      isRestaurantOwner: IsOwner.false,
      primaryAddressId: null,
    };
  };

  userRegistrationHandler = async (
    connection: PoolConnection,
    userInfo: RegistrationData
  ): Promise<User> => {
    const usersTable = DB.tables.users;
    const { tableName, columns } = usersTable;
    const hashedPassword = await hashPassword(userInfo.password);
    const newUser = this.createDefaultUserOBJ(userInfo, hashedPassword);
    const query = `
    INSERT INTO ${tableName} 
    (${columns.fullName}, ${columns.email}, ${columns.password}, ${columns.authProviderId}, ${columns.isRestaurantOwner}, ${columns.primaryAddressId}) 
    values (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      newUser.fullName,
      newUser.email,
      newUser.password,
      newUser.authProviderId,
      newUser.isRestaurantOwner,
      newUser.primaryAddressId,
    ];

    parseSchemaThrowZodErrors(userRegistrationSchema, userInfo);

    // email is uniqe so if there are duplicates it will throw an error
    try {
      const [results] = await executeQuery<ResultSetHeader>(connection, {
        query,
        params,
      });
      return { ...newUser, id: results.insertId };
    } catch (error) {
      throw new FunctionError("Email already exist.", 409);
    }
  };
  // userLoginHandler = async (
  //   connection: PoolConnection,
  //   credentials: Credentials
  // ) => {
  //   const user = await this.verifyUser(connection, credentials);
  //   //means user exist
  //   if (user) return user;

  // };
}

export const localProvider = new LocalProvider();
