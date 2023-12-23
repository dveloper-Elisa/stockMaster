require("../models/dbConnection");
const Product = require("../models/productModel");
const Sales = require("../models/salesMode");

// updating Product model before saling the product

const updatingTheProduct = async (req, res, next) => {
  try {
    let productToSale = {
      name: req.body.name,
      quantity: req.body.quantity,
      pricePerUnit: req.body.pricePerUnit,
    };
    // finding the product to update
    const product = await Product.findOne({ name: productToSale.name });
    if (!product) {
      return res
        .status(404)
        .json({ message: `${productToSale.name} not exist in the stock` });
    }

    productQuantity = product.quantity;
    if (productToSale.quantity > productQuantity) {
      return res.status(500).json({
        message: `${productToSale.quantity} is greater than ${product.quantity} available in stock`,
      });
    }
    //   updating product quantity

    let valueToUpdate = {
      quantity: productQuantity - productToSale.quantity,
      pricePerUnit: product.pricePerUnit,
    };
    valueToUpdate.totalPrice =
      valueToUpdate.quantity * valueToUpdate.pricePerUnit;

    const updatedProduct = await Product.findOneAndUpdate(
      { name: productToSale.name },
      valueToUpdate,
      { new: true }
    );
    if (!updatedProduct) {
      res.status(500).json({ message: "Product not Updated in the stock" });
      return;
    } else next();
  } catch (error) {}
};

// storing the sold products in Sales Mode

const soldProduct = async (req, res) => {
  try {
    let productToSale = {
      name: req.body.name,
      quantity: req.body.quantity,
      pricePerUnit: req.body.pricePerUnit,
    };

    // recording product in stock
    productToSale.totalPayed =
      productToSale.quantity * productToSale.pricePerUnit;

    const sales = await Sales.create(productToSale);

    if (!sales)
      res.status(500).json({ message: "Error while recording product sold" });
    res.status(200).json({
      message: "Product successfully sold and recorded",
      product: sales,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while Seling product", error: error.message });
  }
};

// Sales History API

const salesHistory = async (req, res) => {
  try {
    const allSales = await Sales.find();
    if (!allSales || allSales.length == 0) {
      return res.status(401).json({ message: "Sales History not found" });
    }
    return res.json({ message: "Sales History generated", history: allSales });
  } catch (error) {
    res.status(500).json({
      message: "sales history generation error" + " " + error.message,
    });
  }
};

// sales history generation depanding on dates
const salesHistoryByDate = async (req, res) => {
  try {
    let specifiedDate = new Date(req.params.date);
    specifiedDate.setHours(0, 0, 0, 0);

    const endTheDay = new Date(specifiedDate);
    endTheDay.setHours(23, 59, 59, 999);
    const allSales = await Sales.find({
      createdAt: {
        $gt: specifiedDate,
        $lt: endTheDay,
      },
    });
    if (!allSales || allSales.length == 0) {
      return res.status(401).json({ message: "Sales History not found" });
    }
    return res.json({ message: "Sales History generated", history: allSales });
  } catch (error) {
    res.status(500).json({
      message: "sales history generation error" + " " + error.message,
    });
  }
};
// exporting modules

module.exports = {
  soldProduct,
  updatingTheProduct,
  salesHistory,
  salesHistoryByDate,
};
