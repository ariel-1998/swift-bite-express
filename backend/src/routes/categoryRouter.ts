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
categoryRouter.get("/", getAllCategoriesByRestaurantId);
//verifyIsOwner and check if restaurantOwner middleware
categoryRouter.post(
  "/",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
  addCategory
);
//verifyIsOwner and check if restaurantOwner middleware
categoryRouter.put(
  "/",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
  updateCategory
);
//verifyIsOwner and check if restaurantOwner middleware
categoryRouter.delete(
  "/",
  isRestaurantOwner,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
  deleteCategory
);
