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
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("body"),
  createExtra
);
//verifyIsOwner and check if restaurantOwner middleware
extraRouter.put(
  "/:id([0-9]+)",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("body"),
  updateExtra
);
//verifyIsOwner and check if restaurantOwner middleware
extraRouter.delete(
  "/:id([0-9]+)",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("body"),
  deleteExtra
);
