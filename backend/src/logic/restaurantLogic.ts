import { NextFunction, Request, Response } from "express";
import {
  NestedRestaurantAndAddress,
  Restaurant,
  RestaurantJoinedWithAddress,
  imageSchema,
  restaurantSchema,
} from "../models/Restaurant";
import { verifyUser } from "../middleware/verifyAuth";
import { restaurantQueries } from "../utils/DB/queries/restaurantQueries";
import {
  ReplaceUndefinedWithNull,
  rearrangeRestaurantAddressDataArray,
} from "../utils/helperFunctions";
import { parseSchemaThrowZodErrors } from "../models/Errors/ZodErrors";
import {
  TransactionQuery,
  executeQuery,
  executeSingleQuery,
  pool,
} from "../utils/DB/dbConfig";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { FunctionError } from "../models/Errors/ErrorConstructor";
import { userQueries } from "../utils/DB/queries/userQueries";
import { IsOwner } from "../models/User";
import { handleErrorTypes } from "../middleware/errorHandler";
import { restauransOwnerAddressQueries } from "../utils/DB/queries/restauransOwnerAddressQueries";
import { UploadedFile } from "express-fileupload";
import { cloudinary } from "../utils/cloudinaryConfig";
import { Coordinates } from "../models/Address";
import { RestauransOwnerAddressTable } from "../models/RestauransOwnerAddressTable";
import { UploadApiResponse } from "cloudinary";

//need to add jooins to join address to restaurants!!!!!!!!!!!!!
type getSingleRestaurantReq = Request<{ restaurantId: string }>;
export async function getSingleRestaurantById(
  req: getSingleRestaurantReq,
  res: Response<NestedRestaurantAndAddress>,
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
  res: Response<NestedRestaurantAndAddress[]>,
  next: NextFunction
) {
  let connection: PoolConnection | undefined = undefined;
  console.log(req.query);
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
    const [rows] = await executeQuery<NestedRestaurantAndAddress[]>(
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
  CoordinatesInParams & { page?: string }
>;
export async function searchRestaurants(
  req: SearchRestaurant,
  res: Response<Restaurant[]>,
  next: NextFunction
) {
  let connection: PoolConnection | undefined = undefined;
  try {
    const { search } = req.params;
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

    const searchQuery = restaurantQueries.searchRestaurantByName(
      search,
      +coords.longitude,
      +coords.latitude,
      +page
    );
    const [rows] = await executeQuery<Restaurant[]>(connection, searchQuery);
    res.status(200).json(rows);
  } catch (error) {
    next(handleErrorTypes(error));
  } finally {
    connection?.release();
  }
}

export type RestaurantReq = Request<unknown, unknown, Pick<Restaurant, "name">>;
export async function addRestaurant(
  req: RestaurantReq,
  res: Response<NestedRestaurantAndAddress>,
  next: NextFunction
) {
  let connection: PoolConnection | undefined = undefined;
  let imgPublicId: string | null = null;
  let logoPublicId: string | null = null;
  try {
    verifyUser(req);
    const user = req.user;
    const files = req.files;

    let image: UploadedFile | undefined = undefined;
    let logoImage: UploadedFile | undefined = undefined;

    if (files?.image) {
      image = files.image as UploadedFile;
      parseSchemaThrowZodErrors(imageSchema, image);
      const imageResponse = await cloudinary.uploadImage(image.tempFilePath);
      imgPublicId = imageResponse.public_id;
    }
    if (files?.logoImage) {
      logoImage = files.logoImage as UploadedFile;
      parseSchemaThrowZodErrors(imageSchema, logoImage);
      const logoResponse = await cloudinary.uploadImage(logoImage.tempFilePath);
      logoPublicId = logoResponse.public_id;
    }
    const restaurant = {
      ...req.body,
      imgPublicId,
      logoPublicId,
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
    if (imgPublicId) await cloudinary.deleteImage(imgPublicId);
    if (logoPublicId) await cloudinary.deleteImage(logoPublicId);
    await connection?.rollback();
    next(handleErrorTypes(error));
  } finally {
    connection?.release();
  }
}
//check if works
// type UpdateRestaurantImage = Request<
//   { restaurantId: string },
//   unknown,
//   unknown,
//   { image?: boolean; logoImage?: boolean; name?: string }
// >;
// export async function updateRestaurant(
//   req: UpdateRestaurantImage,
//   response: Response<NestedRestaurantAndAddress>,
//   next: NextFunction
// ) {
//   let connection: PoolConnection | undefined = undefined;

//   try {
//     verifyUser(req);
//     const user = req.user;
//     const { restaurantId } = req.params;
//     if (!user.isRestaurantOwner) {
//       throw new FunctionError(
//         "You do not have premission to update this restaurant",
//         403
//       );
//     }
//     //check if correct or if always return an obj
//     if (!req.query) {
//       throw new FunctionError(
//         "image | logoImage | name, Are required in Query",
//         400
//       );
//     }
//     connection = await pool.getConnection();

//     const isRestaurantOwnerQuery =
//       restauransOwnerAddressQueries.getRowByUserIdAndRestaurantId(
//         +restaurantId,
//         user.id
//       );

//     const [data] = await executeQuery<RestauransOwnerAddressTable[]>(
//       connection,
//       isRestaurantOwnerQuery
//     );
//     if (!data.length) {
//       throw new FunctionError(
//         "You do not have premission to update this restaurant",
//         403
//       );
//     }

//     if (req.query.name) {
//       //update name
//     } else if (req.files?.image || req.files?.logoImage) {
//       const files = req.files;
//       let imageResponse: UploadApiResponse = {} as UploadApiResponse;

//       if (!files.image && !files.logoImage) {
//         throw new FunctionError("Bad Request: image file wasn't sent", 400);
//       }

//       if (req.query.image) {
//         //update image
//         const image = files.image;
//         if (!image) {
//           throw new FunctionError("Bad Request: image file wasn't sent", 400);
//         }
//         parseSchemaThrowZodErrors(imageSchema, image);
//         imageResponse = await cloudinary.uploadImage(image.tempFilePath);
//       } else if (req.query.logoImage) {
//         //update logoImage
//         const logoImage = files.logoImage;
//         if (!logoImage) {
//           throw new FunctionError("Bad Request: image file wasn't sent", 400);
//         }
//         parseSchemaThrowZodErrors(imageSchema, logoImage);
//         imageResponse = await cloudinary.uploadImage(logoImage.tempFilePath);
//       }
//       const updateRestaurantQuery =
//         restaurantQueries.updateRestaurantImgPublicId(
//           +restaurantId,
//           imageResponse.public_id
//         );
//       await executeQuery(connection, updateRestaurantQuery);
//       const getRestaurantQuery = restaurantQueries.getSingleRestaurantById(
//         +restaurantId
//       );

//       const [rows] = await executeQuery<RestaurantJoinedWithAddress[]>(
//         connection,
//         getRestaurantQuery
//       );
//       const rearrangedData = rearrangeRestaurantAddressDataArray(rows);
//       response.status(200).json(rearrangedData[0]);
//     } else {
//       throw new FunctionError("Bad Request", 400);
//     }
//   } catch (error) {
//     next(handleErrorTypes(error));
//   } finally {
//     connection?.release();
//   }
// }

// type UpdateRestaurantLogo = Request<{ restaurantId: string }> & {
//   files?: { logoImage?: UploadedFile };
// };

//check if works
// export function updateRestaurantLogo(
//   req: UpdateRestaurantLogo,
//   response: Response<NestedRestaurantAndAddress>,
//   next: NextFunction
// ) {
//   let connection: PoolConnection | undefined = undefined;
// try {

// } catch (error) {
//   next(handleErrorTypes(error));
// } finally {
//   connection?.release()
// }
// }

type UpdateRestaurant = Request<
  { restaurantId: string },
  unknown,
  unknown,
  { image?: boolean; logoImage?: boolean; name?: string }
>;
export async function updateRestaurant(
  req: UpdateRestaurant,
  res: Response<NestedRestaurantAndAddress>,
  next: NextFunction
) {
  let connection: PoolConnection | undefined = undefined;
  try {
    verifyUser(req);
    const {
      query,
      user,
      params: { restaurantId },
    } = req;
    //check that query was sent as its required
    if (!query.image && !query.logoImage && !query.name) {
      throw new FunctionError(
        "image | logoImage | name, Are required in Query",
        400
      );
    }
    connection = await pool.getConnection();
    //check if user is the owner of the requested restaurant
    //i might make it a middleware
    const isRestaurantOwnerQuery =
      restauransOwnerAddressQueries.getRowByUserIdAndRestaurantId(
        +restaurantId,
        user.id
      );

    const [data] = await executeQuery<RestauransOwnerAddressTable[]>(
      connection,
      isRestaurantOwnerQuery
    );
    if (!data.length) {
      throw new FunctionError(
        "You do not have premission to update this restaurant",
        403
      );
    }

    let updateQuery: TransactionQuery;
    if (query.name) {
      updateQuery = restaurantQueries.updateRestaurantName(
        +restaurantId,
        query.name
      );
    } else {
      if (!req.files || Object.values(req.files).length) {
        throw new FunctionError("image was not sent in request", 400);
      }
      const image = Object.values(req.files)[0] as UploadedFile;
      parseSchemaThrowZodErrors(imageSchema, image);
      const imageResponse = await cloudinary.uploadImage(image.tempFilePath);
      if (query.image) {
        updateQuery = restaurantQueries.updateRestaurantImgPublicId(
          +restaurantId,
          imageResponse.public_id
        );
      } else {
        updateQuery = restaurantQueries.updateRestaurantlogoPublicId(
          +restaurantId,
          imageResponse.public_id
        );
      }
    }
    await executeQuery(connection, updateQuery);
    const getRestaurantQuery = restaurantQueries.getSingleRestaurantById(
      +restaurantId
    );

    const [rows] = await executeQuery<RestaurantJoinedWithAddress[]>(
      connection,
      getRestaurantQuery
    );
    const rearrangedData = rearrangeRestaurantAddressDataArray(rows);
    res.status(200).json(rearrangedData[0]);
  } catch (error) {
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
