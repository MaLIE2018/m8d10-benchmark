import express from "express";
import AccommodationModel from "../DB/accommodations/index";
import { DestinationModel } from "../DB/accommodations/index";
import mongoose from "mongoose";

const accommodationRouter = express.Router();

accommodationRouter.get("/", async (req, res) => {
  const accommodations = await AccommodationModel.find({}).populate({
    path: "location",
    model: DestinationModel,
  });
  res.status(200).send(accommodations);
});

accommodationRouter.get("/destinations", async (req, res) => {
  const destinations = await DestinationModel.find()
    .sort({ field: 1 })
    .distinct("location");
  res.status(200).send(destinations);
});

accommodationRouter.get("/destinations/:id", async (req, res) => {
  const id = req.params.id;
  const accommodations = await AccommodationModel.find({
    location: id,
  }).populate({ path: "location", model: DestinationModel });
  if (!accommodations) {
    res.status(404).send();
  }
  res.status(200).send(accommodations);
});

accommodationRouter.post("/destinations", async (req, res) => {
  try {
    const destination = await new DestinationModel({
      ...req.body,
      location: req.body.location.toLowerCase(),
    });
    await destination.save();
    res.status(200).send({ _id: destination._id });
  } catch (error) {
    if (error.message.includes("E11000")) {
      res.status(400).send("You already have created that one");
    }
  }
});

accommodationRouter.get("/:id", async (req, res) => {
  try {
    !mongoose.isValidObjectId(req.params.id)
      ? res.status(400).send("invalid mongoDBId")
      : null;
    const accommodation = await AccommodationModel.findById(
      req.params.id
    ).populate({ path: "location", model: DestinationModel });
    if (!accommodation) {
      res.status(404).send();
      return;
    }
    res.status(200).send(accommodation);
  } catch (error) {
    console.log(error);
  }
});

accommodationRouter.post("/", async (req, res, next) => {
  try {
    const accommodation = await new AccommodationModel(req.body);
    await accommodation.save();
    res.status(200).send(accommodation);
  } catch (error) {
    error.name === "ValidationError"
      ? res.status(400).send("Invalid obj")
      : next();
  }
});

accommodationRouter.put("/:id", async (req, res, next) => {
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
});
accommodationRouter.delete("/:id", async (req, res, next) => {
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
});

export default accommodationRouter;
