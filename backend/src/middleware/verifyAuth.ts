import { NextFunction, Request, Response } from "express";
import { FunctionError } from "../models/Errors/ErrorConstructor";
import { User } from "../models/User";

export function verifyAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user) return next();
  return next(new FunctionError("UnAuouthorized, Please Login.", 403));
}

export function verifyUser<T extends { user?: User }>(
  req: T
): asserts req is T & { user: User } {
  if (!req.user) {
    throw new FunctionError("Unauthorized, Please Login.", 401);
  }
}
