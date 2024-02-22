import { NextFunction, Request, Response } from "express";
import { MenuItemCategoryTable } from "../models/MenuItemCategoryTable";

type CreateMenuItemCategoryRefBody = MenuItemCategoryTable;
type CreateMenuItemCategoryRefReq = Request<
  unknown,
  unknown,
  CreateMenuItemCategoryRefBody
>;
export function createMenuItemCategoryRef(
  req: CreateMenuItemCategoryRefReq,
  res: Response,
  next: NextFunction
) {}

type UpdateMenuItemCategoryRefParams = { oldCategoryId: string };
type UpdateMenuItemCategoryRefReq = Request<
  UpdateMenuItemCategoryRefParams,
  unknown,
  MenuItemCategoryTable
>;
export function updateMenuItemCategoryRef(
  req: UpdateMenuItemCategoryRefReq,
  res: Response,
  next: NextFunction
) {}
