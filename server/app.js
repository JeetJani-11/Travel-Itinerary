const express = require("express");
const userRouter = require("./routers/user");
const tripRouter = require("./routers/trip");
const pdfRouter = require("./routers/pdf");
const locationRouter = require("./routers/location");
require("./db/mongoose");
const passport = require("passport");

const app = express();
app.use(passport.initialize());
app.use(express.json());
app.use('/api/' ,userRouter);
app.use('/api/' ,tripRouter);
app.use('/api/' ,pdfRouter);
app.use('/api/' ,locationRouter);
app.get("/test", (req, res) => {
  console.log("Test");
  res.send("Hello World");
});
app.listen(3001, () => {
  console.log("Server is up at port");
});
