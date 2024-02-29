import { NextFunction, Request, Response } from "express";
import { categoryQueries } from "../utils/DB/queries/categoryQueries";
import { executeSingleQuery } from "../utils/DB/dbConfig";
import { CategorySchema, Category, categorySchema } from "../models/Category";
import { ResultSetHeader } from "mysql2";
import { FunctionError } from "../models/Errors/ErrorConstructor";

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

export async function getSingleCategoryById(
  req: Request<{ categoryId: number }>,
  res: Response<Category>,
  next: NextFunction
) {
  try {
    const categoryId = +req.params.categoryId;
    const { params, query } = categoryQueries.getSingleCategoryById(categoryId);
    const [rows] = await executeSingleQuery<Category[]>(query, params);
    const category = rows[0];
    if (!category) throw new FunctionError("Category Not Found", 404);
    res.status(200).json(category);
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
    const { params, query } = categoryQueries.addCategory(data);
    const [rows] = await executeSingleQuery<ResultSetHeader>(query, params);
    const id = rows.insertId;
    res.status(201).json({ ...data, id });
  } catch (error) {
    next(new FunctionError("Category already exist", 409));
  }
}

type UpdateCategoryParams = { categoryId: string };
type UpdateCategoryReq = Request<UpdateCategoryParams, unknown, Category>;
export async function updateCategory(
  req: UpdateCategoryReq,
  res: Response<CategorySchema>,
  next: NextFunction
) {
  try {
    const id = +req.params.categoryId;
    const data = categorySchema.parse(req.body);
    const category: CategorySchema = { ...data, id };
    const { params, query } = categoryQueries.updateCategory(category);
    await executeSingleQuery(query, params);
    res.status(200).json(category);
  } catch (error) {
    next(new FunctionError("Category Name already exist", 409));
  }
}

type DeleteCategoryParams = { categoryId: string; restaurantId: string };
type DeleteCategoryReq = Request<DeleteCategoryParams>;
export async function deleteCategory(
  req: DeleteCategoryReq,
  res: Response<undefined>,
  next: NextFunction
) {}
