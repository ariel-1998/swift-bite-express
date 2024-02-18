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
// addressRouter.delete("/", removeAddress);
addressRouter.get("/:addressId", getAddressById);
addressRouter.post("/convert", convertAddressToCoords);
