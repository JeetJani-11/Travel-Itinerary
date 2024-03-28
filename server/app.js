const express = require("express");
const userRouter = require("./routers/user");
const tripRouter = require("./routers/trip");
const pdfRouter = require("./routers/pdf");
const locationRouter = require("./routers/location");
require("./db/mongoose");
const session = require("express-session");
const passport = require("passport");

const app = express();
const cors = require('cors');
// app.use(cors({origin : '*'}));
app.use(cors());

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "bla bla bla",
  })
);

app.use(passport.authenticate("session"));
app.use(express.json());
app.use(userRouter);
app.use(tripRouter);
app.use(pdfRouter);
app.use(locationRouter);

app.get("/test", async (req, res) => {
  res.send({ Hello: "World" });
});
app.listen(3001, () => {
  console.log("Server is up at port");
});
