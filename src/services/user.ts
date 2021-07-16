import express from "express";
import { basicAuthMiddleware, JWTMiddleWare } from "../lib/auth/auth";
import UserModel from "../DB/users/user";
import createError from "http-errors";
import { JWTAuthenticate } from "./../lib/auth/tools";
import { hostsOnly } from "../lib/auth/hosts";
import AccommodationModel from "../DB/accommodations/index";
import { DestinationModel } from "../DB/accommodations/index";

const userRouter = express.Router();

userRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    next(createError(500, { message: error.message }));
  }
});

userRouter.post("/login", basicAuthMiddleware, async (req: any, res, next) => {
  try {
    if (req.user) {
      const { accessToken, refreshToken } = await JWTAuthenticate(req.user);
      res.cookie("access_token", accessToken, { httpOnly: true });
      res.cookie("refresh_token", refreshToken, { httpOnly: true });
      res.status(200).send();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.get(
  "/me/accommodations",
  JWTMiddleWare,
  hostsOnly,
  async (req: any, res, next) => {
    try {
      if (req.user) {
        console.log("req.user:", req.user);
        const accommodations = await AccommodationModel.find({
          owner: req.user._id,
        }).populate({ path: "location", Model: DestinationModel });
        if (!accommodations) {
          next(createError(404, { message: "No accommodations" }));
        } else {
          res.status(200).send(accommodations);
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

userRouter.get("/me", JWTMiddleWare, async (req: any, res, next) => {
  try {
    if (req.user) {
      res.status(200).send(req.user);
    }
  } catch (error) {
    next(error);
  }
});

export default userRouter;
