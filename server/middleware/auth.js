const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = async (req, res, next) => {
 
  const token = req.headers["authorization"].split(" ")[1];
  
  if (!token) {
    return res.send({ error: "Unauthorized" });
  }
  const userId = await jwt.decode(token, process.env.SECRET);
  
  const user = await User.findById(userId.id);
  
  req.user = user
  next();
};

module.exports = auth;
