require("../models/dbConnection");

const bcrypt = require("bcrypt");
const getTokens = require("../JWT/webToken");

const Users = require("../models/users");

const getLogin = async (req, res) => {
  try {
    const user = {
      userName: req.body.userName,
      password: req.body.password,
    };

    // const matchPassword = await bcrypt.compare(user.password, await Use)

    const usersName = await Users.findOne({ userName: req.body.userName });
    const matchPassword = await bcrypt.compare(
      user.password,
      usersName.password
    );

    if (!matchPassword) {
      return res.status(400).json({
        message: `userName or password not correct!, please Sign up`,
      });
    } else {
      const accessToken = getTokens.createToken(user);
      res.json({ accessToken });

      return res.status(200).json({
        status: "Welcome to Home page",
        message: "user Loged in successfully👏",
      });
    }
  } catch (error) {
    console.log(error);
    // res.status(500).json({ message: "Error happen when logging in" + error });
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
      return res
        .status(200)
        .json({ message: "User Created successfully 👏", user: createUser });
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
