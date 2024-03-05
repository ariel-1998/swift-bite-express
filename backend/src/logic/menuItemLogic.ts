import { NextFunction, Request, Response } from "express";
import { MenuItem, menuItemSchema } from "../models/MenuItem";
import { UploadedFile } from "express-fileupload";
import { cloudinary } from "../utils/cloudinaryConfig";
import { menuItemsQueries } from "../utils/DB/queries/MenuItemsQueries";
import { executeSingleQuery } from "../utils/DB/dbConfig";
import { ResultSetHeader } from "mysql2";
import { FunctionError } from "../models/Errors/ErrorConstructor";

type MenuItemIdParams = { menuItemId: string };
export function getMenuItemById(
  req: Request<MenuItemIdParams>,
  res: Response<MenuItem>,
  next: NextFunction
) {}

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
    let results: ResultSetHeader | undefined = undefined;
    try {
      const [sqlData] = await executeSingleQuery<ResultSetHeader>(
        query,
        params
      );
      results = sqlData;
    } catch (error) {
      throw new FunctionError("Duplicate Error: Item Name already exist.", 409);
    }

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
