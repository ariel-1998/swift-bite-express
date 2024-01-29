import { NextFunction, Request, Response } from "express";
import { Restaurant, restaurantSchema } from "../models/Restaurant";
import { verifyUser } from "../middleware/verifyAuth";
import { restaurantQueries } from "../utils/DB/queries/restaurantQueries";
import { turnUndefinedToNull } from "../utils/helperFunctions";
import { parseSchemaThrowZodErrors } from "../models/Errors/ZodErrors";
import { executeQuery, executeSingleQuery, pool } from "../utils/DB/dbConfig";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { FunctionError } from "../models/Errors/ErrorConstructor";
import { userQueries } from "../utils/DB/queries/userQueries";
import { IsOwner } from "../models/User";
import { handleErrorTypes } from "../middleware/errorHandler";
import { restauransOwnerAddressQueries } from "../utils/DB/queries/restauransOwnerAddressQueries";
// import { Address } from "../models/Address";

// type RestaurantResponse = Restaurant & { address?: Address };

type getSingleRestaurantReq = Request<{ restaurantId: string }>;
export async function getSingleRestaurant(
  req: getSingleRestaurantReq,
  res: Response<Restaurant>,
  next: NextFunction
) {
  try {
    const { restaurantId } = req.params;
    const { params, query } = restaurantQueries.getSingleRestaurantQuery(
      +restaurantId
    );
    const [rows] = await executeSingleQuery<Restaurant[]>(query, params);
    const restaurant = rows[0];
    if (!restaurant) throw new FunctionError("Restaurant Not Found.", 404);
    res.status(200).json(restaurant);
  } catch (error) {
    next(handleErrorTypes(error));
  }
}

export async function getRestaurantsByPage() {}

type RestaurantReq = Request<unknown, unknown, Omit<Restaurant, "id">>;
export async function addRestaurant(
  req: RestaurantReq,
  res: Response<Restaurant>,
  next: NextFunction
) {
  let connection: PoolConnection | undefined = undefined;

  try {
    verifyUser(req);
    const user = req.user;
    const restaurant = turnUndefinedToNull(req.body, "imgUrl");
    parseSchemaThrowZodErrors(restaurantSchema, restaurant);
    const addRestaurantQuery = restaurantQueries.addRestaurant(restaurant);
    connection = await pool.getConnection();
    await connection.beginTransaction();
    //if an error thrown that means duplicate restaurant name
    let restaurantId: null | number = null;
    // add restaurant
    try {
      const [results] = await executeQuery<ResultSetHeader>(
        connection,
        addRestaurantQuery
      );
      restaurantId = results.insertId;
    } catch (error) {
      throw new FunctionError("Restaurant name already exist.", 409);
    }

    //if user is not owner of nothing yet then update isRestauranOwner to isOwner.True
    if (!user.isRestaurantOwner) {
      //update isRestauranOuwner to isOwner.True
      const updateIsOwnerQuery = userQueries.updateUserIsRestaurantOwner(
        IsOwner.true
      );
      await executeQuery(connection, updateIsOwnerQuery);
    }
    //add new row to restauransOwnerAddress
    const addRestauransOwnerAddressQuery = restauransOwnerAddressQueries.addRow(
      {
        addressId: null,
        restaurantId,
        userId: user.id,
      }
    );
    await executeQuery(connection, addRestauransOwnerAddressQuery);
    await connection.commit();
    res.status(201).json({ ...restaurant, id: restaurantId });
  } catch (error) {
    await connection?.rollback();
    next(handleErrorTypes(error));
  } finally {
    connection?.release();
  }
}

export async function updateRestaurant() {}
export async function deleteRestaurant() {}
