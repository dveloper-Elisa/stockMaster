require("./dbConnection");
const mongoose = require("mongoose");

const saleShema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product to sale is required"],
    },
    quantity: {
      type: Number,
      required: true,
    },
    pricePerUnit: {
      type: Number,
      required: true,
    },
    totalPayed: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Sales = mongoose.model("Sales", saleShema);

module.exports = Sales;
