import { Router } from "express";
import {
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
} from "../middleware/isOwnerRole";
import {
  getAllExtrasByMenuItemId,
  createExtra,
  updateExtra,
  deleteExtra,
} from "../logic/sideDishLogic";

export const sideDishRouter = Router();
//no middleware needed
sideDishRouter.get("/", getAllExtrasByMenuItemId);
//verifyIsOwner and check if restaurantOwner middleware
sideDishRouter.post(
  "/",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("body"),
  createExtra
);
//verifyIsOwner and check if restaurantOwner middleware
sideDishRouter.put(
  "/:id([0-9]+)",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("body"),
  updateExtra
);
//verifyIsOwner and check if restaurantOwner middleware
sideDishRouter.delete(
  "/:id([0-9]+)",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("body"),
  deleteExtra
);
