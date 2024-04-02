const express = require("express");
const router = new express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const User = require("../models/User");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 8);
    const user = new User({ name, email, password: hashPassword });
    const token = await user.generateAccessToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(500).send({ e: e.message });
  }
});

router.get(
  "/login/federated/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
  })
);

router.get("/redirect", async (req, res, next) => {
  passport.authenticate(
     "google",
     {
       session: false,
       successRedirect: "http://localhost:3000",
       failureRedirect: "http://localhost:3000/login",
     },
     async (err, user, info) => {
       if (err || !user) {
         return res.status(400).json({
           message: "Something is not right",
           info,
         });
       }
       const token = await user.generateAccessToken();
       res.cookie("token", token, { httpOnly: false });
       res.cookie("user", user, { httpOnly: false });
       res.redirect("http://localhost:3000/home");
     }
  )(req, res, next);
 });
 
 
 
router.post("/login", async (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({
          message: "Something is not right",
          info,
        });
      }
      const token = await user.generateAccessToken();
      res.status(200).send({ user, token });
      next();
    }
  )(req, res, next);
});

router.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter(
        (token) => token !== req.header("Authorization").replace("Bearer ", "")
      );
      await req.user.save();
      res.send();
    } catch (e) {
      res.status(500).send();
    }
  }
);

router.get("/user", auth, async (req, res) => {
  console.log("hellooo");
  console.log(res.headers);
  res.json(req.user);
});

router.get("/users/:s", async (req, res) => {
  try {
    const regex = new RegExp(req.params.s, "i");
    const users = await User.find({ name: { $regex: regex } });
    console.log(users);
    res.send(users);
  } catch (e) {
    res.status(500).send({ e: e.message });
  }
});
router.post(
  "/logoutall",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      req.user.tokens = [];
      await req.user.save();
      res.send();
    } catch (e) {
      res.status(500).send();
    }
  }
);

module.exports = router;
