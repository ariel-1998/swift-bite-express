import { User as UserModel } from "../src/models/User";

// declare module "express-serve-static-core" {
//   interface Request {
//     user?: UserModel; // Assuming User is the type you want
//   }
// }
declare global {
  namespace Express {
    interface User extends UserModel {}
  }
}
