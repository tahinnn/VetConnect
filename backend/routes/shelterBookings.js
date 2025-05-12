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
    // Parse stringified JSON fields
    const parsedBody = {};
    Object.keys(req.body).forEach(key => {
      try {
        parsedBody[key] = JSON.parse(req.body[key]);
      } catch {
        parsedBody[key] = req.body[key];
      }
    });

    console.log('Received booking data:', parsedBody); // Debug log

    const bookingData = {
      userId: parsedBody.userId,
      userName: parsedBody.userName,
      petName: parsedBody.petName,
      breed: parsedBody.breed,
      isVaccinated: parsedBody.isVaccinated || 'No',
      days: parseInt(parsedBody.days),
      shelterId: parsedBody.shelterId?.toString(),
      shelterName: parsedBody.shelterName,
      shelterLocation: parsedBody.shelterLocation,
      shelterImage: parsedBody.shelterImage,
      petImage: req.file ? `/uploads/shelter-pets/${req.file.filename}` : undefined,
      totalCharge: parseInt(parsedBody.totalCharge),
      advancePayment: parseInt(parsedBody.advancePayment),
      duePayment: parseInt(parsedBody.duePayment),
      paymentMethod: req.body.paymentMethod,
      paymentStatus: 'advance_paid',
      transactionId: req.body.transactionId
    };

    // Convert all fields to strings or numbers as needed
    if (typeof bookingData.isVaccinated === 'boolean') {
      bookingData.isVaccinated = bookingData.isVaccinated ? 'Yes' : 'No';
    }

    console.log('Processed booking data:', bookingData); // Debug log

    // Validate required fields
    const requiredFields = [
      'userId', 'userName', 'petName', 'breed', 'isVaccinated', 'days',
      'shelterId', 'shelterName', 'shelterLocation', 'totalCharge',
      'advancePayment', 'duePayment', 'paymentMethod', 'transactionId'
    ];

    const missingFields = requiredFields.filter(field => !bookingData[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const booking = new ShelterBooking(bookingData);
    await booking.save();

    console.log('Booking saved successfully:', booking); // Debug log

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Shelter booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating shelter booking'
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
