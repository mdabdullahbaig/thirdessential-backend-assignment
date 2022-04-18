const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createProduct,
  getProducts,
  updateProductById,
  deleteProductById,
} = require("../controllers/productController");
const auth = require("../middleware/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log("1: ", file);
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    // console.log("2: ", file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const filefilter = (req, file, cb) => {
  // console.log("2: ", file);
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: filefilter });

router.post("/", upload.single("image"), auth, createProduct);
router.get("/", auth, getProducts);
router.patch("/:id", auth, updateProductById);
router.delete("/:id", auth, deleteProductById);

module.exports = router;
