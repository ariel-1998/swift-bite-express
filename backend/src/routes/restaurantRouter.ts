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
import { isRestaurantOwner } from "../middleware/isRestaurantOwner";

export const restaurantRouter = Router();

restaurantRouter.get("/", getRestaurantsByPage);
restaurantRouter.get("/owner", isRestaurantOwner, getOwnerRestaurants);
restaurantRouter.get("/:restaurantId([0-9]+)", getSingleRestaurantById);
restaurantRouter.get("/search/:search", searchRestaurants);
restaurantRouter.post("/", addRestaurant);
//check if works and check if middleware works
restaurantRouter.put(
  "/:restaurantId([0-9]+)",
  isRestaurantOwner,
  updateRestaurant
);
// restaurantRouter.delete("/:restaurantId", deleteRestaurant);
