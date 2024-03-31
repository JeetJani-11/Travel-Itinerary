const mongoose = require("mongoose");
const Place = require("./Place");

const TripSchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: true,
    },
    coordinates: {
      x: {
        type: Number,
    //  required: true,
      },
      y: {
        type: Number,
    //  required: true,
      },
    },
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    travellers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    notes: [
      {
        type: String,
      },
    ],
    places: [
      {
        place: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Place",
        },
        date: {
          type: Date,
        },
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

const Trip = new mongoose.model("Trip", TripSchema);

module.exports = Trip;
