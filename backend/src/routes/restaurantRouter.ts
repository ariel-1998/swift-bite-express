import { Router } from "express";
import {
  addRestaurant,
  // deleteRestaurant,
  getRestaurantsByPage,
  getSingleRestaurantById,
  searchRestaurants,
  updateRestaurant,
} from "../logic/restaurantLogic";

export const restaurantRouter = Router();

//with query.page check the page for pagination (might get it with address)
restaurantRouter.get("/", getRestaurantsByPage);

restaurantRouter.get("/:restaurantId", getSingleRestaurantById);

restaurantRouter.post("/", addRestaurant);

restaurantRouter.put("/:restaurantId", updateRestaurant);

restaurantRouter.get("/search/:search", searchRestaurants);
//with body
// restaurantRouter.put("/", updateRestaurant);
//with params
// restaurantRouter.delete("/:restaurantId", deleteRestaurant);
