import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    id: { type: String },
    position: {
      required: true,
      type: new mongoose.Schema(
        {
          lat: { type: String, required: true },
          lng: { type: String, required: true },
        },
        { _id: false }
      ),
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Marker = mongoose.model("Marker", schema);

export default Marker;
