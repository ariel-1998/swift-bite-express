import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { DB } from "../DB/tables";
import { executeQuery, pool } from "../DB/dbConfig";
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
import { Request } from "express";
import { handleErrorTypes } from "../../middleware/errorHandler";
import { VerifyCallback } from "passport-google-oauth20";

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
}

export const localProvider = new LocalProvider();

export const localSignupStrategy = async (
  req: Request<unknown, unknown, RegistrationData>,
  email: string,
  password: string,
  done: VerifyCallback
) => {
  let connection: PoolConnection | undefined = undefined;
  const userInfo: RegistrationData = {
    email,
    password,
    fullName: req.body.fullName,
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
    await connection?.rollback();
    const handledError = handleErrorTypes(error);
    done(handledError as Error);
  } finally {
    connection?.release();
  }
};

export const localLoginStrategy = async (
  email: string,
  password: string,
  done: VerifyCallback
): Promise<void> => {
  let connection: PoolConnection | undefined = undefined;
  try {
    connection = await pool.getConnection();
    const user = await localProvider.userLoginHandler(connection, {
      email,
      password,
    });

    done(null, user);
  } catch (error) {
    const handledError = handleErrorTypes(error);
    done(handledError as Error);
  } finally {
    connection?.release();
  }
};
