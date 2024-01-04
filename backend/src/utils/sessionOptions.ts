import { SessionOptions } from "express-session";

export const maxAge = 1000 * 60 * 60 * 24 * 3; //3 days

export const sessionOptions: SessionOptions = {
  secret: process.env.COOKIE_SECRET || "13",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  name: "session_id",
  // store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
  cookie: {
    httpOnly: true,
    sameSite: false,
    secure: true,
    maxAge,
  },
};
