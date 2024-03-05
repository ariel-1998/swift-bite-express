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
  "/restaurant/:restaurantId/category/:categoryId",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("params"),
  createMenuItemCategoryRef
);
//verifyIsOwner and check if restaurantOwner middleware
menuItemCategoryRouter.put(
  "/:oldCategoryId",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("body"),
  updateMenuItemCategoryRef
);
