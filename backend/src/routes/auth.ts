import { Router } from "express";
import passport from "passport";

export const authRouter = Router();

//google strategy
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile"] })
);
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

//local strategy register
authRouter.post(
  "/register",
  passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/register",
  })
);
// Login route login
authRouter.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

//logout all strategies
authRouter.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    //to login page
    res.redirect("/login");
  });
});
