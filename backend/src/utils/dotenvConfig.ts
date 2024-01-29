import { config } from "dotenv";
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_ENV === "test" ? config({ path: ".env.test" }) : config();
}
