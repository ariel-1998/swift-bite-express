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

//verifyIsOwner and check if restaurantOwner middleware
menuItemRouter.post(
  "/",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("body"),
  createMenuItem
);

//no need for any middlewares
menuItemRouter.get("/:menuItemId([0-9]+)", getMenuItemById);

//verifyIsOwner and check if restaurantOwner middleware
menuItemRouter.put(
  "/:menuItemId([0-9]+)",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("body"),
  updateMenuItemApartFromImg
);

//verifyIsOwner and check if restaurantOwner middleware
menuItemRouter.put(
  "/:menuItemId([0-9]+)/image",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("body"),
  updateMenuItemImg
);

//verifyIsOwner and check if restaurantOwner middleware

menuItemRouter.delete(
  "/:menuItemId([0-9]+)/restaurant/:restaurantId([0-9]+)",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("params"),
  deleteMenuItem
);
