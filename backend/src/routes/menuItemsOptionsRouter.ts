import { Router } from "express";
import { createOptions, deleteOption } from "../logic/menuItemsOptionsLogic";
import {
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
} from "../middleware/isOwnerRole";

export const menuItemsOptionsRouter = Router();

menuItemsOptionsRouter.post(
  "/restaurant/:restaurantId",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("params"),
  createOptions
);
menuItemsOptionsRouter.delete(
  "/:optionId/restaurant/:restaurantId",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("params"),
  deleteOption
);
