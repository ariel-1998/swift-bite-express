import { Router } from "express";
import {
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
} from "../middleware/isOwnerRole";
import {
  addCategory,
  deleteCategory,
  getAllCategoriesByRestaurantId,
  updateCategory,
} from "../logic/categoryLogic";

export const categoryRouter = Router();

//no middleware needed
categoryRouter.get("/:restaurantId([0-9]+)", getAllCategoriesByRestaurantId);
//verifyIsOwner and check if restaurantOwner middleware
categoryRouter.post(
  "/",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("body"),
  addCategory
);
//verifyIsOwner and check if restaurantOwner middleware
categoryRouter.put(
  "/",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("body"),
  updateCategory
);

//verifyIsOwner and check if restaurantOwner middleware
categoryRouter.delete(
  "/:categoryId([0-9]+)/restaurant/:restaurantId([0-9]+)",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("params"),
  deleteCategory
);
