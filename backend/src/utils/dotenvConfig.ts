import { config } from "dotenv";
const envFile =
  process.env.NODE_ENV === "production"
    ? "./.env.production"
    : process.env.NODE_ENV === "test"
    ? "./.env.test"
    : "./.env";

config({ path: envFile });
