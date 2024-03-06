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
  menuItemId: number;
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
    const parsedData = menuItemCategoryTableSchema.parse(req.body);
    const { menuItemId, restaurantId } = req.params;
    const query = menuItemCategoryQueries.createMenuItemCategoryRef({
      categoryIds: parsedData,
      menuItemId,
      restaurantId,
    });
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [results] = await executeQuery<ResultSetHeader>(
      connection,
      query,
      "menu_items_category"
    );
    if (!results.affectedRows) {
      //rows are not connected to the restaurantId
      throw new FunctionError(
        "Cannot association these categories to menu item",
        400
      );
    }

    await connection.commit();
    if (results.affectedRows < parsedData.length) return res.sendStatus(207);
    res.sendStatus(201);
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
