import { Router } from "express";
import {
  handleGoogleAuth,
  handleLocalAuth,
  handleProviderCB,
  logout,
  userInfoResponse,
} from "../logic/authLogic";

export const authRouter = Router();

//google strategy
authRouter.get("/google", handleGoogleAuth);
authRouter.get("/google/callback", handleProviderCB);
authRouter.get("/login/success", userInfoResponse);
//local strategy register
authRouter.post("/local/register", handleLocalAuth("signup"), userInfoResponse);
authRouter.post("/local/login", handleLocalAuth("login"), userInfoResponse);
//logout all strategies
authRouter.post("/logout", logout);
