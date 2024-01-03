import { User } from "./src/models/User";

declare module "express-serve-static-core" {
  interface Request {
    user?: User; // Assuming User is the type you want
  }
}
