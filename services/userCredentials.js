require("../models/dbConnection");

const bcrypt = require("bcrypt");

const Users = require("../models/users");

const getLogin = async (req, res) => {
  try {
    const user = {
      userName: req.body.userName,
      password: req.body.password,
    };

    // const matchPassword = await bcrypt.compare(user.password, await Use)

    const userExists = await Users.findOne({
      userName: user.userName,
      password: user.password,
    });

    if (!userExists) {
      return res.status(404).json({
        message: `user with Uname:${user.userName} not Exists, please Sign up`,
      });
    }

    res.status(200).json({
      status: "Welcome to Home page👏",
      message: "user Loged in successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error happen when logging in" + error.message });
  }
};

// Creating account / Signing up

const getSignUp = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const users = {
      userName: req.body.userName,
      email: req.body.email,
      password: hashedPassword,
    };

    const userExists = await Users.findOne({ userName: users.userName });
    if (!userExists) {
      const createUser = await Users.create(users);
      res.status(200).json({ message: "User Created successfully" });
    }
    res.status(500).json({
      mesage: `User with ${users.userName} already exists🤞,please Login 👈`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ messae: "Error while creating account" + error.message });
  }
};

// exporting Modules
module.exports = {
  getSignUp,
  getLogin,
};
