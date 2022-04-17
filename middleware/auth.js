const jwt = require("jsonwebtoken");
const HttpError = require("../utils/HttpError");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      const error = new HttpError(401, "Authentication failed!");
      return next(error);
    }

    const decodedToken = jwt.verify(token, "thisissecretcode");

    const decodedUser = await User.findById(decodedToken._id);

    // console.log(decodedUser);

    if (!decodedUser) {
      const error = new HttpError(401, "Authentication failed!!");
      return next(error);
    }

    req.currentUser = decodedUser;

    // console.log(req.currentUser);
    next();
  } catch (err) {
    const error = new HttpError(401, "Authentication failed!");
    return next(error);
  }
};

module.exports = auth;
