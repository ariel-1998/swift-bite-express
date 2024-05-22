import { NextFunction, Request, Response } from "express";
import { SideDish, SideDishSchema } from "../models/SideDish";

type DefaultParams = { menuItemId: string };
export function getAllExtrasByMenuItemId(
  req: Request<DefaultParams>,
  res: Response<SideDish[]>,
  next: NextFunction
) {}

type CreateExtraBody = Omit<SideDish, "id" | "menuItemId">;
type CreateExtraReq = Request<DefaultParams, unknown, CreateExtraBody>;
export function createExtra(
  req: CreateExtraReq,
  res: Response<SideDish>,
  next: NextFunction
) {
  try {
    const data = SideDishSchema.parse({ ...req.params, ...req.body });
    res.json(data as SideDish);
  } catch (error) {
    next(error);
  }
}

type UpdateExtraBody = CreateExtraBody;
type UpdateExtraParams = DefaultParams & { id: string };
type UpdateExtraReq = Request<UpdateExtraParams, unknown, UpdateExtraBody>;
export function updateExtra(
  req: UpdateExtraReq,
  res: Response<SideDish>,
  next: NextFunction
) {}

type DeleteExtraParams = DefaultParams & { id: string };
type DeleteExtraBody = Pick<SideDish, "restaurantId">;
type DeleteExtraReq = Request<DeleteExtraParams, unknown, DeleteExtraBody>;
export function deleteExtra(
  req: DeleteExtraReq,
  res: Response<undefined>,
  next: NextFunction
) {}
