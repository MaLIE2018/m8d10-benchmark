import UserModel from "../../DB/users/user";
import createError from "http-errors";
import { verifyAccessToken } from "./tools";
import atob from "atob";

export const JWTMiddleWare = async (req: any, res: any, next: any) => {
  if (!req.cookies.access_token) {
    next(createError(401, { message: "Provide Access Token" }));
  } else {
    try {
      const content = await verifyAccessToken(req.cookies.access_token);

      const user = await UserModel.findById(content._id);

      if (user) {
        req.user = user;
        next();
      } else {
        next(createError(404, { message: "User not found" }));
      }
    } catch (error) {
      next(createError(401, { message: "AccessToken not valid" }));
    }
  }
};

export const basicAuthMiddleware = async (req: any, res: any, next: any) => {
  if (!req.headers.authorization) {
    next(createError(401, { message: "Authorization required" }));
  } else {
    const decoded = atob(req.headers.authorization.split(" ")[1]);
    const [email, password] = decoded.split(":");

    const user = await UserModel.checkCredentials(email, password);

    if (user) {
      req.user = user;
      next();
    } else {
      next(createError(401, { message: "Credentials wrong" }));
    }
  }
};
