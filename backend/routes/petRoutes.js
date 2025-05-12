const express = require("express");
const router = express.Router();
const Pet = require("../models/Pet");
const User = require("../models/User");
const isAdmin = require('../middleware/authMiddleware');
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

// ✅ GET all pets
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find()
      .populate("owner", "userType name email shelterName shelterLocation")
      .sort({ createdAt: -1 });
      
    // If you want to implement the requested status later, you can uncomment and modify this section
    /*
    if (userId) {
      const AdoptionRequest = require('../models/AdoptionRequest');
      const requests = await AdoptionRequest.find({ requester: userId });
      const requestedPetIds = requests.map(req => req.pet.toString());

      pets = pets.map(pet => {
        const petObj = pet.toObject();
        petObj.requested = requestedPetIds.includes(pet._id.toString());
        return petObj;
      });
    }
    */

    res.json(pets);
  } catch (err) {
    console.error("Error fetching pets:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// ✅ GET a single pet by ID
router.get("/:id", async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate("owner", "userType name email shelterName shelterLocation");
    if (!pet) return res.status(404).json({ msg: "Pet not found" });

    res.json(pet);
  } catch (err) {
    console.error("Error fetching pet by ID:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ GET pets by shelter
router.get("/by-shelter/:shelterId", async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.params.shelterId }).populate("owner", "shelterName shelterLocation userType");
    res.json(pets);
  } catch (err) {
    console.error("Error fetching pets by shelter:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ✅ DELETE a pet listing (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await Pet.findByIdAndDelete(req.params.id);
    res.json({ msg: "Listing deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// ✅ POST new pet ad (shelter/user)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      name, type, breed, age, gender, location,
      amount, phone, owner, description
    } = req.body;

    const user = await User.findById(owner);
    if (!user) return res.status(404).json({ message: "Owner not found" });

    if (user.userType === "Shelter") {
      if (!user.shelterName || !user.shelterLocation || !user.petTypes) {
        return res.status(400).json({ message: "Shelter must complete profile before creating an ad." });
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
