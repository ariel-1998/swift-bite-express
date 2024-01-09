import { SessionOptions } from "express-session";
import MySQLStore from "express-mysql-session";
import * as expressSession from "express-session";
import { config } from "./DB/dbConfig";

export const maxAge = 1000 * 60 * 60 * 24 * 3; //3 days
const checkExpirationInterval = 1000 * 60 * 60 * 24; // 24hrs

const Storage = MySQLStore(expressSession);

const sessionStorage = new Storage({
  ...config,
  checkExpirationInterval,
  endConnectionOnClose: true,
  clearExpired: true,
  expiration: maxAge,
  createDatabaseTable: true,
  schema: {
    tableName: "sessions",
    columnNames: {
      session_id: "session_id",
      data: "data",
      expires: "expires",
    },
  },
});

export const sessionOptions: SessionOptions = {
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true,
  name: "session_id",
  store: sessionStorage,
  cookie: {
    httpOnly: true,
    sameSite: false,
    secure: true,
    maxAge,
  },
};
