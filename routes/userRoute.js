const express = require("express");
const {
  login,
  register,
  logout,
  getUsers,
  getUserById,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/", getUsers);
router.get("/:id", getUserById);

module.exports = router;
