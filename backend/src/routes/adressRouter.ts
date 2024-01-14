import { Router } from "express";
import { getAddressById } from "../logic/addressLogic";

export const addressRouter = Router();

addressRouter.get("/address/:addressId", getAddressById);
