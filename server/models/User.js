const mongoose = require("mongoose");
const validator = require("validator");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStratergy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validator(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    googleId: {
      type: Number,
    },
    password: {
      type: String,
      trim: true,
      minLength: 8,
    },
    tokens: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    toJson: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual("trips", {
  ref: "Trip",
  localField: "_id",
  foreignField: "travellers",
});
UserSchema.set("toJSON", { virtuals: true });

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};
UserSchema.methods.generateAccessToken = async function () {
  const token = jwt.sign({ id: this._id }, process.env.SECRET);
  this.tokens = this.tokens.concat(token);
  await this.save();
  console.log(token)
  return token;
};

UserSchema.statics.findUserByName = async (name) => {
  const user = await User.findOne({ name });
  return user;
};

const User = mongoose.model("User", UserSchema);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, cb) => {
      try {
        console.log(email , password) 
        const user = await User.findOne({ email });
        console.log(user)
        if (!user) {
          return cb(null, false, { message: "Incorrect email or password." });
        }
   
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return cb(null, false, { message: "Incorrect email or password." });
        }
        return cb(null, user, { message: "Logged In Successfully" });
      } catch (err) {
        cb(err);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "109538876893-s5pj4e95rk96k50eq9vofm7kv9kcn8fo.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3001/redirect",
    },(async (accessToken, refreshToken, profile, cb) => {
      const email = profile.emails[0].value;
      try {
        const user = await User.findOne({ email, googleId: profile.id });
        if (!user) {
          const user = new User({
            name: profile.displayName,
            email,
            googleId: profile.id,
          });
          return cb(null, user, { message: "Logged In Successfully" });
        }
        return cb(null, user, { message: "Logged In Successfully" });
      } catch (err) {
        cb(err);
      }
    })
    ))

passport.use(
  new JWTStratergy(
    {
      jwtFromRequest:  ExtractJwt.fromAuthHeaderAsBearerToken({
        authHeader: 'authorization' 
      }),
      secretOrKey: process.env.SECRET,
      passReqToCallback: true,
    },
    async function (req, jwtPayload, cb) {
      try {
        const user = await User.findById(jwtPayload.id);
        if (user) {
          req.user = user;
          req.token = jwtPayload;
          return cb(null, user);
        }
        cb(null, false);
      } catch (e) {
        cb(e, false);
      }
    }
  )
);

module.exports = User;
