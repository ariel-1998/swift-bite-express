import { NextFunction, Request, Response } from "express";
import { Extra } from "../models/Extra";

type DefaultParams = { menuItemId: string };
export function getAllExtrasByMenuItemId(
  req: Request<DefaultParams>,
  res: Response<Extra[]>,
  next: NextFunction
) {}

type CreateExtraBody = Omit<Extra, "id" | "menuItemId">;
type CreateExtraReq = Request<DefaultParams, unknown, CreateExtraBody>;
export function createExtra(
  req: CreateExtraReq,
  res: Response<Extra>,
  next: NextFunction
) {}

type UpdateExtraBody = CreateExtraBody;
type UpdateExtraParams = DefaultParams & { id: string };
type UpdateExtraReq = Request<UpdateExtraParams, unknown, UpdateExtraBody>;
export function updateExtra(
  req: UpdateExtraReq,
  res: Response<Extra>,
  next: NextFunction
) {}

type DeleteExtraParams = DefaultParams & { id: string };
type DeleteExtraBody = Pick<Extra, "restaurantId">;
type DeleteExtraReq = Request<DeleteExtraParams, unknown, DeleteExtraBody>;
export function deleteExtra(
  req: DeleteExtraReq,
  res: Response<undefined>,
  next: NextFunction
) {}
