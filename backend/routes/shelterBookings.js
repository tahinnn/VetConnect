const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ShelterBooking = require('../models/ShelterBooking');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/shelter-pets/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create new booking
router.post('/', upload.single('petImage'), async (req, res) => {
  try {
    const bookingData = {
      ...req.body,
      petImage: req.file ? `/uploads/shelter-pets/${req.file.filename}` : undefined,
      days: parseInt(req.body.days),
      totalCharge: parseInt(req.body.totalCharge),
      advancePayment: parseInt(req.body.advancePayment),
      duePayment: parseInt(req.body.duePayment),
      paymentStatus: 'advance_paid'
    };

    const booking = new ShelterBooking(bookingData);
    await booking.save();

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Shelter booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating shelter booking'
    });
  }
});

// Get all bookings for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await ShelterBooking.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await ShelterBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update payment status
router.patch('/:id/payment', async (req, res) => {
  try {
    const booking = await ShelterBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.paymentStatus = req.body.paymentStatus;
    if (req.body.transactionId) {
      booking.transactionId = req.body.transactionId;
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
