import { Router } from "express";
import {
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
} from "../middleware/isOwnerRole";
import {
  getMenuItemById,
  createMenuItem,
  updateMenuItemImg,
  updateMenuItemApartFromImg,
  deleteMenuItem,
  getMenuItemsByRestaurantId,
} from "../logic/menuItemLogic";

export const menuItemRouter = Router();

//verifyIsOwner and check if restaurantOwner middleware
menuItemRouter.post(
  "/",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("body"),
  createMenuItem
);

//no need for any middlewares
menuItemRouter.get("/:menuItemId([0-9]+)", getMenuItemById);
menuItemRouter.get(
  "/restaurant/:restaurantId([0-9]+)",
  getMenuItemsByRestaurantId
);

//verifyIsOwner and check if restaurantOwner middleware
menuItemRouter.put(
  "/:menuItemId([0-9]+)",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("body"),
  updateMenuItemApartFromImg
);

//verifyIsOwner and check if restaurantOwner middleware
menuItemRouter.put(
  "/:menuItemId([0-9]+)/image",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("body"),
  updateMenuItemImg
);

//verifyIsOwner and check if restaurantOwner middleware
//need to select the item before delete so i could delete the image of the item if exist
menuItemRouter.delete(
  "/:menuItemId([0-9]+)/restaurant/:restaurantId([0-9]+)",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("params"),
  deleteMenuItem
);
