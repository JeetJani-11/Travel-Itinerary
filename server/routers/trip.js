const express = require("express");
const mongoose = require("mongoose");
const Trip = require("../models/Trip");
const router = new express.Router();
const passport = require("passport");
const User = require("../models/User");
const Place = require("../models/Place");

router.post(
  "/trip",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log(req.body);
      const trip = new Trip({
        ...req.body,
        owner: req.user._id,
        travellers: [req.user._id],
      });
      await trip.save();
      res.send(trip);
    } catch (e) {
      res.status(500).send({ e: e.message });
    }
  }
);

router.get(
  "/trips",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate({
        path: "trips",
        populate: {
          path: 'itinerary',
          model: 'Place'
        }
      });
      res.status(200).send(user.trips);
    } catch (e) {
      console.error("Error during trips population:", e);
      res.status(500).send({ e: e.message });
    }
  }
);

router.post(
  "/addUser/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findUserByName(req.body.user);
      if (!user) {
        throw new Error("No User!");
      }
      const trip = await Trip.findById(req.params.id);
      console.log(trip.travellers, req.user._id);
      const canAdd = trip.travellers.find((element) =>
        element.equals(req.user._id)
      );
      console.log(canAdd);
      if (!canAdd) {
        throw new Error("Cannot Add User");
      }
      trip.travellers = trip.travellers.concat(user._id);
      await trip.save();
      return res.send(trip);
    } catch (e) {
      res.status(500).send({ e: e.message });
    }
  }
);

router.post(
  "/addNotes/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log(req.body.text);
      console.log(req.body)
      const trip = await Trip.findById(req.params.id);
      trip.notes = trip.notes.concat(req.body.text);
      await trip.save();
      res.send(trip);
    } catch (e) {
      res.status(500).send({ e: e.message });
    }
  }
);

router.delete('/removeNote/:id' , passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    trip.notes = trip.notes.filter((note) => note !== req.body.text);
    console.log(req.body.text);
    await trip.save();
    res.send(trip);
  } catch (e) {
    res.status(500).send({ e: e.message });
  }
})
router.post(
  "/addPlaces/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const place = new Place({ ...req.body, trip: req.params.id });
      await place.save();
      res.send(place);
    } catch (e) {}
  }
);

router.delete('/removePlace/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    console.log(req.params.id)
    const place = await Place.findByIdAndDelete(req.params.id);
    if(!place){
      return res.status(400).send();
    }
    res.send(place);
  } catch (e) {
    res.status(500).send({ e: e.message });
  }
})

router.delete(
  "/trip/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      console.log(req.params.id, req.user._id);
      const trip = await Trip.findOneAndDelete({
        _id: req.params.id,
        owner: req.user._id,
      });
      console.log(trip);
      if (!trip) {
        return res.status(400).send();
      }
      res.send(trip);
    } catch (e) {
      res.status(500).send({ e: e.message });
    }
  }
);

module.exports = router;
