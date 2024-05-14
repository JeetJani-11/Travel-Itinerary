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
        path: 'trips',
        model: 'Trip',
        populate: {
          path: 'places.place',
          model: 'Place'
        }
      });
      console.log(user.trips);
      res.status(200).send(user.trips);
    } catch (e) {
      console.error("Error during trips population:", e);
      res.status(500).send({ e: e.message });
    }
  }
);

router.get("/trip/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({ path: 'trips', model: 'Trip' });
    const isValid = user.trips.find((trip) => trip.equals(req.params.id));
    if (!isValid) {
      throw new Error("Cannot Access Trip");
    }
    const trip = await Trip.findById(req.params.id).populate({
      path: 'places.place',
      model: 'Place'
    });
    res.send(trip);
  } catch (e) {
    res.status(500).send({ e: e.message });
  }
});

router.get('/search/trips/:name' , passport.authenticate('jwt' , {session : false}) , async(req , res) => {
  try {
    console.log(req.params.name);
    const regex = new RegExp(req.params.name + '$', "i");
    const places = await Place.find({ name : { $regex: regex } });
    console.log(places);
    res.send(places);
  } catch(e) {
    res.status(500).send({error: e.message});
  }
});


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
      console.log(req.body);
      const trip = await Trip.findById(req.params.id);
      trip.notes = trip.notes.concat(req.body.text);
      await trip.save();
      res.send(trip);
    } catch (e) {
      res.status(500).send({ e: e.message });
    }
  }
);

router.delete(
  "/removeNote/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.id);
      trip.notes = trip.notes.filter((note) => note !== req.body.text);
      console.log(req.body.text);
      await trip.save();
      res.send(trip);
    } catch (e) {
      res.status(500).send({ e: e.message });
    }
  }
);

router.post(
  "/addPlaces/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { name, date, location } = req.body;
      let place = await Place.findOne({name});
      if(!place){
        place = new Place({ ...req.body });
      }
      console.log(place);
      const trip = await Trip.findById(req.params.id);
      trip.places = trip.places.concat({place : place._id , date});
      await trip.save();
      await place.save();
   

      res.send(place);
    } catch (e) {}
  }
);

router.delete(
  "/removePlace",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { tripId , placeId } = req.body;
      console.log(tripId, placeId);
      const trip = await Trip.findById(tripId);
      console.log(trip);
      const tripContains = trip.places.find((place) => {
        console.log(place.place, placeId);
        return place.place.equals(placeId);
      });
      console.log(tripContains);
      if (!tripContains) {
        return res.status(400).send();
      }
      trip.places = trip.places.filter((place) => {
        return !place.place.equals(placeId);
      });
      console.log(trip.places);
      await trip.save();
      res.send(trip);
    } catch (e) {
      res.status(500).send({ e: e.message });
    }
  }
);

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
