import { NextFunction, Request, Response } from "express";
import { DB } from "../utils/DB/tables";
import {
  TransactionQuery,
  executeQuery,
  executeSingleQuery,
  pool,
} from "../utils/DB/dbConfig";
import { Address, addressSchema } from "../models/Address";
// import { FunctionError } from "../models/Errors/ErrorConstructor";
import { geocoder } from "../utils/nominatimGeocoding";
import { parseSchemaThrowZodErrors } from "../models/Errors/ZodErrors";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { AssertUserInReq } from "../models/User";
import { verifyUser } from "../middleware/verifyAuth";
import { handleErrorTypes } from "../middleware/errorHandler";

type GetAddressByIdParams = {
  addressId: string;
};

export const getAddressByIdLogic = async (
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
    next(handleErrorTypes(error));
  }
};

type AddAddressReqBody = Omit<Address, "id" | "coordinates">;
type AddAddressReq = Request<unknown, Address, AddAddressReqBody>;
export const addAddressLogic = async (
  req: AddAddressReq,
  res: Response<Address>,
  next: NextFunction
) => {
  //create transaction, add address, after that add addressId to user/restaurant
  let connection: PoolConnection | undefined = undefined;
  try {
    verifyUser(req);
    const addressWithoutId = await getCoordsAndturnUndefinedToNull(req);
    const addressParams = await getCoordsAndAddressQuery(addressWithoutId);

    connection = await pool.getConnection();
    await connection.beginTransaction();
    //add address
    const [addressRes] = await executeQuery<ResultSetHeader>(
      connection,
      addressParams
    );
    const addressId = addressRes.insertId;
    //need to check if the update is for restaurant or a user
    const updateParams = updateUserAddressIdQuery(req, addressId);
    await executeQuery<ResultSetHeader>(connection, updateParams);

    await connection.commit();
    //need to return address;
    res.status(204).json({ ...addressWithoutId, id: addressId });
  } catch (error) {
    console.log(error);
    await connection?.rollback();
    next(handleErrorTypes(error));
  } finally {
    connection?.release();
  }
};

async function getCoordsAndturnUndefinedToNull<
  T extends { body: AddAddressReqBody }
>(req: T) {
  const addressObj = turnUndefinedToNull(
    req.body,
    "state",
    "entrance",
    "apartment"
  );
  const coordinates = await geocoder.geocode(req.body);
  parseSchemaThrowZodErrors(addressSchema, {
    ...addressObj,
    coordinates,
  });
  return { ...addressObj, coordinates };
}

async function getCoordsAndAddressQuery(
  addressObj: Awaited<ReturnType<typeof getCoordsAndturnUndefinedToNull>>
) {
  const { columns, tableName } = DB.tables.addresses;
  const params = [
    addressObj.building,
    addressObj.country,
    addressObj.state,
    addressObj.street,
    addressObj.city,
    addressObj.apartment,
    addressObj.entrance,
    addressObj.coordinates,
  ];
  const query = `INSERT INTO ${tableName} 
  (${columns.building}, ${columns.country}, ${columns.state}, ${columns.street}, ${columns.city}, ${columns.apartment}, ${columns.entrance}, ${columns.coordinates})
  VALUES(?,?,?,?,?,?,?,?)`;
  return { params, query };
}

function updateUserAddressIdQuery(
  req: AssertUserInReq<AddAddressReq>,
  addressId: number
): TransactionQuery {
  const { columns, tableName } = DB.tables.users;
  const { id } = req.user;
  const query = `UPDATE ${tableName}
  SET ${columns.primaryAddressId} = ?
  WHERE ${columns.id} = ?`;
  const params = [addressId, id];
  return { params, query };
}

// function updateRestaurantAddressIdQuery(
//   req: AssertUserInReq<AddAddressReq>,
//   addressId: number
// ): TransactionQuery {
//   const { restaurantId } = req.query;
//   const { user } = req;
//   if (!restaurantId) throw new FunctionError("RestaurantId is required", 400);
//   const { columns, tableName } = DB.tables.restaurant_owner_address;
//   const query = `UPDATE ${tableName}
//   SET ${columns.addressId} = ?
//   WHERE ${columns.restaurantId} = ? AND ${columns.userId} = ?`;
//   const params = [addressId, restaurantId, user.id];
//   return { params, query };
// }
//////////////

type UpdateAddressReqBody = AddAddressReqBody;
type UpdateAddressReqQuery = { restaurantId?: string };
type UpdateAddressReq = Request<
  unknown,
  Address,
  UpdateAddressReqBody,
  UpdateAddressReqQuery
>;
export async function updateAddressLogic(
  req: UpdateAddressReq
  // res: Response<Address>,
  // next: NextFunction
) {
  let connection: PoolConnection | undefined = undefined;
  try {
    verifyUser(req);
    const addressWithoutId = await getCoordsAndturnUndefinedToNull(req);

    connection = await pool.getConnection();
    await connection.beginTransaction();
    //create update address query / update user query
  } catch (error) {}
}

type ReplaceUndefinedWithNull<T> = T extends undefined
  ? NonNullable<T> | null
  : T;

function turnUndefinedToNull<
  T extends Record<string, unknown>,
  K extends keyof T
>(
  obj: T,
  ...keys: K[]
): {
  [P in keyof T]: P extends K ? ReplaceUndefinedWithNull<T[P]> : T[P];
} {
  keys.forEach((key) => {
    if (obj[key] === undefined) {
      obj[key] = null as T[K];
    }
  });
  return { ...obj } as {
    [P in keyof T]: P extends K ? ReplaceUndefinedWithNull<T[P]> : T[P];
  };
}
