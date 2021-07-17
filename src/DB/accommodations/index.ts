import mongoose from "mongoose";
import { Accommodation } from "../../types/interfaces";

const AccommodationSchema = new mongoose.Schema<Accommodation>(
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
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

AccommodationSchema.methods.toJSON = function () {
  const accs = this;
  const accsObj = accs.toObject();
  delete accsObj.location.__v;
  delete accsObj.updatedAt;
  delete accsObj.createdAt;
  delete accsObj.__v;
  return accsObj;
};

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
