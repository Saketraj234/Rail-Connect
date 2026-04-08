const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  trainNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  timing: {
    type: String,
    required: true,
  },
  classes: [
    {
      className: { type: String, required: true }, // SL, 3A, 2A, 1A
      price: { type: Number, required: true },
      seats: { type: Number, required: true },
    }
  ],
}, {
  timestamps: true,
});

const Train = mongoose.model('Train', trainSchema);
module.exports = Train;
