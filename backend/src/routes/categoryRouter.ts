import { Router } from "express";
import {
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware,
} from "../middleware/isOwnerRole";
import {
  addCategory,
  deleteCategory,
  getAllCategoriesByRestaurantId,
  getSingleCategoryById,
  updateCategory,
} from "../logic/categoryLogic";

export const categoryRouter = Router();
//check
categoryRouter.use(isOwnerRole);

//verifyIsOwner and check if restaurantOwner middleware
categoryRouter.post(
  "/",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("body"),
  addCategory
);
//verifyIsOwner and check if restaurantOwner middleware
categoryRouter.put(
  "/:categoryId([0-9]+)",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("body"),
  updateCategory
);

//verifyIsOwner and check if restaurantOwner middleware
categoryRouter.get("/:categoryId([0-9]+)", getSingleCategoryById);

//no middleware needed// might add middleware thatCheck if role === Role.Admin
categoryRouter.get(
  "/restaurant/:restaurantId([0-9]+)",
  getAllCategoriesByRestaurantId
);

//verifyIsOwner and check if restaurantOwner middleware
categoryRouter.delete(
  "/:categoryId([0-9]+)/restaurant/:restaurantId([0-9]+)",
  isOwnerRole,
  verifyOwnershipByRestaurantIdAndUserIdMiddleware("params"),
  deleteCategory
);
