// backend/routes/shelterRoutes.js
const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Get all shelters with optional filters
router.get("/", async (req, res) => {
  try {
    const { location, petType } = req.query;

    const filter = { userType: "Shelter" };

    if (location) filter.shelterLocation = location;
    if (petType) filter.petTypes = petType;

    const shelters = await User.find(filter).select("-password");

    res.json(shelters);
  } catch (err) {
    console.error("Error fetching shelters:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
