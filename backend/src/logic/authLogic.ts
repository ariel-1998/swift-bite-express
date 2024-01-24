import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import passport from "passport";
import { FunctionError } from "../models/Errors/ErrorConstructor";

//need to change url on deployment
const SUCCSESS_AUTH_REDIRECT = "http://localhost:5173";

type Auth = "register" | "login";
export const handleGoogleAuth =
  (source: Auth) => (req: Request, res: Response) =>
    passport.authenticate("google", {
      scope: ["profile", "email"],
      state: source, // Include the source parameter in the Google authentication request
    })(req, res);

type State = { state: Auth };
export const handleProviderCBRedirect = (
  req: Request<unknown, unknown, unknown, State>,
  res: Response
) => {
  passport.authenticate("google", (err: Error) => {
    let redirectUrl = SUCCSESS_AUTH_REDIRECT;
    console.log(req.user);
    const { state } = req.query;
    if (err) redirectUrl += `/auth/${state}?error=${err.message}`;

    return res.redirect(redirectUrl);
  })(req, res);
};

export const handleLocalAuth = (method: "signup" | "login") =>
  passport.authenticate(`local-${method}`);

export const userInfoResponse = (
  req: Request,
  res: Response<Omit<User, "password"> | string>,
  next: NextFunction
) => {
  const user = req.user;
  if (!user) return next(new FunctionError("UnAutorized!", 401));
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
    res.sendStatus(200);
  });
};
