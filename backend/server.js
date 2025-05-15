// Import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require("path");
require('dotenv').config();

// Create Express app
const app = express();


app.use(cors());

// Body parser middleware
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes
const shelterBookingRoutes = require('./routes/shelterBookings');
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adoptionRoutes = require('./routes/adoptions');



// Register API routes
app.use('/api/shelter-bookings', shelterBookingRoutes);
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use("/uploads", express.static("uploads"));
app.use('/api/adoptions', adoptionRoutes);

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
  res.status(500).json({ message: "Something broke!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});