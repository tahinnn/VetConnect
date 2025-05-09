const express = require('express');
const router = express.Router();

// Test route
router.get('/', (req, res) => {
  res.send("Test route is working!");
});

module.exports = router;
