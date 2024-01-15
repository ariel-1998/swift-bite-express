import { Router } from "express";
import { getAddressByIdLogic, addAddressLogic } from "../logic/addressLogic";

export const addressRouter = Router();

addressRouter.get("/:addressId", getAddressByIdLogic);
addressRouter.post("/", addAddressLogic);
