import { Router } from "express";
import {
  addRestaurant,
  getOwnerRestaurants,
  // deleteRestaurant,
  getRestaurantsByPage,
  getSingleRestaurantById,
  searchRestaurants,
  updateRestaurant,
} from "../logic/restaurantLogic";
import {
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
} from "../middleware/isOwnerRole";

export const restaurantRouter = Router();

restaurantRouter.get("/", getRestaurantsByPage);
restaurantRouter.get("/owner", isOwnerRole, getOwnerRestaurants);
restaurantRouter.get("/:restaurantId([0-9]+)", getSingleRestaurantById);
restaurantRouter.get("/search/:search", searchRestaurants);
restaurantRouter.post("/", isOwnerRole, addRestaurant);
restaurantRouter.put(
  "/:restaurantId([0-9]+)",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("params"),
  updateRestaurant
);
//need to check how to cascade all data on delete
// restaurantRouter.delete("/:restaurantId", deleteRestaurant);
