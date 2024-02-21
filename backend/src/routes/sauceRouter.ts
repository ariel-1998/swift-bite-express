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
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
  createSauce
);
//verifyIsOwner and check if restaurantOwner middleware
sauceRouter.put(
  "/",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
  updateSauce
);
//verifyIsOwner and check if restaurantOwner middleware
sauceRouter.delete(
  "/",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
  deleteSauce
);
