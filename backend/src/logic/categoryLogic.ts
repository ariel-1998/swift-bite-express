import { NextFunction, Request, Response } from "express";
import { categoryQueries } from "../utils/DB/queries/categoryQueries";
import { executeSingleQuery } from "../utils/DB/dbConfig";
import { Category } from "../models/Category";

export async function getAllCategoriesByRestaurantId(
  req: Request<{ restaurantId: string }>,
  res: Response<Category[]>,
  next: NextFunction
) {
  try {
    const restaurantId = +req.params.restaurantId;
    const { query, params } =
      categoryQueries.getAllCategoriesByRestaurantId(restaurantId);
    const [rows] = await executeSingleQuery<Category[]>(query, params);
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
}
type CategoryWitoutId = Omit<Category, "id">;
type AddCategoryReq = Request<unknown, unknown, CategoryWitoutId>;
export async function addCategory(
  req: AddCategoryReq,
  res: Response<Category>,
  next: NextFunction
) {}

type UpdateCategoryReq = Request<unknown, unknown, Category>;
export async function updateCategory(
  req: UpdateCategoryReq,
  res: Response<Category>,
  next: NextFunction
) {}

type DeleteCategoryParams = { categoryId: string; restaurantId: string };
type DeleteCategoryReq = Request<DeleteCategoryParams>;
export async function deleteCategory(
  req: DeleteCategoryReq,
  res: Response<undefined>,
  next: NextFunction
) {}
