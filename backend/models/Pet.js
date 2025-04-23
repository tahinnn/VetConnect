const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String }, // Can be a URL or base64
  age: { type: Number, required: true },
  breed: { type: String, required: true },
  vaccinated: { type: Boolean, default: false },
  status: { type: String, enum: ['Available', 'Adopted'], default: 'Available' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who added the pet
}, { timestamps: true });

module.exports = mongoose.model('Pet', PetSchema);
