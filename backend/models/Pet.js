// models/Pet.js
const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  image: { type: String },
  location: { type: String },
  gender: { type: String },
  amount: { type: Number },
  phone: { type: String },
  age: { type: Number, required: true },
  breed: { type: String, required: true },
  vaccinated: { type: Boolean, default: false },
  status: { type: String, enum: ['Available', 'Adopted'], default: 'Available' },
  description: { type: String, maxlength: 5000 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isApproved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Pet', PetSchema);
