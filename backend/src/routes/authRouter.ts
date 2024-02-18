import { Router } from "express";
import {
  handleGoogleAuth,
  handleLocalAuth,
  handleProviderCBRedirect,
  logout,
  userInfoResponse,
} from "../logic/authLogic";

export const authRouter = Router();

//get login with cookie
authRouter.get("/login", userInfoResponse);

//google strategy
authRouter.get("/google", handleGoogleAuth);
authRouter.get("/google/callback", handleProviderCBRedirect);

//local strategy register
authRouter.post("/local/register", handleLocalAuth("signup"), userInfoResponse);
authRouter.post("/local/login", handleLocalAuth("login"), userInfoResponse);
//logout all strategies
authRouter.post("/logout", logout);
