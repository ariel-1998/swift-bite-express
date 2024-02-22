import { NextFunction, Request, Response } from "express";
import { categoryQueries } from "../utils/DB/queries/categoryQueries";
import { executeSingleQuery } from "../utils/DB/dbConfig";
import { CategorySchema, Category, categorySchema } from "../models/Category";

export async function getAllCategoriesByRestaurantId(
  req: Request<{ restaurantId: string }>,
  res: Response<CategorySchema[]>,
  next: NextFunction
) {
  try {
    const restaurantId = +req.params.restaurantId;
    const { query, params } =
      categoryQueries.getAllCategoriesByRestaurantId(restaurantId);
    const [rows] = await executeSingleQuery<CategorySchema[]>(query, params);
    res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
}
type CategoryWitoutId = Omit<Category, "id">;
type AddCategoryReq = Request<unknown, unknown, CategoryWitoutId>;
export async function addCategory(
  req: AddCategoryReq,
  res: Response<CategorySchema>,
  next: NextFunction
) {
  try {
    const data = categorySchema.parse(req.body);
    console.log(data);
    res.json({ ...data, id: 12 });
  } catch (error) {
    next(error);
  }
}

type UpdateCategoryReq = Request<unknown, unknown, Category>;
export async function updateCategory(
  req: UpdateCategoryReq,
  res: Response<CategorySchema>,
  next: NextFunction
) {}

type DeleteCategoryParams = { categoryId: string; restaurantId: string };
type DeleteCategoryReq = Request<DeleteCategoryParams>;
export async function deleteCategory(
  req: DeleteCategoryReq,
  res: Response<undefined>,
  next: NextFunction
) {}
