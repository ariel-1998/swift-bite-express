import { Router } from "express";
import {
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
} from "../middleware/isRestaurantOwner";
import {
  getMenuItemById,
  createMenuItem,
  updateMenuItemImg,
  updateMenuItemApartFromImg,
  deleteMenuItem,
} from "../logic/menuItemLogic";

export const menuItemRouter = Router();
//no need for any middlewares
menuItemRouter.get("/", getMenuItemById);
//verifyIsOwner and check if restaurantOwner middleware
menuItemRouter.post(
  "/",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
  createMenuItem
);
//verifyIsOwner and check if restaurantOwner middleware
menuItemRouter.put(
  "/",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
  updateMenuItemImg
);
//verifyIsOwner and check if restaurantOwner middleware
menuItemRouter.put(
  "/",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
  updateMenuItemApartFromImg
);
//verifyIsOwner and check if restaurantOwner middleware
menuItemRouter.delete(
  "/",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
  deleteMenuItem
);
