const express = require("express");
const app = express();

let PORT = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to my first API server");
});

app.listen(PORT, () => {
  console.log("App is listening on port " + PORT);
});
