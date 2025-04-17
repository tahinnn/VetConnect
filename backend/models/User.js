const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  userType: {
    type: String,
    default: 'Pending',  // Default userType while registration
  },
  isBanned: {
    type: Boolean,
    default: false,  // Default value for banned status
  },
});

module.exports = mongoose.model('User', userSchema);
