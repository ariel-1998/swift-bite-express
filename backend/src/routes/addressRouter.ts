import { Router } from "express";
import {
  getAddressById,
  addAddress,
  updateAddress,
  convertAddressToCoords,
  // removeAddress,
} from "../logic/addressLogic";
import { verifyAuthMiddleware } from "../middleware/verifyAuth";

export const addressRouter = Router();

addressRouter.post("/", verifyAuthMiddleware, addAddress);
addressRouter.put("/", updateAddress);
//do not need to update user restaurantId to null as i set it to null on delete in the sql DB
//same with restaurant, do not need to update restaurant_owner_address restaurantId to null as its set on the DB
// addressRouter.delete("/", removeAddress);
addressRouter.get("/:addressId", getAddressById);
addressRouter.post("/convert", convertAddressToCoords);
