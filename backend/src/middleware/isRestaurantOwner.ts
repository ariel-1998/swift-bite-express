import { NextFunction, Request, Response } from "express";
import { FunctionError } from "../models/Errors/ErrorConstructor";
import { IsOwner, User } from "../models/User";

export function isRestaurantOwner(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user?.isRestaurantOwner) return next();
  return next(
    new FunctionError(
      "Premission Error: access denied, only The owner is Allowed.",
      403
    )
  );
}
//check
export function verifyIsOwner<T extends { user: User }>(
  req: T
): asserts req is T & {
  user: Omit<User, "isRestaurantOwner"> & { isRestaurantOwner: IsOwner.true };
} {
  if (!req.user.isRestaurantOwner) {
    throw new FunctionError(
      "Premission Error: access denied, only The owner is Allowed.",
      401
    );
  }
}
