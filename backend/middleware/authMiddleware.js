const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// Middleware to verify if the user is an admin
const isAdmin = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;

    // Get user type (admin) from the database using the userId
    User.findById(req.user).then((user) => {
      if (user.userType !== "Admin") {
        return res.status(403).json({ msg: "Access denied" });
      }
      next();
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = isAdmin;
