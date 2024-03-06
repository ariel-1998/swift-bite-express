import { NextFunction, Request, Response } from "express";
import {
  MenuItemCategoryTable,
  menuItemCategoryTableSchema,
} from "../models/MenuItemCategoryTable";
import { executeQuery, pool } from "../utils/DB/dbConfig";
import { menuItemCategoryQueries } from "../utils/DB/queries/menuItemCategoryQueries";
import { ResultSetHeader } from "mysql2";
import { PoolConnection } from "mysql2/promise";
import { FunctionError } from "../models/Errors/ErrorConstructor";

type CreateMenuItemCategoryRefBody = MenuItemCategoryTable["categoryId"][];
type CreateMenuItemCategoryRefParams = {
  categoryId: number;
  restaurantId: number;
};
type CreateMenuItemCategoryRefReq = Request<
  CreateMenuItemCategoryRefParams,
  unknown,
  CreateMenuItemCategoryRefBody
>;
export async function createMenuItemCategoryRef(
  req: CreateMenuItemCategoryRefReq,
  res: Response,
  next: NextFunction
) {
  let connection: undefined | PoolConnection = undefined;
  try {
    console.log("asjkdnaskjdbkbasj");
    const parsedData = menuItemCategoryTableSchema.parse(req.body);
    const { categoryId, restaurantId } = req.params;
    const queries = menuItemCategoryQueries.createMenuItemCategoryRef({
      menuItems: parsedData,
      categoryId,
      restaurantId,
    });
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [results] = await executeQuery<ResultSetHeader>(connection, queries);
    if (!results.affectedRows) {
      //rows are not connected to the restaurantId
      throw new FunctionError("Cannot add this category to menu item", 400);
    }
    await connection.commit();
    if (results.affectedRows < parsedData.length) return res.sendStatus(207);
    res.status(201).json(results);
  } catch (error) {
    next(error);
    await connection?.rollback();
  } finally {
    connection?.release();
  }
}

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
