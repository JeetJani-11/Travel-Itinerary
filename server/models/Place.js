const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      x: {
        type: Number,
        required: true,
      },
      y: {
        type: Number,
        required: true,
      },
    },
  },
  { timestamps: true  , toJSON : {virtuals : true}}
);

const Place = new mongoose.model("Place", PlaceSchema);

module.exports = Place;
