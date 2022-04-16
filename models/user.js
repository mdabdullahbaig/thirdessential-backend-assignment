const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isSuperAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  loginTime: {
    type: String,
    required: true,
  },
  logoutTime: {
    type: String,
    required: true,
  },
});

// Generating Authorization Token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, "thisissecretcode", {
    expiresIn: "1h",
  });
  return token;
};

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

module.exports = model("User", userSchema);
