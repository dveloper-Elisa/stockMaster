const express = require("express");
// connection
require("../models/dbConnection");

const router = express.Router();

// services imported

const getProducts = require("../services/productService");
const getUsers = require("../services/userCredentials");
const soldedProduct = require("../services/saleServices");
const getToken = require("../JWT/webToken");

// ==============================================

// creating login routes

router.post("/users/login", getUsers.getLogin);
router.post("/users/signup", getUsers.getSignUp);

// ==============================================

// adding new products to the srock
router.post("/product", getToken.verifyTokens, getProducts.addNewProduct);

// getting all the products
router.get("/products", getToken.verifyTokens, getProducts.getProducts);

// searching for products by id
router.get("/search/:id", getToken.verifyTokens, getProducts.getProductById);

//  searching product by id and updating
router.put("/search/:id", getToken.verifyTokens, getProducts.updateProductById);

// deleting product from the store
router.delete(
  "/search/:id",
  getToken.verifyTokens,
  getProducts.deletingProduct
);

// ==========================================================
// routes for the sold product

router.post(
  "/sales/sell",
  getToken.verifyTokens,
  soldedProduct.updatingTheProduct,
  soldedProduct.soldProduct
);

// routes for sales history

router.get(
  "/sales/sales-history",
  getToken.verifyTokens,
  soldedProduct.salesHistory
);
// finding history by date
router.get(
  "/sales/sales-history/:date",
  getToken.verifyTokens,
  soldedProduct.salesHistoryByDate
);

// ==========================================================

// exporting router
module.exports = router;
