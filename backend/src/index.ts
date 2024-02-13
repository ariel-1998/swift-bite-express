import "./utils/dotenvConfig";
import express, { json } from "express";
import session from "express-session";
import { sessionOptions } from "./utils/sessionOptions";
import cors from "cors";
import { corsOptions } from "./utils/corsOptions";
import "./utils/strategies/passportConfig";
import passport from "passport";
import { authRouter } from "./routes/authRouter";
import { errorHandler } from "./middleware/errorHandler";
import { addressRouter } from "./routes/addressRouter";
import { createDBTables } from "./utils/DB/tables";
import { restaurantRouter } from "./routes/restaurantRouter";
import fileUpload from "express-fileupload";

const app = express();

app.use(cors(corsOptions));
app.use(json());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(session(sessionOptions));

//passport
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/api/auth", authRouter);
app.use("/api/address", addressRouter);
app.use("/api/restaurant", restaurantRouter);

app.use(errorHandler);

const PORT = process.env.PORT;

createDBTables()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  })
  .catch((e) => console.log("Error initilizing APP: ", e));
