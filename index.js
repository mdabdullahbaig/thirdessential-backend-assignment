const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const HttpError = require("./utils/HttpError");

const app = express();
const PORT = 3001;

// Application Level Middleware
// Parsing incoming request as json or urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("images"));

// Route Level Middleware
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);

// Route Not Match Handling Middleware
app.use((req, res, next) => {
  next(HttpError.NotFound("Route Not Found"));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(err.statusCode || 500);
  res.json({ message: err.message || "Something went wrong." });
});

mongoose
  .connect("mongodb://localhost:27017/thirdessentials")
  .then(() => {
    console.log("Database is connected successfully!");
    app.listen(PORT, () => {
      console.log(`App is listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
