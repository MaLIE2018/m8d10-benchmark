import express from "express";
import AccommodationModel from "../DB/accommodations/index";
import { DestinationModel } from "../DB/accommodations/index";
import createError from "http-errors";
import { JWTMiddleWare } from "../lib/auth/auth";
import { hostsOnly } from "../lib/auth/hosts";

const destinationRouter = express.Router();

destinationRouter.get(
  "/destinations",
  JWTMiddleWare,
  async (req, res, next) => {
    const destinations = await DestinationModel.find().sort({ field: 1 });
    res.status(200).send(destinations);
  }
);

destinationRouter.get(
  "/destinations/:id",
  JWTMiddleWare,
  async (req, res, next) => {
    const id = req.params.id;
    const accommodations = await AccommodationModel.find({
      location: id,
    }).populate({ path: "location", model: DestinationModel });
    if (!accommodations) {
      res.status(404).send();
    } else {
      res.status(200).send(accommodations);
    }
  }
);

destinationRouter.post(
  "/destinations",
  JWTMiddleWare,
  hostsOnly,
  async (req, res, next) => {
    try {
      const destination = await new DestinationModel({
        ...req.body,
        location: req.body.location,
      });
      await destination.save();
      res.status(200).send({ _id: destination._id });
    } catch (error) {
      if (error.message.includes("E11000")) {
        next(createError(400, "message: You already have created that one"));
      }
    }
  }
);

export default destinationRouter;
