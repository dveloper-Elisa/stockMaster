require("../models/dbConnection");
require("dotenv").config();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const getTokens = require("../JWT/webToken");

const Users = require("../models/users");

const getLogin = async (req, res) => {
  try {
    const user = {
      email: req.body.email,
      password: req.body.password,
    };

    const userFound = await Users.findOne({ email: req.body.email });

    if (!userFound) {
      return res.status(400).json({
        message: `User not found!`,
      });
    }

    const match = await bcrypt.compare(user.password, userFound.password);

    if (!match) {
      return res.status(400).json({
        message: `Username or password is incorrect!`,
      });
    }

    const accessToken = getTokens.createToken(user);
    return res.status(200).json({
      token: accessToken,
      message: "log in successfully👏",
      email: req.body.email,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
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

    const userExists = await Users.findOne({ email: users.email });
    if (!userExists) {
      const createUser = await Users.create(users);
      return res
        .status(200)
        .json({ message: "User Created successfully 👏", user: createUser });
    }
    res.status(500).json({
      mesage: `User with ${users.email} have been taken`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ messae: "Error while creating account" + error.message });
  }
};

// changing the password
const changePassword = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const credetials = {
      newPassword: req.body.newPassword,
      confirmPassword: req.body.confirmPassword,
    };

    const credetialMatch =
      credetials.newPassword === credetials.confirmPassword ? true : false;

    if (credetialMatch) {
      const hashedPassword = await bcrypt.hash(credetials.newPassword, 10);
      jwt.verify(token, process.env.TOKEN_SECRET, async (error, decode) => {
        if (error) return res.status(500).json({ message: error.message });
        else {
          const foundUser = await Users.findOneAndUpdate(
            {
              email: decode.email,
            },
            { password: hashedPassword },
            { new: true }
          );

          return res.status(200).json({
            users: `Password for ${foundUser.userName} chaged success fully`,
          });
        }
      });
    } else return res.status(500).json({ message: error.message });
  } catch (error) {
    res.status(501).json({ message: "Password not chaged due to mis match" });
  }
};

// sending reseting password
const passwordReset = async (req, res) => {
  try {
    const { email } = req.body;
    isUserEmailExist = await Users.findOne({ email: email });
    if (isUserEmailExist) {
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_ADDRESS,
          pass: process.env.APP_PASSWORD,
        },
      });
      // generating password
      let sourcePassword =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxy";
      let generatedPassword = "";
      for (i = 1; i < sourcePassword.length; i++) {
        const charIndex = Math.floor(Math.random() * sourcePassword.length);
        generatedPassword += sourcePassword[charIndex];
        if (i === 8) {
          break;
        }
      }

      // sending mail with password
      let mailOptions = {
        from: "noreplay@gmail.com",
        to: email,
        subject: "Password reset request",
        text: "Password reset email",
        html: `Hello 🤚 <b>${isUserEmailExist.userName}</b> This is Stocker master password reset. Your New password is: <p style="background-color:#753675;color:white; font-weight:bolder;padding:5px;max-width:fit-content;letter-spacing:3px">${generatedPassword}</p><p> The request of reseting password was successfully Completed.</p><div>elisoftech Team</div>`,
      };

      transporter.sendMail(mailOptions, async function (error, info) {
        if (error)
          return res
            .status(500)
            .json({ message: "error" + "" + error.message });
        else {
          // updating password
          let hashedNewPassword = await bcrypt.hash(generatedPassword, 10);
          await Users.findOneAndUpdate(
            { email: email },
            { password: hashedNewPassword },
            { new: true }
          );
          return res.status(200).json({ message: "Email sent successfully" });
        }
      });
    } else return res.status(404).json({ message: "Email not registered" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message + "Ocurred when resting password" });
  }
};

// exporting Modules
module.exports = {
  getSignUp,
  getLogin,
  passwordReset,
  changePassword,
};
