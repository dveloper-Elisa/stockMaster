const express = require("express");
// connection
require("../models/dbConnection");

const router = express.Router();

// services imported

const getProducts = require("../services/productService");
const getUsers = require("../services/userCredentials");

// ==============================================

// creating login routes

router.post("/users/login", getUsers.getLogin);
router.post("/users/signup", getUsers.getSignUp);

// ==============================================

// adding new products to the srock
router.post("/product", getProducts.addNewProduct);

// getting all the products
router.get("/products", getProducts.getProducts);

// searching for products by id
router.get("/search/:id", getProducts.getProductById);

//  searching product by id and updating
router.put("/search/:id", getProducts.updateProductById);

// deleting product from the store
router.delete("/search/:id", getProducts.deletingProduct);

// exporting router
module.exports = router;
