const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); // To load environment variables

const app = express();
app.use(express.json()); // To parse JSON requests

// MongoDB Atlas connection string
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("VetConnect API is working!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});