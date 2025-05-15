const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// Middleware to verify if the user is an admin
const isAdmin = async (req, res, next) => {
  const token = req.header("x-auth-token") || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // Case-insensitive comparison for admin check
    if (user.userType.toLowerCase() !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admin privileges required." });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = isAdmin;
