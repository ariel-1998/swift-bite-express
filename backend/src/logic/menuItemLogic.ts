import { NextFunction, Request, Response } from "express";
import { MenuItem } from "../models/MenuItem";

type MenuItemIdParams = { menuItemId: string };
export function getMenuItemById(
  req: Request<MenuItemIdParams>,
  res: Response<MenuItem>,
  next: NextFunction
) {}

type MenuItemWithoutId = Omit<MenuItem, "id">;
type CreateMenuItemReq = Request<unknown, unknown, MenuItemWithoutId>;
export function createMenuItem(
  req: CreateMenuItemReq,
  res: Response<MenuItem>,
  next: NextFunction
) {}

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
