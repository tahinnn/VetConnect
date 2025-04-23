const express = require("express");
const router = express.Router();
const Pet = require("../models/Pet");

// GET all pets
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 });
    res.json(pets);
  } catch (err) {
    console.error("Error fetching pets:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;




router.get("/sample", async (req, res) => {
    const samplePet = {
      name: "Luna",
      image: "https://placekitten.com/300/300",
      age: 3,
      breed: "Golden Retriever",
      vaccinated: true,
      status: "Available",
      owner: "6630f95f4f5b8c37e0d54e91" // Use a valid User ID from your MongoDB
    };
  
    try {
      const pet = await Pet.create(samplePet);
      res.status(201).json(pet);
    } catch (err) {
      console.error("Sample Pet Error:", err);
      res.status(500).json({ message: "Failed to create sample pet" });
    }
  });
  