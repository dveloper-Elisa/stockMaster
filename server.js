const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/productModel.js");
const app = express();
app.use(express.json());

let PORT = 3000;

// recording product

app.post("/product", async (req, res) => {
  try {
    let productAdded = {
      name: req.body.name,
      quantity: req.body.quantity,
      pricePerUnit: req.body.pricePerUnit,
    };
    // adding total price to ProductAdded object
    productAdded.totalPrice = productAdded.quantity * productAdded.pricePerUnit;

    const product = await Product.create(productAdded);
    res
      .status(200)
      .json({ mesage: "Product recorded successfully", product: product });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// getting all the products

app.get("/products", async (req, res) => {
  try {
    const allProducts = await Product.find({});
    res.status(200).json({ products: allProducts });
  } catch (error) {
    res.status(500).json({ message: error + " found" });
  }
});

// search product by product id

app.get("/search/:id", async (req, res) => {
  try {
    let { id } = req.params;

    let product = await Product.findById(id);
    product
      ? res.status(200).json({
          status: "success",
          message: "product found",
          product: product,
        })
      : res
          .status(404)
          .json({ status: "failure", message: "product not found" });
  } catch (error) {
    res.status(500).json({ message: error + " occured when seaching" });
  }
});

// finding the product by id and updating

app.put("/search/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body);

  if (!product) {
    return res.status(404).json({ message: "Product to update is not found" });
  }
  const updatedProduct = await Product.findById(id);
  res.status(200).json({ status: "success", product: updatedProduct });
});

// deleting a Product from the store

app.delete("/search/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res
        .status(404)
        .json({ message: `Product to delete is not found with id ${id}` });
    } else {
      res
        .status(200)
        .json({ message: "Product deleted successfully", product: product });
    }
  } catch (error) {
    res.status(500).json({ message: "error" + error.message });
  }
});
// connection and listening the app

mongoose.set("strictQuery", false);
mongoose
  .connect(
    "mongodb+srv://kwizeraelisa77:Elisa123.@cluster0.yeqrg1b.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Application connected to MongoDB");
    app.listen(PORT, () => {
      console.log("App is listening on port " + PORT);
    });
  })
  .catch((err) => console.log("error" + " " + err));
