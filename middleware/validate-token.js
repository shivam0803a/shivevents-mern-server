const jwt = require("jsonwebtoken");

const validateToken = (req, resp, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return resp.status(401).json({ message: "Unauthorised" });
    }

      const decryptObj = jwt.verify(token, "shivevents-mern");
      req.user = decryptObj;
      next();
  } catch (error) {
    return resp.status(401).json({ message: "Invalid Token" });
  }
};

module.exports = validateToken;
