const express = require("express");
require("../models/dbConnection");

// importing product Schema from Module
const Product = require("../models/productModel");

// displaying products
const getProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({});
    res.status(200).json({ products: allProducts });
  } catch (error) {
    res.status(500).json({ message: error + " found" });
  }
};

// searching product by id
const getProductById = async (req, res) => {
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
};

// recording product in the database

const addNewProduct = async (req, res) => {
  try {
    let productAdded = {
      name: req.body.name,
      quantity: req.body.quantity,
      pricePerUnit: req.body.pricePerUnit,
    };

    // checking if the product is already added in database
    const productAlreadyAdded = await Product.findOne({ name: req.body.name });
    if (productAlreadyAdded) {
      res.status(403).json({
        message: `Product ${req.body.name} already Exists, please update`,
      });
    } else {
      // adding total price to ProductAdded object
      productAdded.totalPrice =
        productAdded.quantity * productAdded.pricePerUnit;

      const product = await Product.create(productAdded);
      res
        .status(200)
        .json({ mesage: "Product recorded successfully", product: product });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

// finding the product by id and updating

const updateProductById = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body);

  if (!product) {
    return res.status(404).json({ message: "Product to update is not found" });
  }
  const updatedProduct = await Product.findById(id);
  res.status(200).json({ status: "success", product: updatedProduct });
};

// deleting a Product from the store

const deletingProduct = async (req, res) => {
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
};

// exporting the services
module.exports = {
  addNewProduct,
  getProducts,
  getProductById,
  updateProductById,
  deletingProduct,
};
