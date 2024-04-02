import { Router } from "express";
import {
  createMenuItemCategoryRef,
  updateMenuItemCategoryRef,
} from "../logic/menuItemCategoryTable";
import {
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
} from "../middleware/isOwnerRole";

export const menuItemCategoryRouter = Router();

//verifyIsOwner and check if restaurantOwner middleware
menuItemCategoryRouter.post(
  "/restaurant/:restaurantId([0-9]+)/menu-item/:menuItemId([0-9]+)",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("params"),
  createMenuItemCategoryRef
);
//verifyIsOwner and check if restaurantOwner middleware
menuItemCategoryRouter.put(
  "/restaurant/:restaurantId([0-9]+)/menu-item/:menuItemId([0-9]+)",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("body"),
  updateMenuItemCategoryRef
);
