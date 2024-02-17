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

//with query.page check the page for pagination (might get it with address)
restaurantRouter.get("/", getRestaurantsByPage);
restaurantRouter.get("/:restaurantId", getSingleRestaurantById);
restaurantRouter.post("/", addRestaurant);
restaurantRouter.put("/:restaurantId", updateRestaurant);
// restaurantRouter.delete("/:restaurantId", deleteRestaurant);

//check if works and check if middleware works
restaurantRouter.get("/owner", isRestaurantOwner, getOwnerRestaurants);

restaurantRouter.get("/search/:search", searchRestaurants);
