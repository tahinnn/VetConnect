// Import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require("path");
require('dotenv').config();

// Create Express app
const app = express();

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
const shelterPetsDir = path.join(uploadsDir, 'shelter-pets');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(shelterPetsDir)) fs.mkdirSync(shelterPetsDir);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    msg: 'Something went wrong! Please try again.'
  });
});

// Import routes
const shelterBookingRoutes = require('./routes/shelterBookings');
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Use routes
app.use('/api/shelter-bookings', shelterBookingRoutes);
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);

// Reviews routes should be before the catch-all appointment routes
app.use('/api/reviews', reviewRoutes);

// This should be last as it's a catch-all route
app.use('/api/appointments', appointmentRoutes);

// Connect to MongoDB
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Default route
app.get('/', (req, res) => {
  res.send('VetConnect API is working!');
});

// 404 Error Handler for unknown APIs
app.use((req, res, next) => {
  res.status(404).json({ message: "API Not Found" });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
console.log('Review routes mounted');