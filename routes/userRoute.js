const express = require("express");
const {
  login,
  register,
  logout,
  getUsers,
  getCurrentUser,
} = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/register", auth, register);
router.post("/login", login);
router.post("/logout", auth, logout);
router.get("/", auth, getUsers);
router.get("/me", auth, getCurrentUser);

module.exports = router;
