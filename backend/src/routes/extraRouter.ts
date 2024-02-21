import { Router } from "express";
import {
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
} from "../middleware/isRestaurantOwner";
import {
  getAllExtrasByMenuItemId,
  createExtra,
  updateExtra,
  deleteExtra,
} from "../logic/extraLogic";

export const extraRouter = Router();
//no middleware needed
extraRouter.get("/", getAllExtrasByMenuItemId);
//verifyIsOwner and check if restaurantOwner middleware
extraRouter.post(
  "/",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
  createExtra
);
//verifyIsOwner and check if restaurantOwner middleware
extraRouter.put(
  "/",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
  updateExtra
);
//verifyIsOwner and check if restaurantOwner middleware
extraRouter.delete(
  "/",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
  deleteExtra
);
