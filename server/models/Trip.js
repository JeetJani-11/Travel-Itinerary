const mongoose = require("mongoose");
const Place = require("./Place");

const TripSchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: true,
    },
    from: {
      type: Date,
      required : true
    },
    to: {
      type: Date,
      required : true ,
      
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    travellers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    notes: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true  , toJSON : {virtuals : true}}
);

TripSchema.virtual("itinerary", {
  ref: "Place",
  localField: "_id",
  foreignField: "trip",
});

TripSchema.pre('findOneAndDelete'  , async function(next){
  const filter = this.getFilter()
 console.log (filter._id)
  await Place.deleteMany({trip : filter._id})
  return next()
})

const Trip = new mongoose.model("Trip", TripSchema);

module.exports = Trip;
