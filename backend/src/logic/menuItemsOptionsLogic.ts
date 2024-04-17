import { Request, Response, NextFunction } from "express";
import {
  MenuItemOption,
  menuItemOptionsSchema,
} from "../models/MenuItemOption";
import { executeQuery, executeSingleQuery, pool } from "../utils/DB/dbConfig";
import { menuItemOptionsQueries } from "../utils/DB/queries/MenuItemOptionsQueries";
import { ResultSetHeader } from "mysql2";
import { FunctionError } from "../models/Errors/ErrorConstructor";
import { PoolConnection } from "mysql2/promise";

type DefaultParams = { restaurantId: string };
type createOptionsBody = Zod.infer<typeof menuItemOptionsSchema>;
export async function createOptions(
  req: Request<DefaultParams, unknown, createOptionsBody>,
  res: Response<MenuItemOption[]>,
  next: NextFunction
) {
  let connection: PoolConnection | undefined = undefined;
  try {
    const { restaurantId } = req.params;
    const parsedBody = menuItemOptionsSchema.parse(req.body);
    const createQuery = menuItemOptionsQueries.createOptions(
      parsedBody,
      +restaurantId
    );
    const getCreatedOptionsQuery =
      menuItemOptionsQueries.getOptionsByMenuItemId(parsedBody.menuItemId);
    connection = await pool.getConnection();
    const [results] = await executeQuery<ResultSetHeader>(
      connection,
      createQuery,
      "menu_item_options"
    );
    if (!results.affectedRows)
      throw new FunctionError("Could not add options to menu item", 500);

    const [rows] = await executeQuery<MenuItemOption[]>(
      connection,
      getCreatedOptionsQuery,
      "menu_item_options"
    );
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  } finally {
    connection?.release();
  }
}

type DeleteParams = DefaultParams & { optionId: string };
export async function deleteOption(
  req: Request<DeleteParams>,
  res: Response<undefined>,
  next: NextFunction
) {
  try {
    const { optionId, restaurantId } = req.params;
    const { params, query } = menuItemOptionsQueries.deleteOption(
      +optionId,
      +restaurantId
    );
    const [results] = await executeSingleQuery<ResultSetHeader>(
      query,
      params,
      "menu_item_options"
    );
    if (!results.affectedRows)
      throw new FunctionError("Could not remive this option", 400);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
}
