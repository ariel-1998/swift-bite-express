import { Router } from "express";
import {
  getAddressByIdLogic,
  addAddressLogic,
  updateAddressLogic,
} from "../logic/addressLogic";

export const addressRouter = Router();

addressRouter.post("/", addAddressLogic);
addressRouter.post("/", updateAddressLogic);
addressRouter.get("/:addressId", getAddressByIdLogic);
