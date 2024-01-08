import { Router } from "express";
import passport from "passport";

export const authRouter = Router();
//need to change url on deployment
const SUCCSESS_AUTH_REDIRECT = "http://localhost:5173/";
//google strategy
authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: SUCCSESS_AUTH_REDIRECT,
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect(SUCCSESS_AUTH_REDIRECT);
  }
);

//local strategy register
authRouter.post(
  "/local/register",
  passport.authenticate("local-signup", {
    successRedirect: SUCCSESS_AUTH_REDIRECT,
    failureRedirect: "/register",
  })
);
// Login route login
authRouter.post(
  "/local/login",
  passport.authenticate("local-login", {
    successRedirect: SUCCSESS_AUTH_REDIRECT,
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
