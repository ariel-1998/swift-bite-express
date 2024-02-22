import { NextFunction, Request, Response } from "express";
import { FunctionError } from "../models/Errors/ErrorConstructor";
import { IsOwner, User } from "../models/User";
import { restauransOwnerAddressQueries } from "../utils/DB/queries/restauransOwnerAddressQueries";
import { RestauransOwnerAddressTable } from "../models/RestauransOwnerAddressTable";
import { executeQuery, executeSingleQuery } from "../utils/DB/dbConfig";
import { PoolConnection } from "mysql2/promise";
import { verifyUser } from "./verifyAuth";
import { restaurantIdSchema } from "../models/Restaurant";

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
type RestaurantIdKeyInReq = "body" | "query" | "params";
type RestaurantId = string | number | undefined | null;
export function verifyOwnershipByRestaurantIdAndUserIdMiddleware(
  key: RestaurantIdKeyInReq
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    verifyUser(req);
    try {
      const restaurantId = req[key].restaurantId as RestaurantId;
      const parsedId = restaurantIdSchema.parse(restaurantId);

      const userId = req.user.id;
      const query = restauransOwnerAddressQueries.getRowByUserIdAndRestaurantId(
        parsedId,
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
      console.log(error);
      next(error);
    }
  };
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
