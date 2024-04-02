const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");
const passport = require("passport");
const pdf = require("pdf-creator-node");
const fs = require("fs");
const dayjs = require("dayjs");
const path = require("path");
const html = fs.readFileSync("./utils/template.html", "utf8");

const formatDate = (date) => {
  return dayjs(date).format("DD MMM");
};
var options = {
  format: "A3",
  orientation: "portrait",
  border: "10mm",
};

function iterateDates(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];
  while (start <= end) {
    dates.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }
  return dates;
}

router.get(
  "/pdf/:id",
  passport.authorize("jwt", { session: false }),
  async (req, res) => {
    try {
      const trip = await Trip.findById(req.params.id)
        .populate({
          path: "travellers",
          model: "User",
        })
        .populate({
          path: "places.place",
          model: "Place",
        });
 
      const canCreate = trip.travellers.find((element) =>
        element.equals(req.user._id)
      );

      if (!canCreate) {
        throw new Error("Cannot Create PDF");
      }

      const destination = {
        name: trip.destination,
        startDate: formatDate(trip.from),
        endDate: formatDate(trip.to),
      };

      const friends = trip.travellers.map((friend) => {
        return {
          name: friend.name,
          email: friend.email,
        };
      });

      const places = trip.places.map((place) => {
        return {
          name: place.name,
          address: place.address,
          date: place.date,
        };
      });

      const dates = iterateDates(trip.from, trip.to);
      const placesByDate = dates.map((date) => {
        const placesOnDate = places.filter((place) => {
           const placeDate = new Date(place.date);
           return (
             placeDate.getFullYear() === date.getFullYear() &&
             placeDate.getMonth() === date.getMonth() &&
             placeDate.getDate() === date.getDate()
           );
        });
        if (placesOnDate.length === 0) {
           placesOnDate.push({ name: "No Places to visit" });
        }
        return {
           date: formatDate(date),
           places: placesOnDate,
        };
       });
       
      const notes = trip.notes.map((note) => {
        return {
          content: note,
        };
      });

      var document = {
        html: html,
        css : "./utils/style.css",
        data: {
          destination,
          friends,
          dates: placesByDate,
          notes,
        },
        path: "./output.pdf",
        type: "",
      };

      pdf
        .create(document, options)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.error(error);
        });

      res.download(path.join(__dirname, "../output.pdf"), "output.pdf");
    } catch (e) {
      res.status(500).send({ e: e.message });
    }
  }
);

module.exports = router;
