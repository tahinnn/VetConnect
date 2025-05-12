const mongoose = require('mongoose');

const shelterBookingSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },
  petName: {
    type: String,
    required: true
  },
  breed: {
    type: String,
    required: true
  },
  isVaccinated: {
    type: String,
    enum: ['yes', 'no'],
    required: true
  },
  days: {
    type: Number,
    required: true,
    min: 1,
    max: 30
  },
  petImage: {
    type: String  // URL to the stored image
  },
  shelterId: {
    type: Number,
    required: true
  },
  shelterName: {
    type: String,
    required: true
  },
  shelterLocation: {
    type: String,
    required: true
  },
  totalCharge: {
    type: Number,
    required: true
  },
  advancePayment: {
    type: Number,
    required: true
  },
  duePayment: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'advance_paid', 'fully_paid'],
    default: 'pending'
  },
  transactionId: {
    type: String
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ShelterBooking', shelterBookingSchema, 'Shelter_Booking');
