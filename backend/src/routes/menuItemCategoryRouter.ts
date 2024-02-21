import { Router } from "express";
import {
  createMenuItemCategoryRef,
  updateMenuItemCategoryRef,
} from "../logic/menuItemCategoryTable";
import {
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
} from "../middleware/isRestaurantOwner";

export const menuItemCategoryRouter = Router();

//verifyIsOwner and check if restaurantOwner middleware
menuItemCategoryRouter.post(
  "/",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
  createMenuItemCategoryRef
);
//verifyIsOwner and check if restaurantOwner middleware
menuItemCategoryRouter.put(
  "/",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
  updateMenuItemCategoryRef
);
