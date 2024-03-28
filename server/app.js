const express = require("express");
const userRouter = require("./routers/user");
const tripRouter = require("./routers/trip");
const pdfRouter = require("./routers/pdf");
const locationRouter = require("./routers/location");
require("./db/mongoose");
const passport = require("passport");

const app = express();
const cors = require("cors");
app.use(
  cors({
    credentials: true,
  })
);
app.use(passport.initialize());
app.use(express.json());
app.use(userRouter);
app.use(tripRouter);
app.use(pdfRouter);
app.use(locationRouter);

app.listen(3001, () => {
  console.log("Server is up at port");
});
