const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  gender: { type: String, required: true },
  amount: { type: Number, required: true },
  phone: { type: Number, required: true },
  age: { type: Number, required: true },
  breed: { type: String, required: true },
  vaccinated: { type: Boolean, default: false },
  status: { type: String, enum: ['Available', 'Adopted'], default: 'Available' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isApproved: { type: Boolean, default: false }  
}, { timestamps: true });

module.exports = mongoose.model('Pet', PetSchema);
