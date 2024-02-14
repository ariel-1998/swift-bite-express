import { Router } from "express";
import {
  getAddressById,
  addAddress,
  updateAddress,
  convertAddressToCoords,
  // removeAddress,
} from "../logic/addressLogic";

export const addressRouter = Router();

addressRouter.post("/", addAddress);
addressRouter.put("/", updateAddress);
// addressRouter.delete("/", removeAddress);
addressRouter.get("/:addressId", getAddressById);
addressRouter.post("/convert", convertAddressToCoords);
