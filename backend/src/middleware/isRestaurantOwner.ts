import { NextFunction, Request, Response } from "express";
import { FunctionError } from "../models/Errors/ErrorConstructor";
import { IsOwner, User } from "../models/User";
import { restauransOwnerAddressQueries } from "../utils/DB/queries/restauransOwnerAddressQueries";
import { RestauransOwnerAddressTable } from "../models/RestauransOwnerAddressTable";
import { executeQuery, executeSingleQuery } from "../utils/DB/dbConfig";
import { PoolConnection } from "mysql2/promise";
import { verifyUser } from "./verifyAuth";

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

export async function verifyOwnershipByRestaurantIdAndUserIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  verifyUser(req);
  try {
    let restaurantId: undefined | number = undefined;

    if (req.body.restaurantId) restaurantId = +req.body.restaurantId;
    if (!restaurantId && req.query.restaurantId)
      restaurantId = +req.query.restaurantId;
    if (!restaurantId && req.params.restaurantId)
      restaurantId = +req.params.restaurantId;
    if (!restaurantId) {
      throw new FunctionError(
        "Bad Request: RestaurantId was not sent in request.",
        400
      );
    }
    const userId = req.user.id;
    const query = restauransOwnerAddressQueries.getRowByUserIdAndRestaurantId(
      restaurantId,
      userId
    );
    const [rows] = await executeSingleQuery<RestauransOwnerAddressTable[]>(
      query.query,
      query.params
    );
    if (!rows[0]) {
      throw new FunctionError(
        "Premission Error: access denied, only The owner is Allowed.",
        403
      );
    }
    next();
  } catch (error) {
    next(error);
  }
}

export function verifyIsOwner<T extends { user: User }>(
  req: T
): asserts req is T & {
  user: Omit<User, "isRestaurantOwner"> & { isRestaurantOwner: IsOwner.true };
} {
  if (!req.user.isRestaurantOwner) {
    throw new FunctionError(
      "Premission Error: access denied, only The owner is Allowed.",
      403
    );
  }
}

export async function verifyOwnershipByRestaurantIdAndUserId(
  connection: PoolConnection,
  restaurantId: number,
  userId: number
): Promise<RestauransOwnerAddressTable> {
  const isOwnerQuery =
    restauransOwnerAddressQueries.getRowByUserIdAndRestaurantId(
      restaurantId,
      userId
    );
  const [isOwnerRows] = await executeQuery<RestauransOwnerAddressTable[]>(
    connection,
    isOwnerQuery
  );
  const isOwner = isOwnerRows[0];
  if (!isOwner)
    throw new FunctionError(
      "Premission Error: Only the owner can access.",
      403
    );
  return isOwner;
}
