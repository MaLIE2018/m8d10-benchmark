import mongoose from "mongoose";

const AccommodationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    maxGuests: {
      type: Number,
      required: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const DestinationSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
    unique: true,
  },
});

export const DestinationModel = mongoose.model(
  "Destination",
  DestinationSchema
);

const AccommodationModel = mongoose.model("accommodation", AccommodationSchema);
export default AccommodationModel;
