import { NextFunction, Request, Response } from "express";
import { Role, User, userRegistrationSchema } from "../models/User";
import { userQueries } from "../utils/DB/queries/userQueries";
import { verifyUser } from "../middleware/verifyAuth";
import { FunctionError } from "../models/Errors/ErrorConstructor";
import { executeQuery, pool } from "../utils/DB/dbConfig";
import { PoolConnection } from "mysql2/promise";
import { restauransOwnerAddressQueries } from "../utils/DB/queries/restauransOwnerAddressQueries";
import { RestauransOwnerAddressTable } from "../models/RestauransOwnerAddressTable";

type ReqBody = Partial<Pick<User, "role">>;
type Req = Request<unknown, unknown, ReqBody>;
export async function updateUserRole(
  req: Req,
  res: Response,
  next: NextFunction
) {
  //update isRestauranOuwner to isOwner.True
  let connection: undefined | PoolConnection = undefined;
  try {
    console.log(req.body);
    verifyUser(req);
    const { user } = req;
    const parsedData = userRegistrationSchema
      .pick({ role: true })
      .parse(req.body);
    if (parsedData.role === user.role) {
      throw new FunctionError(`Role ${user.role} already active`, 400);
    }
    connection = await pool.getConnection();
    if (parsedData.role === Role.user) {
      //that means wants to become a regular user and remove owner title
      //check if has restaurants owned by him
      const getRestaurantsQuery = restauransOwnerAddressQueries.getRowsByUserId(
        user.id
      );
      const [restaurants] = await executeQuery<RestauransOwnerAddressTable[]>(
        connection,
        getRestaurantsQuery
      );
      //if there are then throw an error cant update role to user when has active restaurants
      if (restaurants.length) {
        throw new FunctionError(
          "Cannot update role to User when restaurants are active",
          403
        );
      }
      //else update to user
      const updateRoleQuery = userQueries.updateUserRole(Role.user);
      await executeQuery(connection, updateRoleQuery);
    } else {
      //update starus to owner
      const updateRoleQuery = userQueries.updateUserRole(Role.owner);
      await executeQuery(connection, updateRoleQuery);
    }
    res.sendStatus(200);
  } catch (error) {
    next(error);
  } finally {
    connection?.release();
  }
}
