const express = require("express");
const router = new express.Router();

router.get("/geocoding", async (req, res) => {
  try {
    const cordinates = await fetch(
      `https://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?address=${req.query.address}&outFields=*&f=json&token=${process.env.ACCESS_TOKEN}`
    );
    const data = await cordinates.json();
    res.send(data.candidates[0].location);
  } catch (e) {
    res.status(500).send({ e: e.message });
  }
});

router.get("/nearby", async (req, res) => {
  console.log(req.query.categoryIds , "zdfgnhmbgfdsfghnmbfdsfgbn")
  const categoryIds = [req.query.categoryIds] || [
    "16000",
    "10000",
    "14000",
  ];

  try {
    console.log(categoryIds)
    const nerby = await fetch(
      `https://places-api.arcgis.com/arcgis/rest/services/places-service/v1/places/near-point?x=${parseFloat(
        req.query.x
      )}&y=${parseFloat(
        req.query.y
      )}&categoryIds=${categoryIds}&outFields=*&f=json&token=${
        process.env.ACCESS_TOKEN
      }&radius=10000&pageSize=20`
    );
    const data = await nerby.json();
    console.log(nerby , data)
    let places = []
    data.results.forEach(element => {
      console.log(element)
      places = places.concat(element)
    });
    console.log(places)
    res.send({ places });
  } catch (e) {
    res.status(500).send({ e: e.message });
  }
});

module.exports = router;
