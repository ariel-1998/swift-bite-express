import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import passport from "passport";
import { FunctionError } from "../models/Errors/ErrorConstructor";

//need to change url on deployment
const SUCCSESS_AUTH_REDIRECT = "http://localhost:5173";

export const handleGoogleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const handleProviderCBRedirect = passport.authenticate("google", {
  successRedirect: SUCCSESS_AUTH_REDIRECT,
  failureRedirect: `/auth/login?error=You might registered with a different method before.`,
});

export const handleLocalAuth = (method: "signup" | "login") =>
  passport.authenticate(`local-${method}`);

export const userInfoResponse = (
  req: Request,
  res: Response<Omit<User, "password"> | string>,
  next: NextFunction
) => {
  const user = req.user;
  console.log(req.user);
  if (!user) return next(new FunctionError("UnAutorized!", 401));
  const userInfo: Omit<User, "password"> = {
    authProviderId: user.authProviderId,
    email: user.email,
    fullName: user.fullName,
    id: user.id,
    role: user.role,
    primaryAddressId: user.primaryAddressId,
  };
  res.status(200).json(userInfo);
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err)
      return next(new FunctionError("Server Error: Could NOT logout.", 500));
    res.sendStatus(200);
  });
};
