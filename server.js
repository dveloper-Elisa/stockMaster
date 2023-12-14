require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const router = require("./routes/useRoutes.js");
const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

let PORT = process.env.PORT || 3000;
// connection and listening the app
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Application connected to MongoDB");
    app.listen(PORT, () => {
      console.log("App is listening on port " + PORT);
    });
  })
  .catch((err) => console.log("error" + " " + err));
