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
import { categoryRouter } from "./routes/categoryRouter";
import { menuItemRouter } from "./routes/menuItemRouter";
import { sauceRouter } from "./routes/sauceRouter";
import { sideDishRouter } from "./routes/sideDishRouter";
import { menuItemCategoryRouter } from "./routes/menuItemCategoryRouter";
import { userRouter } from "./routes/userRouter";
import { menuItemsPreparationStyleRouter } from "./routes/menuItemsPreparationStyleRouter";

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
app.use("/api/user", userRouter);
app.use("/api/address", addressRouter);
app.use("/api/restaurant", restaurantRouter);
app.use("/api/restaurant/:restaurantId([0-9]+)/sauce", sauceRouter);
app.use("/api/category", categoryRouter);
app.use("/api/menu-item", menuItemRouter);
app.use("/api/menu-item/:menuItemId([0-9]+)/extra", sideDishRouter);
app.use("/api/menu-item-category", menuItemCategoryRouter);
app.use("/api/menu-item-preparation-style", menuItemsPreparationStyleRouter);

app.use(errorHandler);

const PORT = process.env.PORT;

createDBTables()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    });
  })
  .catch((e) => console.log("Error initilizing APP: ", e));
