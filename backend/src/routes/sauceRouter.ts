import { Router } from "express";
import {
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
} from "../middleware/isRestaurantOwner";
import {
  getAllSacesByRestaurantId,
  createSauce,
  updateSauce,
  deleteSauce,
} from "../logic/sauceLogic";

export const sauceRouter = Router();

//no need for any middlewares
sauceRouter.get("/", getAllSacesByRestaurantId);
//verifyIsOwner and check if restaurantOwner middleware
sauceRouter.post(
  "/",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("params"),
  createSauce
);
//verifyIsOwner and check if restaurantOwner middleware
sauceRouter.put(
  "/:id([0-9]+)",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("params"),
  updateSauce
);
//verifyIsOwner and check if restaurantOwner middleware
sauceRouter.delete(
  "/:id([0-9]+)",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("params"),
  deleteSauce
);
