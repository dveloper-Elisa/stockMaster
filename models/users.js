const mongoose = require("mongoose");

const userShema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "please email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Users = mongoose.model("Users", userShema);

module.exports = Users;
