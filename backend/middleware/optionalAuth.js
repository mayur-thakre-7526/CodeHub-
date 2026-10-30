const jwt = require("jsonwebtoken");

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Login nahi hai: public repositories access kar sakte hain
  if (!authHeader) {
    req.user = null;
    return next();
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Invalid authorization header.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired token. Please log in again.",
    });
  }
};

module.exports = { optionalAuth };
