import "./utils/dotenvConfig";
import express, { json } from "express";
import session from "express-session";
import { sessionOptions } from "./utils/sessionOptions";
import cors from "cors";
import { corsOptions } from "./utils/corsOptions";
import { authRouter } from "./routes/authRouter";
import passport from "passport";
import "./utils/strategies/passportConfig";
import { errorHandler } from "./middleware/errorHandler";
import { addressRouter } from "./routes/addressRouter";
import { DB, createDBTables } from "./utils/DB/tables";
import { User } from "./models/User";
import { executeSingleQuery } from "./utils/DB/dbConfig";

const app = express();

// app.use(cors());
app.use(cors(corsOptions));
app.use(json());
app.use(session(sessionOptions));

//passport
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/api/auth", authRouter);
app.use("/api/address", addressRouter);

app.use(errorHandler);

const PORT = process.env.PORT;

createDBTables(() => {
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
});
const getUserByAuthProviderId = async (): Promise<User | undefined> => {
  const { columns, tableName } = DB.tables.users;
  const query = `SELECT * FROM ${tableName} WHERE ${columns.authProviderId} = ?`;
  const params = ["646468"];
  const [user] = await executeSingleQuery<User[]>(query, params);
  return user[0];
};

getUserByAuthProviderId().then(console.log).catch(console.log);
