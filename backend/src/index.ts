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
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
