import { Router } from "express";
import { updateUserRole } from "../logic/userLogic";
import { verifyAuthMiddleware } from "../middleware/verifyAuth";

export const userRouter = Router();

userRouter.put("/", verifyAuthMiddleware, updateUserRole);
