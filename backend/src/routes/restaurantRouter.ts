import { Router } from "express";
import {
  addRestaurant,
  deleteRestaurant,
  getRestaurantsByPage,
  getSingleRestaurant,
  updateRestaurant,
} from "../logic/restaurantLogic";

export const restaurantRouter = Router();

//with query.page check the page for pagination (might get it with address)
restaurantRouter.get("/", getRestaurantsByPage);
//with params(might get it with address)
restaurantRouter.get("/:restaurantId", getSingleRestaurant);
//with body
restaurantRouter.post("/", addRestaurant);
//with body
restaurantRouter.put("/", updateRestaurant);
//with params
restaurantRouter.delete("/:restaurantId", deleteRestaurant);
