import { NextFunction, Request, Response } from "express";
import { DB } from "../utils/DB/tables";
import { executeQuery, executeSingleQuery, pool } from "../utils/DB/dbConfig";
import { Address, addressSchema } from "../models/Address";
import { FunctionError } from "../models/Errors/ErrorConstructor";
import { nominatimGeocoding } from "../utils/nominatimGeocoding";
import { parseSchemaThrowZodErrors } from "../models/Errors/ZodErrors";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";

type GetAddressByIdParams = {
  addressId: string;
};

export const getAddressById = async (
  req: Request<GetAddressByIdParams>,
  res: Response<Address>,
  next: NextFunction
) => {
  try {
    const { addressId } = req.params;
    const { columns, tableName } = DB.tables.addresses;
    const query = `SELECT * FROM ${tableName} WHERE ${columns.id} = ?`;
    const params = [addressId];
    const [rows] = await executeSingleQuery<Address[]>(query, params);
    const address = rows[0];
    if (!address) res.sendStatus(404);
    res.status(200).json(address);
  } catch (error) {
    if (error instanceof FunctionError) return next(error);
    next(new FunctionError("Server Error", 500));
  }
};

type AddAddressReqBody = Omit<Address, "id" | "coordinates">;

export const addAddress = async (
  req: Request<unknown, unknown, AddAddressReqBody>
  //   res: Response<Address>,
  //   next: NextFunction
) => {
  // need to check how to validate type with typescript so ne error after schema validation
  addressSchema.parse(req.body);
  const { building, country, state, street, apartment, entrance } = req.body;
  const coordinates = await nominatimGeocoding.convertAddressToCoords({
    building,
    country,
    state,
    street,
  });

  parseSchemaThrowZodErrors(addressSchema, {
    ...req.body,
    coordinates,
  });

  const { columns, tableName } = DB.tables.addresses;
  const addressParams = [building, country, state, street, apartment, entrance];
  const addressQuery = `INSERT INTO ${tableName} 
    (${columns.building}, ${columns.country}, ${columns.state}, ${columns.street}, ${columns.apartment}, ${columns.entrance},)
    `;
  //create transaction, add address, after that add addressId to user/restaurant

  let connection: PoolConnection | undefined = undefined;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    //add address
    const [rows] = await executeQuery<ResultSetHeader>(connection, {
      //need to fix address params undefined to null
      params: addressParams,
      query: addressQuery,
    });

    //need to check if the update is for restaurant or a user
    const updateUserQuery = `UPDATE `;
    //if user then update the req.user.id user to have this primaryAddressId as this insertId

    //if restaurant then check if user is the owner of this restaurant and update if he is
    const updateUserAddress = await connection.commit();
  } catch (error) {
    await connection?.rollback();
  } finally {
    connection?.release();
  }
};
