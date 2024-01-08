import passport from "passport";

//need to check if works
passport.serializeUser((user, cb) => {
  process.nextTick(() => {
    cb(null, user);
  });
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => {
    return cb(null, { name: "as" }); ///////
  });
});
