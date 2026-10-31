const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authentication required. Please log in.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    console.log("JWT verified successfully");
    console.log("Decoded user ID:", decoded.id);

    req.user = {
      id: decoded.id,
    };

    next();
  } catch (error) {
    console.error("JWT verification failed:", error.name, error.message);

    return res.status(401).json({
      error: "Invalid or expired token. Please log in again.",
    });
  }
};

module.exports = { authenticateToken };
