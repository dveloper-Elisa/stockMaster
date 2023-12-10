const jwt = require("jsonwebtoken");

require("dotenv").config();

const createToken = (user) => {
  const accessToken = jwt.sign(
    { userName: user.userName, password: user.password },
    process.env.TOKEN_SECRET,
    {
      expiresIn: 60 * 60 * 1000,
    }
  );

  return accessToken;
};

// verify the access token
const verifyTokens = (req, res, next) => {
  try {
    let token = req.body.token;
    const verifyToken = jwt.verify(token, process.env.TOKEN_SECRET);

    if (!verifyToken) {
      return res.status(401).json({ message: "you are not authenticated" });
    }
    next();
  } catch (error) {
    res.status(401).json({ message: "you are not authenticated" });
  }
};

// exporting modules
module.exports = { createToken, verifyTokens };
