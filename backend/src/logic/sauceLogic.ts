import { NextFunction, Request, Response } from "express";
import { Sauce } from "../models/Sauce";
type DefaultParams = { restaurantId: string };

export function getAllSacesByRestaurantId(
  req: Request<DefaultParams>,
  res: Response<Sauce[]>,
  next: NextFunction
) {}
type SauceNameObj = Pick<Sauce, "name">;
type CreateSauceReq = Request<DefaultParams, unknown, SauceNameObj>;
export function createSauce(
  req: CreateSauceReq,
  res: Response<Sauce>,
  next: NextFunction
) {}

type UpdateSauceParams = DefaultParams & { id: string };
type UpdateSauceReq = Request<UpdateSauceParams, unknown, SauceNameObj>;
export function updateSauce(
  req: UpdateSauceReq,
  res: Response<Sauce>,
  next: NextFunction
) {}

type DeleteSauceParams = UpdateSauceParams;
export function deleteSauce(
  req: Request<DeleteSauceParams>,
  res: Response<undefined>,
  next: NextFunction
) {}
