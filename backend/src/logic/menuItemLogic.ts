import { NextFunction, Request, Response } from "express";
import {
  CategoriesNestedInMenuItem,
  MenuItem,
  MenuItemJoinedWCategory,
  MenuItemsNestedInCategories,
  menuItemSchema,
} from "../models/MenuItem";
import { UploadedFile } from "express-fileupload";
import { cloudinary } from "../utils/cloudinaryConfig";
import { menuItemsQueries } from "../utils/DB/queries/MenuItemsQueries";
import { executeSingleQuery } from "../utils/DB/dbConfig";
import { ResultSetHeader } from "mysql2";
import { FunctionError } from "../models/Errors/ErrorConstructor";
import { rearrangeMenueItems } from "../utils/helperFunctions";

type MenuItemIdParams = { menuItemId: string };
export async function getMenuItemById(
  req: Request<MenuItemIdParams>,
  //need to change to CategoriesNestedInMenuItem
  res: Response<MenuItem>,
  next: NextFunction
) {
  try {
    const { menuItemId } = req.params;
    const { params, query } = menuItemsQueries.getMenuItemById(+menuItemId);
    //need to change to MenuItemJoinedWCategory
    const [rows] = await executeSingleQuery<MenuItem[]>(
      query,
      params,
      "menu_items"
    );
    //to rearrange data

    const item = rows[0];
    if (!item) throw new FunctionError("Menu item not found", 404);
    res.status(200).json(item);
  } catch (error) {
    next(error);
  }
}

export async function getMenuItemsByRestaurantId(
  req: Request<
    { restaurantId: string },
    unknown,
    unknown,
    { isOwner?: boolean }
  >,
  //need to change to CategoriesNestedInMenuItem
  res: Response<CategoriesNestedInMenuItem[] | MenuItemsNestedInCategories[]>,
  next: NextFunction
) {
  try {
    const { restaurantId } = req.params;
    const isOwner = req.query.isOwner;
    const { params, query } = menuItemsQueries.getMenuItemsByRestaurantId(
      +restaurantId,
      isOwner
    );
    const [rows] = await executeSingleQuery<MenuItemJoinedWCategory[]>(
      query,
      params,
      "menu_items"
    );
    const rearrangedData = rearrangeMenueItems(rows, isOwner);
    //need to change to CategoriesNestedInMenuItem
    //to rearrange data
    res.status(200).json(rearrangedData);
  } catch (error) {
    next(error);
  }
}

type MenuItemWithoutId = Omit<MenuItem, "id">;
type CreateMenuItemReq = Request<unknown, unknown, MenuItemWithoutId>;
export async function createMenuItem(
  req: CreateMenuItemReq,
  res: Response<MenuItem>,
  next: NextFunction
) {
  let publicId: string | null = null;
  try {
    let image: undefined | UploadedFile = undefined;
    if (req.files) {
      image = Object.values(req.files)[0] as UploadedFile;
    }
    //check if there body data is valid
    const parsedData = menuItemSchema.parse(req.body);
    //add image to cloudinary
    if (image) {
      const cldImage = await cloudinary.uploadImage(image?.tempFilePath);
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

    res.status(201).json({ ...parsedData, id: results.insertId });
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

type UpdateMenuItemImgBody = Pick<MenuItem, "imgPublicId" | "restaurantId">;
type UpdateMenuItemImgReq = Request<
  MenuItemIdParams,
  unknown,
  UpdateMenuItemImgBody
>;
export function updateMenuItemImg(
  req: UpdateMenuItemImgReq,
  res: Response<MenuItem>,
  next: NextFunction
) {}

type MenuItemWithoutIdAndImg = Omit<MenuItem, "id" | "imgPublicId">;
type UpdateMenuItemApartFromImg = Request<
  MenuItemIdParams,
  unknown,
  MenuItemWithoutIdAndImg
>;
export function updateMenuItemApartFromImg(
  req: UpdateMenuItemApartFromImg,
  res: Response<MenuItem>,
  next: NextFunction
) {}

type DeleteMenuItemParams = { menuItemId: string; restaurantId: string };
type DeleteMenuItemReq = Request<DeleteMenuItemParams>;
export function deleteMenuItem(
  req: DeleteMenuItemReq,
  res: Response<undefined>,
  next: NextFunction
) {}
