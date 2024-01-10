import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import passport from "passport";

//need to change url on deployment
const SUCCSESS_AUTH_REDIRECT = "http://localhost:5173/";

export const handleGoogleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});
export const handleLocalAuth = (method: "signup" | "login") =>
  passport.authenticate(`local-${method}`);

export const handleProviderCB = passport.authenticate("google", {
  failureRedirect: "/login",
  successRedirect: SUCCSESS_AUTH_REDIRECT,
});

export const userInfoResponse = (
  req: Request,
  res: Response<Omit<User, "password"> | string>
) => {
  const user = req.user;
  if (!user) return res.status(401).json("unAutorized!");
  const userInfo: Omit<User, "password"> = {
    authProviderId: user.authProviderId,
    email: user.email,
    fullName: user.fullName,
    id: user.id,
    isRestaurantOwner: user.isRestaurantOwner,
    primaryAddressId: user.primaryAddressId,
  };
  res.status(200).json(userInfo);
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
};
