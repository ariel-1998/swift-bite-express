import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { Strategy as LocalStrategy } from "passport-local";

import { User } from "../models/User";
import {
  createNewUserAndProvider,
  getUserByProfile,
} from "./stragiesFunctions";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        //look for user in database in
        const user = await getUserByProfile(profile);
        console.log(user);
        //if user exist return the user and exit the function
        if (user) return done(null, user);

        //add provider to auth-provider DB
        //add user to user DB
        const newUser = await createNewUserAndProvider(profile);
        done(null, newUser);
      } catch (error) {
        //if it failed that means that the email provided in profile already exist in DB(email is unique)
        console.log(error);
        const errMsg = "You might have signed in a different way";
        done({ message: errMsg, name: "providerError" });
      }
    }
  )
);

// passport.use(
//   "local-signup",
//   new LocalStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//       // passReqToCallback: true, // If true, the request object is passed as the first argument to the verify callback (default is false)
//     },
//     (email, password, done) => {
//       //if user exist return error
//     }
//   )
// );

// passport.use(
//   "local-signin",
//   new LocalStrategy(
//     {
//       usernameField: "email",
//       passwordField: "password",
//       // passReqToCallback: true, // If true, the request object is passed as the first argument to the verify callback (default is false)
//     },
//     (email, password, done) => {
//       //if user exist return user
//       //if user does NOT exist return error
//     }
//   )
// );

//need to check if works
passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, user);
  });
});

passport.deserializeUser((user: User, cb) => {
  process.nextTick(() => {
    return cb(null, user);
  });
});
