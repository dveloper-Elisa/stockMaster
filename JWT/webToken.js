const jwt = require("jsonwebtoken");

require("dotenv").config();

const createToken = (user) => {
  const accessToken = jwt.sign(
    { userName: user.userName, password: user.password },
    process.env.TOKEN_SECRET,
    {
      expiresIn: 60 * 60 * 60 * 1000,
    }
  );

  return accessToken;
};

// verify the access token
const verifyTokens = (req, res, next) => {
  try {
    const bearToken = req.headers.authorization;
    console.log(bearToken);
    if (!bearToken)
      return res.status(403).json({ message: "Access token required" });
    const token = bearToken.split(" ")[1];
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
