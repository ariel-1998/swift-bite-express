import { NextFunction, Request, Response } from "express";
import { Restaurant, restaurantSchema } from "../models/Restaurant";
import { verifyUser } from "../middleware/verifyAuth";
import { restaurantQueries } from "../utils/DB/queries/restaurantQueries";
import { ReplaceUndefinedWithNull } from "../utils/helperFunctions";
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

// type RestaurantResponse = Restaurant & { address?: Address };
//need to add jooins to join address to restaurants!!!!!!!!!!!!!
type getSingleRestaurantReq = Request<{ restaurantId: string }>;
export async function getSingleRestaurantById(
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

type RestaurantReq = Request<unknown, unknown, Pick<Restaurant, "name">>;
export async function addRestaurant(
  req: RestaurantReq,
  res: Response<Restaurant>,
  next: NextFunction
) {
  let connection: PoolConnection | undefined = undefined;
  let imgUrl: string | null = null;
  let imgPublicId: string | null = null;
  try {
    verifyUser(req);
    const user = req.user;
    const files = req.files;

    let image: UploadedFile | undefined = undefined;

    if (files?.file) {
      image = files.file as UploadedFile;
      const data = await cloudinary.uploadImage(image.tempFilePath);
      imgUrl = data.url;
      imgPublicId = data.public_id;
    }
    const restaurant = {
      ...req.body,
      imgUrl,
      imgPublicId,
    } satisfies ReplaceUndefinedWithNull<Omit<Restaurant, "id">>;
    parseSchemaThrowZodErrors(restaurantSchema, restaurant);
    console.log(restaurant);
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

export async function updateRestaurant() {}

type DeleteRestaurantReq = Request<{ restaurantId: string }>;
export async function deleteRestaurant(
  req: DeleteRestaurantReq,
  res: Response<Restaurant>,
  next: NextFunction
) {
  let connection: PoolConnection | undefined = undefined;

  try {
    const { restaurantId } = req.params;
    verifyUser(req);
    const user = req.user;
    if (!user.isRestaurantOwner) {
      throw new FunctionError("Forbidden", 403);
    }

    //select resturant_address_user table by the restaurantId and user.id
    //if found get the restaurant itself, delete the image of the restaurant by the imgPublicId
    //then delete the restaurant itself!! the rest should be automaticly deleted!!
    //if not found throw error 400 bad request or 403 forbidden
  } catch (error) {
    await connection?.rollback();
    next(handleErrorTypes(error));
  } finally {
    connection?.release();
  }
}
