const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isAdmin = require('../middleware/authMiddleware');
const User = require('../models/User');
const Pet = require('../models/Pet');
const Appointment = require('../models/Appointment');
const ShelterBooking = require('../models/ShelterBooking');
const router = express.Router();

// Email validation function
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Get profile data for user or shelter
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

// Update user profile
router.put("/update-profile/:userId", async (req, res) => {
  const { name, phone, address } = req.body;

  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();
    res.json({ msg: "Profile updated successfully", user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Update shelter profile
router.put("/update-shelter-profile/:userId", async (req, res) => {
  const { name, shelterName, shelterLocation, phone, petTypes } = req.body;

  try {
    const user = await User.findById(req.params.userId);
    if (!user || user.userType !== "shelter") {
      return res.status(404).json({ msg: "Shelter not found" });
    }

    if (name) user.name = name;
    if (shelterName) user.shelterName = shelterName;
    if (shelterLocation) user.shelterLocation = shelterLocation;
    if (phone) user.phone = phone;
    if (petTypes) user.petTypes = petTypes;

    await user.save();
    res.json({ msg: "Shelter profile updated", user });
  } catch (err) {
    console.error("Shelter profile update error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// --------------- Admin Routes ---------------

// Get all users with their activities (Admin only)
router.get('/admin/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    const appointments = await Appointment.find({}).populate('userId', 'name email');
    const shelterBookings = await ShelterBooking.find({}).populate('userId', 'name email');

    // Enhance user data with their activities
    const enhancedUsers = users.map(user => {
      const userAppointments = appointments.filter(app => app.userId?._id.toString() === user._id.toString());
      const userBookings = shelterBookings.filter(book => book.userId.toString() === user._id.toString());

      return {
        ...user.toObject(),
        appointments: userAppointments,
        shelterBookings: userBookings,
        activityCount: userAppointments.length + userBookings.length
      };
    });

    res.json(enhancedUsers);
  } catch (error) {
    console.error('Admin users fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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

// Ban or unban a user
router.put('/admin/toggle-ban/:userId', isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Toggle ban status
    user.isBanned = !user.isBanned;
    await user.save();

    // Cancel all pending appointments and bookings if user is banned
    if (user.isBanned) {
      await Appointment.updateMany(
        { userId: user._id, status: 'pending' },
        { status: 'cancelled', cancellationReason: 'User account banned' }
      );

      await ShelterBooking.updateMany(
        { userId: user._id, status: 'pending' },
        { status: 'cancelled', cancellationReason: 'User account banned' }
      );
    }

    res.json({ 
      message: user.isBanned ? 'User banned successfully' : 'User unbanned successfully',
      user
    });
  } catch (error) {
    console.error('Ban toggle error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user activity details
router.get('/admin/user-activity/:userId', isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password -googleId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const [appointments, bookings] = await Promise.all([
      Appointment.find({ userId: user._id })
        .sort('-createdAt')
        .limit(10),
      ShelterBooking.find({ userId: user._id })
        .sort('-createdAt')
        .limit(10)
    ]);

    res.json({
      user: user.toJSON(),
      activity: {
        appointments,
        bookings,
        log: user.activityLog
      }
    });
  } catch (error) {
    console.error('User activity fetch error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
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

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        msg: 'Please provide all required fields'
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        msg: 'Please provide a valid email address'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        msg: 'Password must be at least 6 characters long'
      });
    }

    // Validate user type
    if (userType && !['user', 'shelter'].includes(userType)) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid user type'
      });
    }

    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      return res.status(400).json({
        success: false,
        msg: 'An account with this email already exists'
      });
    }

    // Create new user
    user = new User({
      name,
      email: email.toLowerCase(),
      password,
      userType: userType || 'user',
      authType: 'local'
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data in the format expected by frontend
    res.status(201).json({
      success: true,
      token,
      userType: user.userType,
      userId: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        msg: 'An account with this email already exists'
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        msg: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      msg: 'Registration failed. Please try again.'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        msg: 'Please provide both email and password'
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        msg: 'Invalid email or password'
      });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({
        msg: 'Your account has been suspended. Please contact support.'
      });
    }

    // Check if Google user
    if (user.authType === 'google') {
      return res.status(400).json({
        msg: 'Please login with Google'
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        msg: 'Invalid email or password'
      });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data in the format expected by frontend
    res.json({
      token,
      userType: user.userType,
      userId: user._id,
      name: user.name,
      email: user.email
    });
    
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      msg: 'An error occurred during login. Please try again.'
    });
  }
});

// Google Login
router.post('/google-login', async (req, res) => {
  try {
    const { name, email, googleId } = req.body;

    if (!email || !googleId) {
      return res.status(400).json({
        success: false,
        message: 'Email and Google ID are required'
      });
    }

    // Find or create user
    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Create new user
      user = new User({
        name,
        email: email.toLowerCase(),
        authType: 'google',
        googleId,
        userType: 'Pending' // User will need to select their type
      });
      await user.save();
    } else if (user.authType !== 'google') {
      // User exists but with different auth type
      return res.status(400).json({
        success: false,
        message: 'Please login with your email and password'
      });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support.'
      });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data
    res.json({
      success: true,
      token,
      userType: user.userType,
      userId: user._id,
      name: user.name,
      email: user.email
    });

  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({
      success: false,
      message: 'An error occurred during Google login'
    });
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
