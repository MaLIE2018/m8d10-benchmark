import express from "express";
import AccommodationModel from "../DB/accommodations/index";
import { DestinationModel } from "../DB/accommodations/index";
import UserModel from "../DB/users/user";

import mongoose from "mongoose";
import createError from "http-errors";
import { JWTMiddleWare } from "../lib/auth/auth";
import { hostsOnly } from "../lib/auth/hosts";

const accommodationRouter = express.Router();

accommodationRouter.get("/", JWTMiddleWare, async (req, res, next) => {
  const accommodations = await AccommodationModel.find({}).populate({
    path: "location",
    model: DestinationModel,
  });
  res.status(200).send(accommodations);
});

accommodationRouter.get("/:id", JWTMiddleWare, async (req, res, next) => {
  try {
    !mongoose.isValidObjectId(req.params.id)
      ? res.status(400).send("invalid mongoDBId")
      : null;
    const accommodation = await AccommodationModel.findById(req.params.id)
      .populate({ path: "location", model: DestinationModel })
      .populate({ path: "owner", model: UserModel });
    if (!accommodation) {
      res.status(404).send();
      return;
    }
    res.status(200).send(accommodation);
  } catch (error) {
    console.log(error);
  }
});

accommodationRouter.post(
  "/",
  JWTMiddleWare,
  hostsOnly,
  async (req, res, next) => {
    try {
      const accommodation = await new AccommodationModel(req.body);
      await accommodation.save();
      res.status(200).send(accommodation);
    } catch (error) {
      error.name === "ValidationError"
        ? res.status(400).send("Invalid obj")
        : next();
    }
  }
);

accommodationRouter.put(
  "/:id",
  JWTMiddleWare,
  hostsOnly,
  async (req, res, next) => {
    try {
      !mongoose.isValidObjectId(req.params.id)
        ? res.status(400).send("invalid mongoDBId")
        : null;
      const accommodation = await AccommodationModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!accommodation) {
        res.status(404).send();
        return;
      }
      res.status(204).send(accommodation);
    } catch (error) {
      error.name === "ValidationError"
        ? res.status(400).send("Invalid obj")
        : next();
    }
  }
);
accommodationRouter.delete(
  "/:id",
  JWTMiddleWare,
  hostsOnly,
  async (req, res, next) => {
    try {
      !mongoose.isValidObjectId(req.params.id)
        ? res.status(400).send("invalid mongoDBId")
        : null;
      const accommodation = await AccommodationModel.findByIdAndDelete(
        req.params.id
      );
      if (!accommodation) {
        res.status(404).send();
        return;
      }
      res.status(204).send();
    } catch (error) {
      console.log(error.message);
      next();
    }
  }
);

export default accommodationRouter;
