import { NextFunction, Request, Response } from "express";
import {
  NestedRestauranAndAddress,
  Restaurant,
  RestaurantJoinedWithAddress,
  restaurantSchema,
} from "../models/Restaurant";
import { verifyUser } from "../middleware/verifyAuth";
import { restaurantQueries } from "../utils/DB/queries/restaurantQueries";
import {
  ReplaceUndefinedWithNull,
  rearrangeRestaurantAddressDataArray,
} from "../utils/helperFunctions";
import { parseSchemaThrowZodErrors } from "../models/Errors/ZodErrors";
import { executeQuery, executeSingleQuery, pool } from "../utils/DB/dbConfig";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { FunctionError } from "../models/Errors/ErrorConstructor";
import { userQueries } from "../utils/DB/queries/userQueries";
import { IsOwner } from "../models/User";
import { handleErrorTypes } from "../middleware/errorHandler";
import { restauransOwnerAddressQueries } from "../utils/DB/queries/restauransOwnerAddressQueries";
import { UploadedFile } from "express-fileupload";
import { cloudinary } from "../utils/cloudinaryConfig";
import { Coordinates } from "../models/Address";

//need to add jooins to join address to restaurants!!!!!!!!!!!!!
type getSingleRestaurantReq = Request<{ restaurantId: string }>;
export async function getSingleRestaurantById(
  req: getSingleRestaurantReq,
  res: Response<NestedRestauranAndAddress>,
  next: NextFunction
) {
  try {
    const { restaurantId } = req.params;
    const { params, query } = restaurantQueries.getSingleRestaurantById(
      +restaurantId
    );
    const [rows] = await executeSingleQuery<RestaurantJoinedWithAddress[]>(
      query,
      params
    );
    if (!rows.length) throw new FunctionError("Restaurant Not Found.", 404);
    const rearrangedData = rearrangeRestaurantAddressDataArray(rows);
    res.status(200).json(rearrangedData[0]);
  } catch (error) {
    next(handleErrorTypes(error));
  }
}

type GetRestaurantsByPage = Request<
  unknown,
  unknown,
  unknown,
  CoordinatesInParams & { page?: string }
>;
//check if works
export async function getRestaurantsByPage(
  req: GetRestaurantsByPage,
  res: Response<NestedRestauranAndAddress[]>,
  next: NextFunction
) {
  let connection: PoolConnection | undefined = undefined;
  try {
    const { longitude, latitude, page } = req.query;
    if (!page) {
      throw new FunctionError("Bad Request: page is required in query", 400);
    }
    if (isNaN(+page) || +page < 1) {
      throw new FunctionError("Bad Request: page must be a valid number", 400);
    }
    let coords: Required<Coordinates> = {
      latitude: 48.8584,
      longitude: 2.2945,
    };
    if (longitude && latitude)
      coords = { longitude: +longitude, latitude: +latitude };

    connection = await pool.getConnection();
    //continue with coords now

    const getRestaurantsQuery = restaurantQueries.getRestaurantsByPage(
      +page,
      coords.longitude,
      coords.latitude
    );
    const [rows] = await executeQuery<NestedRestauranAndAddress[]>(
      connection,
      getRestaurantsQuery
    );
    const rearrangedData = rearrangeRestaurantAddressDataArray(rows);
    res.status(200).json(rearrangedData);
  } catch (error) {
    next(handleErrorTypes(error));
  } finally {
    connection?.release();
  }
}

type CoordinatesInParams = { longitude?: string; latitude?: string };
type SearchRestaurant = Request<
  { search: string },
  unknown,
  unknown,
  CoordinatesInParams
>;
export async function searchRestaurants(
  req: SearchRestaurant,
  res: Response<Restaurant[]>,
  next: NextFunction
) {
  let connection: PoolConnection | undefined = undefined;
  try {
    const { search } = req.params;
    const { longitude, latitude } = req.query;
    let coords: Required<Coordinates> = {
      latitude: 48.8584,
      longitude: 2.2945,
    };
    if (longitude && latitude)
      coords = { longitude: +longitude, latitude: +latitude };

    connection = await pool.getConnection();

    const searchQuery = restaurantQueries.searchRestaurantByName(
      search,
      +coords.longitude,
      +coords.latitude
    );
    const [rows] = await executeQuery<Restaurant[]>(connection, searchQuery);
    res.status(200).json(rows);
  } catch (error) {
    next(handleErrorTypes(error));
  } finally {
    connection?.release();
  }
}

type RestaurantReq = Request<unknown, unknown, Pick<Restaurant, "name">>;
export async function addRestaurant(
  req: RestaurantReq,
  res: Response<NestedRestauranAndAddress>,
  next: NextFunction
) {
  let connection: PoolConnection | undefined = undefined;
  let imgPublicId: string | null = null;
  try {
    verifyUser(req);
    const user = req.user;
    const files = req.files;

    let image: UploadedFile | undefined = undefined;

    if (files?.file) {
      image = files.file as UploadedFile;
      const data = await cloudinary.uploadImage(image.tempFilePath);
      imgPublicId = data.public_id;
    }
    const restaurant = {
      ...req.body,
      imgPublicId,
    } satisfies ReplaceUndefinedWithNull<Omit<Restaurant, "id">>;
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
    res.status(201).json({ ...restaurant, id: restaurantId, address: {} });
  } catch (error) {
    if (imgPublicId) {
      try {
        await cloudinary.deleteImage(imgPublicId);
      } catch (error) {
        console.log(error);
      }
    }
    await connection?.rollback();
    next(handleErrorTypes(error));
  } finally {
    connection?.release();
  }
}

// export async function updateRestaurant() {}

// type DeleteRestaurantReq = Request<{ restaurantId: string }>;
// export async function deleteRestaurant(
//   req: DeleteRestaurantReq,
//   res: Response<Restaurant>,
//   next: NextFunction
// ) {
//   let connection: PoolConnection | undefined = undefined;

//   try {
//     const restaurantId = +req.params.restaurantId;
//     verifyUser(req);
//     const user = req.user;
//     if (!user.isRestaurantOwner) {
//       throw new FunctionError("Forbidden", 403);
//     }

//     //select resturant_address_user table by the restaurantId and user.id
//     const getUserAddressRestaurantQuery =
//       restauransOwnerAddressQueries.getRowByUserIdAndRestaurantId(
//         restaurantId,
//         user.id
//       );
//     //if found get the restaurant itself, delete the image of the restaurant by the imgPublicId
//     //also in th futue i will have to delete all the images of the menuItems that are connected to the restaurant, that will probably be a folder in cloudinary
//     //then delete the restaurant itself!! the rest should be automaticly deleted!!
//     //if not found throw error 400 bad request or 403 forbidden
//   } catch (error) {
//     await connection?.rollback();
//     next(handleErrorTypes(error));
//   } finally {
//     connection?.release();
//   }
// }
