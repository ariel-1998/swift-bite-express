import { NextFunction, Request, Response } from "express";
import { executeQuery, executeSingleQuery, pool } from "../utils/DB/dbConfig";
import { Address, AddressSchema } from "../models/Address";
import { FunctionError } from "../models/Errors/ErrorConstructor";
import { getCoordsAndParseAddress } from "../utils/nominatimGeocoding";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { verifyUser } from "../middleware/verifyAuth";
import { userQueries } from "../utils/DB/queries/userQueries";
import { addressQueries } from "../utils/DB/queries/addressQueries";
import { restauransOwnerAddressQueries } from "../utils/DB/queries/restauransOwnerAddressQueries";
import {
  verifyIsOwner,
  verifyOwnershipByRestaurantIdAndUserId,
} from "../middleware/isRestaurantOwner";

type GetAddressByIdParams = {
  addressId: string;
};

export const getAddressById = async (
  req: Request<GetAddressByIdParams>,
  res: Response<AddressSchema>,
  next: NextFunction
) => {
  try {
    const { addressId } = req.params;
    const { params, query } = addressQueries.getAddressByIdQuery(+addressId);
    const [rows] = await executeSingleQuery<AddressSchema[]>(query, params);
    const address = rows[0];
    if (!address) res.sendStatus(404);
    res.status(200).json(address);
  } catch (error) {
    next(error);
  }
};

// maybe add addAddress req.query.restaurantId to check if
type AddressReqQuery = { restaurantId?: string };
export type AddressReqBody = Omit<Address, "id" | "longitude" | "latitude">;
export type AddAddressReq = Request<
  unknown,
  unknown,
  AddressReqBody,
  AddressReqQuery
>;
export const addAddress = async (
  req: AddAddressReq,
  res: Response<AddressSchema>,
  next: NextFunction
) => {
  //create transaction, add address, after that add addressId to user/restaurant
  let connection: PoolConnection | undefined = undefined;
  try {
    verifyUser(req);
    //if user already create an address prevent from creating more than 1
    const restaurantId = req.query.restaurantId;
    if (restaurantId) verifyIsOwner(req);
    const { user } = req;
    const addressWithoutId = await getCoordsAndParseAddress(req.body);
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
      const isOwner = await verifyOwnershipByRestaurantIdAndUserId(
        connection,
        +restaurantId,
        user.id
      );
      if (isOwner.addressId) {
        throw new FunctionError(
          "Address was already created for this restaurant",
          400
        );
      }
      const [addressRes] = await executeQuery<ResultSetHeader>(
        connection,
        addressParams
      );
      addedAddressId = addressRes.insertId;
      //create add RestauransOwnerAddressTable query
      const addRowQuery = restauransOwnerAddressQueries.updateAddressInRow({
        addressId: addedAddressId,
        restaurantId: +restaurantId,
        userId: user.id,
      });
      // add RestauransOwnerAddressTable row
      await executeQuery(connection, addRowQuery);
    }

    await connection.commit();
    //need to return address;
    res.status(201).json({ ...addressWithoutId, id: addedAddressId });
  } catch (error) {
    console.log(error);

    await connection?.rollback();
    next(error);
  } finally {
    connection?.release();
  }
};

type UpdateAddressReq = Request<
  unknown,
  unknown,
  AddressReqBody,
  AddressReqQuery
>;
export async function updateAddress(
  req: UpdateAddressReq,
  res: Response<AddressSchema>,
  next: NextFunction
) {
  let connection: PoolConnection | undefined = undefined;
  try {
    verifyUser(req);
    const user = req.user;
    const restaurantId = req.query.restaurantId;
    if (restaurantId) verifyIsOwner(req);

    const addressWithoutId = await getCoordsAndParseAddress(req.body);
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
      const isOwner = await verifyOwnershipByRestaurantIdAndUserId(
        connection,
        +restaurantId,
        user.id
      );
      if (!isOwner.addressId)
        throw new FunctionError(
          "Cannot update Aaddress before creating one",
          400
        );
      const updateAddressQuery = addressQueries.updateAddressQuery(
        addressWithoutId,
        isOwner.addressId
      );
      await executeQuery<ResultSetHeader>(connection, updateAddressQuery);
      updatedAddressId = isOwner.addressId;
    }
    await connection.commit();
    res.status(200).json({ ...addressWithoutId, id: updatedAddressId });
  } catch (error) {
    console.log(error);
    await connection?.rollback();
    next(error);
  } finally {
    connection?.release();
  }
}

// type RemoveAddressReq = Request<unknown, unknown, unknown, AddressReqQuery>;
// export async function removeAddress(
//   req: RemoveAddressReq,
//   res: Response<undefined>,
//   next: NextFunction
// ) {
//   let connection: PoolConnection | undefined = undefined;
//   try {
//     verifyUser(req);
//     const user = req.user;
//     const restaurantId = req.query.restaurantId;
//     connection = await pool.getConnection();
//     await connection.beginTransaction();
//     if (!restaurantId) {
//       if (!user.primaryAddressId) return res.sendStatus(204);
//       //delete address from addresses
//       const deleteAddressQuery = addressQueries.deleteAddressQuery(
//         user.primaryAddressId
//       );
//       await executeQuery(connection, deleteAddressQuery);
//       //update user primaryAddressId to null
//       ////////////////
//       const updateAddressIdQuery = userQueries.updateUserAddressIdQuery(
//         user,
//         null
//       ); //might not be needed because i set on delete to null
//       await executeQuery(connection, updateAddressIdQuery);
//       /////////////////
//     } else {
//       //check if isRestaurantOwner
//       const errMsg = `You do not have permission to modify the address of this restaurant.`;
//       if (!user.isRestaurantOwner) throw new FunctionError(errMsg, 403);
//       //check if owner of this specific restaurant with db query
//       const isOwnerQuery =
//         restauransOwnerAddressQueries.getRowByUserIdAndRestaurantId(
//           +restaurantId,
//           user.id
//         );
//       const [isOwnerRows] = await executeQuery<RestauransOwnerAddressTable[]>(
//         connection,
//         isOwnerQuery
//       );
//       const isOwner = isOwnerRows[0];
//       //if not throw error
//       if (!isOwner) throw new FunctionError(errMsg, 403);
//       //if addressId not exist that means he didnt create one at all so return success as deleted
//       if (!isOwner.addressId) return res.sendStatus(204);
//       //delete address from addresses
//       const deleteAddressQuery = addressQueries.deleteAddressQuery(
//         isOwner.addressId
//       );
//       await executeQuery(connection, deleteAddressQuery);
//       //delete restaurant_owner_addresses column where userid and restaurantId are the same
//       ///////////////////
//       const deleteRowQuery = restauransOwnerAddressQueries.updateAddressInRow({
//         addressId: null,
//         restaurantId: isOwner.restaurantId,
//         userId: isOwner.userId,
//       }); //might not be needed because i set on delete to null
//       await executeQuery(connection, deleteRowQuery);
//       ////////////////////
//     }
//     await connection.commit();
//     res.sendStatus(204);
//   } catch (error) {
//     await connection?.rollback();
//     next(error);
//   } finally {
//     connection?.release();
//   }
// }

type ConvertAddressToCoordsReq = Request<unknown, unknown, AddressReqBody>;
export async function convertAddressToCoords(
  req: ConvertAddressToCoordsReq,
  res: Response<Omit<AddressSchema, "id">>,
  next: NextFunction
) {
  try {
    const addressWithoutId = await getCoordsAndParseAddress(req.body);
    res.status(200).json(addressWithoutId);
  } catch (error) {
    next(error);
  }
}
