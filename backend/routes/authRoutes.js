const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isAdmin = require('../middleware/authMiddleware');
const User = require('../models/User');
const Pet = require('../models/Pet'); // ✅ Added missing Pet import
const router = express.Router();

// ✅ Get profile data for user or shelter
router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.put("/update-shelter-profile/:userId", async (req, res) => {
  const { shelterName, shelterLocation, petTypes, newPassword } = req.body;

  try {
    const user = await User.findById(req.params.userId);
    if (!user || user.userType !== "Shelter") {
      return res.status(404).json({ msg: "Shelter not found" });
    }

    if (shelterName) user.shelterName = shelterName;
    if (shelterLocation) user.shelterLocation = shelterLocation;
    if (petTypes) user.petTypes = petTypes;

    if (newPassword && newPassword.length >= 6) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(newPassword, salt);
      user.password = hashed;
    }

    await user.save();
    res.json({ msg: "Shelter profile updated", user });
  } catch (err) {
    console.error("Shelter profile update error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// --------------- Admin Routes ---------------

// Get all users (Admin only)
router.get('/admin/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Promote a user to admin
router.put('/admin/make-admin/:userId', isAdmin, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.userType = 'Admin';
    await user.save();

    res.json({ msg: 'User promoted to Admin', user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Ban a user
router.put('/admin/ban-user/:userId', isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { isBanned: true }, { new: true });
    res.json({ msg: 'User banned successfully', user });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Get all pets
router.get('/admin/pets', isAdmin, async (req, res) => {
  try {
    const pets = await Pet.find({});
    res.json(pets);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Approve a pet listing
router.put('/admin/approve-pet/:petId', isAdmin, async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.petId, { isApproved: true }, { new: true });
    res.json({ msg: 'Pet listing approved', pet });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// --------------- Authentication Routes ---------------

// Register a user
router.post('/register', async (req, res) => {
  const { name, email, password, userType } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, userType });
    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully', userId: newUser._id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    if (!user.password || user.password === 'google-auth') {
      return res.status(403).json({ msg: 'Password not set. Please sign in with Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      token,
      userType: user.userType,
      userId: user._id,
      name: user.name,
      email: user.email
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Google Login
router.post('/google-login', async (req, res) => {
  const { name, email } = req.body;
  if (!email) return res.status(400).json({ msg: 'Email is required' });

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, password: 'google-auth', userType: 'Pending' });
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ 
      token,
      userType: user.userType,
      userId: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Update User Type
router.put('/update-user-type/:userId', async (req, res) => {
  const { userType } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.userType = userType;
    await user.save();

    res.json({ msg: 'User type updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
