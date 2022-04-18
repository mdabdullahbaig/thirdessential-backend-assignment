const fs = require("fs");
const Product = require("../models/product");
const HttpError = require("../utils/HttpError");

const createProduct = async (req, res, next) => {
  const { name, price } = req.body;
  const userId = req.currentUser._id;

  if (req.currentUser.isSuperAdmin) {
    return next(HttpError.Unauthorized());
  }

  const product = new Product({
    name,
    price,
    image: `http://localhost:3001/${req.file.filename}`,
    user: userId,
  });

  try {
    await product.save();
  } catch (error) {
    return next(HttpError.BadRequest(error.message));
  }

  res.status(201).json(product);
};

const getProducts = async (req, res, next) => {
  let products;

  try {
    products = await Product.find({ user: req.currentUser._id }).populate(
      "user"
    );
  } catch (error) {
    return next(HttpError.BadRequest(error.message));
  }

  res.status(200).json(products);
};

const updateProductById = async (req, res, next) => {
  const { name, price } = req.body;
  const id = req.params.id;
  const userId = req.currentUser._id;

  let product;

  try {
    product = await Product.findOne({ _id: id, user: userId });
  } catch (error) {
    return next(HttpError.InternalServerError(error.message));
  }

  if (!product) {
    return next(HttpError.NotFound());
  }

  try {
    product.name = name;
    product.price = price;
    await product.save();
  } catch (error) {
    return next(HttpError.InternalServerError(error.message));
  }

  res.status(200).json(product);
};

const deleteProductById = async (req, res, next) => {
  const id = req.params.id;
  const userId = req.currentUser._id;

  let product;

  try {
    product = await Product.findOne({ _id: id, user: userId });
  } catch (error) {
    return next(HttpError.InternalServerError(error.message));
  }

  if (!product) {
    return next(HttpError.NotFound());
  }

  const path = product.image.split("3001/")[1];

  fs.unlink(`images/${path}`, (err) => {
    if (err) {
      return next(HttpError.InternalServerError(err));
    }
  });

  try {
    await product.remove();
  } catch (error) {
    return next(HttpError.BadRequest(error.message));
  }

  res.status(200).json({ message: "Product has been deleted successfully." });
};

exports.createProduct = createProduct;
exports.getProducts = getProducts;
exports.updateProductById = updateProductById;
exports.deleteProductById = deleteProductById;
