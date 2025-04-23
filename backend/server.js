// Import required modules
const express = require('express');  // Web framework for Node.js
const mongoose = require('mongoose');  // MongoDB ODM for Node.js
require('dotenv').config();  // For loading environment variables

const dotenv = require("dotenv");

// Create an Express app
const app = express();

// Enable CORS for all origins or specify a particular origin
const cors = require('cors');
app.use(cors());  // This allows all origins, you can restrict it to a specific domain if needed

// Middleware to parse JSON requests
app.use(express.json());

// Import routes after initializing app
const testRoutes = require("./routes/testRoutes");
app.use("/api/test", testRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);


// MongoDB connection (using the URI from .env file)
const dbURI = process.env.MONGODB_URI;

// Connect to MongoDB using Mongoose
mongoose.connect(dbURI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const petRoutes = require('./routes/petRoutes');
app.use('/api/pets', petRoutes);
  


// Basic route to check if the server is working
app.get('/', (req, res) => {
  res.send('VetConnect API is working!');
});

// Set the port the server will listen to
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
