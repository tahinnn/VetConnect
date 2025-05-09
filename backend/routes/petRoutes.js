const express = require("express");
const router = express.Router();
const Pet = require("../models/Pet");
const multer = require("multer");
const path = require("path");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// GET all pets
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find()
      .populate("owner", "userType shelterName shelterLocation") // Fetch user type & shelter info
      .sort({ createdAt: -1 });
    res.json(pets);
  } catch (err) {
    console.error("Error fetching pets:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST new pet ad
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      type,
      breed,
      age,
      gender,
      location,
      amount,
      phone,
      owner,
      description,
    } = req.body;

    const newPet = new Pet({
      name,
      image: req.file ? `/uploads/${req.file.filename}` : "", //  use uploaded image
      type,
      age,
      breed,
      gender,
      location,
      amount,
      phone,
      vaccinated: false,
      status: "Available",
      isApproved: false,
      owner,
      description,
    });

    await newPet.save();
    res.status(201).json({ message: "Pet Ad Created", pet: newPet });
  } catch (error) {
    console.error("Pet upload error:", error);
    res.status(500).json({ message: "Error creating pet ad" });
  }
});

//create pet route
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      name, type, breed, age, gender, location,
      amount, phone, owner, description
    } = req.body;

    const user = await User.findById(owner);
    if (!user) return res.status(404).json({ message: "Owner not found" });

    // ⛔ Shelter restriction: must fill profile
    if (user.userType === "Shelter") {
      if (!user.shelterName || !user.shelterLocation || !user.petTypes) {
        return res.status(400).json({
          message: "Shelter must complete profile before creating an ad.",
        });
      }
    }

    const newPet = new Pet({
      name,
      type,
      breed,
      age,
      gender,
      location,
      amount,
      phone,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : "",
      owner: user._id,
      isApproved: false,
    });

    await newPet.save();
    res.status(201).json({ message: "Pet Ad Created", pet: newPet });
  } catch (error) {
    console.error("Pet upload error:", error);
    res.status(500).json({ message: "Error creating pet ad" });
  }
});


module.exports = router;
