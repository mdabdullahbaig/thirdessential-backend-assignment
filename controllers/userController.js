const moment = require("moment");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const HttpError = require("../utils/HttpError");

const register = async (req, res, next) => {
  const { name, email, phone, address, password } = req.body;

  let existedUser;

  try {
    existedUser = await User.findOne({ email });
  } catch (error) {
    return next(HttpError.InternalServerError(error.message));
  }

  if (existedUser) {
    return next(
      new HttpError(200, "User already exist, Please login instead.")
    );
  }

  const user = new User({
    name,
    email,
    phone,
    address,
    password,
    loginTime: moment().unix(),
    logoutTime: moment().unix(),
  });

  try {
    await user.save();
  } catch (error) {
    return next(HttpError.BadRequest(error.message));
  }

  res.status(201).json({
    message: "Account has been successfully created.",
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existedUser;

  try {
    existedUser = await User.findOne({ email });
  } catch (error) {
    return next(HttpError.InternalServerError(error.message));
  }

  if (!existedUser) {
    return next(HttpError.Forbidden());
  }

  const isValidPassword = await bcrypt.compare(password, existedUser.password);

  if (!isValidPassword) {
    return next(HttpError.Forbidden());
  }

  try {
    existedUser.loginTime = moment().unix();
    await existedUser.save();
  } catch (error) {
    return next(HttpError.InternalServerError(error.message));
  }

  const token = existedUser.generateAuthToken();

  return res.status(201).json({ token });
};

const logout = async (req, res, next) => {
  const currentUserId = req.user.id;

  let existedUser;

  try {
    existedUser = await User.findOne({ _id: currentUserId });
  } catch (error) {
    next(new HttpError.InternalServerError(error.message));
  }

  if (!existedUser) {
    return next(new HttpError.Unauthorized());
  }

  try {
    existedUser.logoutTime = moment().unix();
    await existedUser.save();
  } catch (error) {
    next(new HttpError.InternalServerError(error.message));
  }

  res.status(200).json({ message: "You are successfully logout" });
};

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({ isSuperAdmin: false });
  } catch (error) {
    return next(HttpError.InternalServerError(error.message));
  }

  if (users.length < 1) {
    return next(HttpError.NotFound("Users not found."));
  }

  res.status(200).json(users);
};

const getUserById = async (req, res, next) => {
  const userId = req.params.id;
  let user;

  try {
    user = await User.findOne({ _id: userId, isSuperAdmin: false });
  } catch (error) {
    return next(HttpError.InternalServerError(error.message));
  }

  if (!user) {
    return next(HttpError.NotFound("User not Found."));
  }

  res.status(200).json(user);
};

exports.register = register;
exports.login = login;
exports.logout = logout;
exports.getUsers = getUsers;
exports.getUserById = getUserById;
