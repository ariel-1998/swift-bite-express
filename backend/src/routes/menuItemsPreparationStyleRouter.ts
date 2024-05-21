import { Router } from "express";
import {
  createStyles,
  deleteStyle,
} from "../logic/menuItemsPraparationStyleLogic";
import {
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
} from "../middleware/isOwnerRole";

export const menuItemsPreparationStyleRouter = Router();

menuItemsPreparationStyleRouter.post(
  "/restaurant/:restaurantId",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("params"),
  createStyles
);
menuItemsPreparationStyleRouter.delete(
  "/:styleId/restaurant/:restaurantId",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("params"),
  deleteStyle
);
