import session from "express-session";
import "./utils/dotenvConfig";
import express, { json } from "express";
import { sessionOptions } from "./utils/sessionOptions";
import cors from "cors";
import { corsOptions } from "./utils/corsOptions";

const app = express();

app.use(cors(corsOptions));

app.use(json());

app.use(session(sessionOptions));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
