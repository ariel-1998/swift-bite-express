import { Request, Response, NextFunction } from "express";
import {
  MenuItemPreparationStyle,
  menuItemPreparationStyleSchema,
} from "../models/MenuItemPreparationStyle";
import { executeQuery, executeSingleQuery, pool } from "../utils/DB/dbConfig";
import { menuItemPreparationStylesQueries } from "../utils/DB/queries/menuItemPreparationStylesQueries";
import { ResultSetHeader } from "mysql2";
import { FunctionError } from "../models/Errors/ErrorConstructor";
import { PoolConnection } from "mysql2/promise";

type DefaultParams = { restaurantId: string };
type createStylesBody = Zod.infer<typeof menuItemPreparationStyleSchema>;
export async function createStyles(
  req: Request<DefaultParams, unknown, createStylesBody>,
  res: Response<MenuItemPreparationStyle[]>,
  next: NextFunction
) {
  let connection: PoolConnection | undefined = undefined;
  try {
    const { restaurantId } = req.params;
    const parsedBody = menuItemPreparationStyleSchema.parse(req.body);
    const createQuery = menuItemPreparationStylesQueries.createStyles(
      parsedBody,
      +restaurantId
    );

    connection = await pool.getConnection();
    const [results] = await executeQuery<ResultSetHeader>(
      connection,
      createQuery,
      "menu_item_preparation_style"
    );
    if (!results.affectedRows)
      throw new FunctionError(
        "Could not add preparations styles to menu item",
        500
      );

    const getCreatedStylesQuery =
      menuItemPreparationStylesQueries.getStylesByMenuItemId(
        parsedBody.menuItemId
      );
    const [rows] = await executeQuery<MenuItemPreparationStyle[]>(
      connection,
      getCreatedStylesQuery,
      "menu_item_preparation_style"
    );
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  } finally {
    connection?.release();
  }
}

type DeleteParams = DefaultParams & { styleId: string };
export async function deleteStyle(
  req: Request<DeleteParams>,
  res: Response<undefined>,
  next: NextFunction
) {
  try {
    const { styleId, restaurantId } = req.params;
    const { params, query } = menuItemPreparationStylesQueries.deleteStyle(
      +styleId,
      +restaurantId
    );
    const [results] = await executeSingleQuery<ResultSetHeader>(
      query,
      params,
      "menu_item_preparation_style"
    );
    if (!results.affectedRows)
      throw new FunctionError("Could not remove this preparation style", 400);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
