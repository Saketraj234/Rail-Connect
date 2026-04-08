const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  coachNumber: { type: String }, // Can be null for WL
  seatNumber: { type: String },  // Can be null for WL
  berth: { type: String },       // Can be null for WL
  status: { type: String, default: 'CNF' }, // CNF, RAC, WL
  wlNumber: { type: Number },    // For WL
  racNumber: { type: Number },   // For RAC
  wifiSelected: { type: Boolean, default: false },
  wifiId: { type: String },
  wifiPassword: { type: String },
});

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  train: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Train',
  },
  passengers: [passengerSchema],
  totalPrice: {
    type: Number,
    required: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  travelDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'Confirmed',
  },
  isCancelled: { type: Boolean, default: false },
  refundAmount: { type: Number, default: 0 },
  cancellationDate: { type: Date },
}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
