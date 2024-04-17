import { NextFunction, Request, Response } from "express";
import {
  MenuItem,
  MenuItemWOptions,
  MenuItemWCategoryAndOptions,
  menuItemSchema,
  CategoriesNestedInMenuItem,
} from "../models/MenuItem";
import { UploadedFile } from "express-fileupload";
import { cloudinary } from "../utils/cloudinaryConfig";
import { menuItemsQueries } from "../utils/DB/queries/MenuItemsQueries";
import { executeQuery, executeSingleQuery, pool } from "../utils/DB/dbConfig";
import { ResultSetHeader } from "mysql2";
import { FunctionError } from "../models/Errors/ErrorConstructor";
import {
  TurnUndefinedToNullInObj,
  rearrangeMenuItemsForOwner,
} from "../utils/helperFunctions";
import { imageSchema } from "../models/Restaurant";
import { Role } from "../models/User";
import { PoolConnection } from "mysql2/promise";

type MenuItemIdParams = { menuItemId: string };
export async function getMenuItemById(
  req: Request<MenuItemIdParams>,
  res: Response<MenuItemWOptions>,
  next: NextFunction
) {
  try {
    const { menuItemId } = req.params;
    const { params, query } = menuItemsQueries.getMenuItemById(+menuItemId);
    const [rows] = await executeSingleQuery<MenuItemWOptions[]>(
      query,
      params,
      "menu_items"
    );
    const item = rows[0];
    if (!item) throw new FunctionError("Menu item not found", 404);
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
}

export async function getMenuItemsByRestaurantId(
  req: Request<{ restaurantId: string }>,
  res: Response<MenuItemWCategoryAndOptions[] | CategoriesNestedInMenuItem[]>,
  next: NextFunction
) {
  try {
    const { restaurantId } = req.params;
    const isOwner = req.user?.role === Role.owner;
    const { params, query } = menuItemsQueries.getMenuItemsByRestaurantId(
      +restaurantId,
      isOwner
    );
    const [rows] = await executeSingleQuery<MenuItemWCategoryAndOptions[]>(
      query,
      params,
      "menu_items"
    );
    let response: MenuItemWCategoryAndOptions[] | CategoriesNestedInMenuItem[] =
      rows;
    if (isOwner) response = rearrangeMenuItemsForOwner(response);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

type MenuItemWithoutId = Omit<MenuItem, "id">;
type CreateMenuItemReq = Request<unknown, unknown, MenuItemWithoutId>;
export async function createMenuItem(
  req: CreateMenuItemReq,
  res: Response<MenuItemWOptions>,
  next: NextFunction
) {
  let publicId: string | null = null;
  try {
    let image: undefined | UploadedFile = undefined;
    if (req.files) {
      image = Object.values(req.files)[0] as UploadedFile;
      imageSchema.parse(image);
    }
    //check if there body data is valid
    const parsedData = menuItemSchema.parse(req.body);
    //add image to cloudinary
    if (image) {
      const cldImage = await cloudinary.uploadImage(image.tempFilePath);
      publicId = cldImage.public_id;
      parsedData.imgPublicId = publicId;
    }
    //add data to DB
    const { query, params } = menuItemsQueries.createMenuItem(parsedData);
    const [results] = await executeSingleQuery<ResultSetHeader>(
      query,
      params,
      "menu_items"
    );
    res.status(201).json({ ...parsedData, id: results.insertId, options: [] });
  } catch (error) {
    // remove the image from Dcloudinary
    try {
      if (publicId) await cloudinary.deleteImage(publicId);
    } catch (error) {
      console.log("error removing image");
    }
    next(error);
  }
}

type UpdateMenuItemImgBody = Pick<MenuItem, "restaurantId">;
type UpdateMenuItemImgReq = Request<
  MenuItemIdParams,
  unknown,
  UpdateMenuItemImgBody
>;
export async function updateMenuItemImg(
  req: UpdateMenuItemImgReq,
  res: Response<MenuItemWOptions>,
  next: NextFunction
) {
  let connection: PoolConnection | undefined = undefined;
  try {
    const menuItemId = +req.params.menuItemId;
    const { restaurantId } = menuItemSchema
      .pick({ restaurantId: true })
      .parse(req.body);

    if (!req.files) throw new FunctionError("Image is required", 400);
    const image = Object.values(req.files)[0] as UploadedFile;
    imageSchema.parse(image);
    const getMenuItemQuery = menuItemsQueries.getMenuItemById(menuItemId);
    connection = await pool.getConnection();
    const [items] = await executeQuery<MenuItemWOptions[]>(
      connection,
      getMenuItemQuery,
      "menu_items"
    );
    const menuItem = items[0];
    if (!menuItem) throw new FunctionError("Menu item was not found.", 404);

    const { public_id } = await cloudinary.updateImage(
      menuItem.imgPublicId || null,
      image.tempFilePath
    );
    const updateMenuItemImgQuery = menuItemsQueries.updateMenuItemImg({
      id: +menuItemId,
      imgPublicId: public_id,
      restaurantId,
    });
    await executeQuery<ResultSetHeader>(
      connection,
      updateMenuItemImgQuery,
      "menu_items"
    );
    res.status(200).json({ ...menuItem, imgPublicId: public_id });
  } catch (error) {
    next(error);
  } finally {
    connection?.release();
  }
}

type MenuItemWithoutIdAndImg = Omit<MenuItem, "id" | "imgPublicId">;
type UpdateMenuItemApartFromImg = Request<
  MenuItemIdParams,
  unknown,
  MenuItemWithoutIdAndImg
>;
export async function updateMenuItemApartFromImg(
  req: UpdateMenuItemApartFromImg,
  res: Response<undefined>,
  next: NextFunction
) {
  try {
    const { menuItemId } = req.params;
    const parsedData = menuItemSchema
      .omit({ imgPublicId: true })
      .parse(req.body);
    const menuItem: TurnUndefinedToNullInObj<Omit<MenuItem, "imgPublicId">> = {
      ...parsedData,
      id: +menuItemId,
    };
    const { params, query } =
      menuItemsQueries.updateMenuItemApartFromImg(menuItem);
    await executeSingleQuery(query, params, "menu_items");
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

type DeleteMenuItemParams = { menuItemId: string; restaurantId: string };
type DeleteMenuItemReq = Request<DeleteMenuItemParams>;
export function deleteMenuItem(
  req: DeleteMenuItemReq,
  res: Response<undefined>,
  next: NextFunction
) {}
