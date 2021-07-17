import UserModel from "../../src/DB/users";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserModel;
  }
}
