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
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
} from "../middleware/isRestaurantOwner";

export const restaurantRouter = Router();

restaurantRouter.get("/", getRestaurantsByPage);
restaurantRouter.get("/owner", isRestaurantOwner, getOwnerRestaurants);
restaurantRouter.get("/:restaurantId([0-9]+)", getSingleRestaurantById);
restaurantRouter.get("/search/:search", searchRestaurants);
restaurantRouter.post("/", addRestaurant);
restaurantRouter.put(
  "/:restaurantId([0-9]+)",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
  updateRestaurant
);
//need to check how to cascade all data on delete
// restaurantRouter.delete("/:restaurantId", deleteRestaurant);
