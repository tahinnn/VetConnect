
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isAdmin = require('../middleware/authMiddleware');  // Import the middleware
const User = require('../models/User'); // Import the User model
const router = express.Router();



// admin route
router.get('/admin/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).send('Server error');
  }
});


// Update userType route to make someone an admin
router.put('/admin/make-admin/:userId', isAdmin, async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update the userType to 'Admin'
    user.userType = 'Admin';
    await user.save();

    res.json({ msg: 'User has been promoted to Admin', user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});




// Get all users (Admin only)
router.get('/admin/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Ban a user (Admin only)
router.put('/admin/ban-user/:userId', isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.userId, { isBanned: true }, { new: true });
    res.json({ msg: 'User banned successfully', user });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Get pet listings (Admin only)
router.get('/admin/pets', isAdmin, async (req, res) => {
  try {
    const pets = await Pet.find({});
    res.json(pets);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Approve a pet listing (Admin only)
router.put('/admin/approve-pet/:petId', isAdmin, async (req, res) => {
  try {
    const pet = await Pet.findByIdAndUpdate(req.params.petId, { isApproved: true }, { new: true });
    res.json({ msg: 'Pet listing approved', pet });
  } catch (error) {
    res.status(500).send('Server error');
  }
});



//  Register route (Sign-Up)
router.post('/register', async (req, res) => {
  const { name, email, password, userType } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists. Please login.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, userType });
    await newUser.save();

    // Return the userId along with the success message
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
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    if (!user.password || user.password === 'google-auth') {
      return res.status(403).json({ msg: 'Password not set. Please sign in with Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      token,
      userType: user.userType  // ✅ Send user type (User or Shelter)
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

//  Google Login route

router.post('/google-login', async (req, res) => {
  const { name, email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: 'Email is required for Google login' });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: 'google-auth',
        userType: 'Pending'
      });
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      userType: user.userType,
      userId: user._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//  Update userType route
router.put('/update-user-type/:userId', async (req, res) => {
  const { userType } = req.body;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.userType = userType;
    await user.save();

    res.json({ msg: 'User type updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
