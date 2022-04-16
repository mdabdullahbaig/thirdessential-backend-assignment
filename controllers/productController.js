const Product = require("../models/product");
const HttpError = require("../utils/HttpError");

const createProduct = async (req, res, next) => {
  const { name, price } = req.body;

  const product = new Product({
    name,
    price,
    image: `http://localhost:3001/${req.file.filename}`,
  });

  try {
    await product.save();
  } catch (error) {
    return next(HttpError.BadRequest(error.message));
  }

  res.status(201).json(product);
};

const getProducts = async (req, res, next) => {};

const updateProductById = async (req, res, next) => {};

const deleteProductById = async (req, res, next) => {};

exports.createProduct = createProduct;
exports.getProducts = getProducts;
exports.updateProductById = updateProductById;
exports.deleteProductById = deleteProductById;
