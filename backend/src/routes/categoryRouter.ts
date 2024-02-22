import { Router } from "express";
import {
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
} from "../middleware/isRestaurantOwner";
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
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("body"),
  addCategory
);
//verifyIsOwner and check if restaurantOwner middleware
categoryRouter.put(
  "/",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("body"),
  updateCategory
);

//verifyIsOwner and check if restaurantOwner middleware
categoryRouter.delete(
  "/:categoryId([0-9]+)/restaurant/:restaurantId([0-9]+)",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("params"),
  deleteCategory
);
