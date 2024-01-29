import { NextFunction, Request, Response } from "express";
import { executeQuery, executeSingleQuery, pool } from "../utils/DB/dbConfig";
import { Address } from "../models/Address";
import { FunctionError } from "../models/Errors/ErrorConstructor";
import { getCoordsAndturnUndefinedToNull } from "../utils/nominatimGeocoding";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { verifyUser } from "../middleware/verifyAuth";
import { handleErrorTypes } from "../middleware/errorHandler";
import { userQueries } from "../utils/DB/queries/userQueries";
import { addressQueries } from "../utils/DB/queries/addressQueries";
import { restauransOwnerAddressQueries } from "../utils/DB/queries/RestauransOwnerAddressQueries";
import { RestauransOwnerAddressTable } from "../models/RestauransOwnerAddressTable";

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
    const { params, query } = addressQueries.getAddressByIdQuery(+addressId);
    const [rows] = await executeSingleQuery<Address[]>(query, params);
    const address = rows[0];
    if (!address) res.sendStatus(404);
    res.status(200).json(address);
  } catch (error) {
    next(handleErrorTypes(error));
  }
};

// maybe add addAddress req.query.restaurantId to check if
export type AddressReqBody = Omit<Address, "id" | "coordinates">;
export type AddAddressReq = Request<
  unknown,
  Address,
  AddressReqBody,
  AddressReqQuery
>;
export const addAddress = async (
  req: AddAddressReq,
  res: Response<Address>,
  next: NextFunction
) => {
  //create transaction, add address, after that add addressId to user/restaurant
  let connection: PoolConnection | undefined = undefined;
  try {
    verifyUser(req);
    //if user already create an address prevent from creating more than 1
    const restaurantId = req.query.restaurantId;
    const { user } = req;
    const addressWithoutId = await getCoordsAndturnUndefinedToNull(req);
    const addressParams = addressQueries.AddAddressQuery(addressWithoutId);
    connection = await pool.getConnection();
    await connection.beginTransaction();

    let addedAddressId: number;

    if (!restaurantId) {
      if (user.primaryAddressId) {
        throw new FunctionError("Error: Address already created.", 400);
      }
      //add address
      const [addressRes] = await executeQuery<ResultSetHeader>(
        connection,
        addressParams
      );
      addedAddressId = addressRes.insertId;
      const updateParams = userQueries.updateUserAddressIdQuery(
        user,
        addedAddressId
      );
      await executeQuery<ResultSetHeader>(connection, updateParams);
    } else {
      const [addressRes] = await executeQuery<ResultSetHeader>(
        connection,
        addressParams
      );
      addedAddressId = addressRes.insertId;
      //create add RestauransOwnerAddressTable query
      const addRowQuery = restauransOwnerAddressQueries.addRow({
        addressId: addedAddressId,
        restaurantId: +restaurantId,
        userId: user.id,
      });
      // add RestauransOwnerAddressTable row
      await executeQuery(connection, addRowQuery);
    }

    await connection.commit();
    //need to return address;
    res.status(204).json({ ...addressWithoutId, id: addedAddressId });
  } catch (error) {
    await connection?.rollback();
    next(handleErrorTypes(error));
  } finally {
    connection?.release();
  }
};

type AddressReqQuery = { restaurantId?: string };
type UpdateAddressReq = Request<
  unknown,
  Address,
  AddressReqBody,
  AddressReqQuery
>;
export async function updateAddress(
  req: UpdateAddressReq,
  res: Response<Address>,
  next: NextFunction
) {
  let connection: PoolConnection | undefined = undefined;
  try {
    verifyUser(req);
    const user = req.user;

    const addressWithoutId = await getCoordsAndturnUndefinedToNull(req);
    const restaurantId = req.query.restaurantId;
    connection = await pool.getConnection();
    await connection.beginTransaction();
    let updatedAddressId: number;
    if (!restaurantId) {
      //cannot update if user primaryAddressId doesnt exist
      const addressId = user.primaryAddressId;
      if (!addressId) {
        throw new FunctionError(
          "Cannot update address before cretating one",
          400
        );
      }
      //update user address
      const updateQuery = addressQueries.updateAddressQuery(
        addressWithoutId,
        addressId
      );
      await executeQuery<ResultSetHeader>(connection, updateQuery);
      updatedAddressId = addressId;
    } else {
      //check if user is restaurant owner from req.user.isRestaurantOwner
      const errMsg = `You do not have permission to modify the address of this restaurant.`;
      if (!user.isRestaurantOwner) throw new FunctionError(errMsg, 403);
      //check if user is the owner of this restaurant
      const isOwnerQuery =
        restauransOwnerAddressQueries.getRowByUserIdAndRestaurantId(
          +restaurantId,
          user.id
        );
      const [isOwnerRows] = await executeQuery<RestauransOwnerAddressTable[]>(
        connection,
        isOwnerQuery
      );
      const isOwner = isOwnerRows[0];
      //if not throw error
      if (!isOwner) throw new FunctionError(errMsg, 403);
      //if owner update restaurant address
      const updateAddressQuery = addressQueries.updateAddressQuery(
        addressWithoutId,
        isOwner.addressId
      );
      await executeQuery<ResultSetHeader>(connection, updateAddressQuery);
      updatedAddressId = isOwner.addressId;
    }
    await connection.commit();
    res.status(204).json({ ...addressWithoutId, id: updatedAddressId });
  } catch (error) {
    await connection?.rollback();
    next(handleErrorTypes(error));
  } finally {
    connection?.release();
  }
}

type RemoveAddressReq = Request<unknown, Address, unknown, AddressReqQuery>;
export async function removeAddress(
  req: RemoveAddressReq,
  res: Response<undefined>,
  next: NextFunction
) {
  let connection: PoolConnection | undefined = undefined;
  try {
    verifyUser(req);
    const user = req.user;
    const restaurantId = req.query.restaurantId;
    connection = await pool.getConnection();
    await connection.beginTransaction();
    if (!restaurantId) {
      if (!user.primaryAddressId) return res.sendStatus(204);
      //delete address from addresses
      const deleteAddressQuery = addressQueries.deleteAddressQuery(
        user.primaryAddressId
      );
      await executeQuery(connection, deleteAddressQuery);
      //update user primaryAddressId to null
      const updateAddressIdQuery = userQueries.updateUserAddressIdQuery(
        user,
        null
      );
      await executeQuery(connection, updateAddressIdQuery);
    } else {
      //check if isRestaurantOwner
      const errMsg = `You do not have permission to modify the address of this restaurant.`;
      if (!user.isRestaurantOwner) throw new FunctionError(errMsg, 403);
      //check if owner of this specific restaurant with db query
      const isOwnerQuery =
        restauransOwnerAddressQueries.getRowByUserIdAndRestaurantId(
          +restaurantId,
          user.id
        );
      const [isOwnerRows] = await executeQuery<RestauransOwnerAddressTable[]>(
        connection,
        isOwnerQuery
      );
      const isOwner = isOwnerRows[0];
      //if not throw error
      if (!isOwner) throw new FunctionError(errMsg, 403);
      //delete address from addresses
      const deleteAddressQuery = addressQueries.deleteAddressQuery(
        isOwner.addressId
      );
      await executeQuery(connection, deleteAddressQuery);
      //delete restaurant_owner_addresses column where userid and restaurantId are the same
      const deleteRowQuery = restauransOwnerAddressQueries.deleteRow(
        isOwner.restaurantId,
        isOwner.userId,
        isOwner.addressId
      );
      await executeQuery(connection, deleteRowQuery);
    }
    await connection.commit();
    res.sendStatus(204);
  } catch (error) {
    await connection?.rollback();
    next(handleErrorTypes(error));
  } finally {
    connection?.release();
  }
}
