require("../models/dbConnection");
require("dotenv").config();
const nodemailer = require("nodemailer");

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
      mesage: `User with ${users.userName} have been taken`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ messae: "Error while creating account" + error.message });
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
          const passwordUpdated = await Users.findOneAndUpdate(
            { email: email },
            { password: hashedNewPassword },
            { new: true }
          );

          if (passwordUpdated)
            return res.status(200).json({ message: "Email successfully sent" });
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
};
