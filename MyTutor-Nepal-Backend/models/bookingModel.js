const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  tutorId: {
    type: String,
    required: true,
  },
  tutorInfo: {
    type: Object,
    required: true,
  },
  userInfo: {
    type: Object,
    required: true,
  },
  fromDate: {
    type: String,
    required: true,
  },
  toDate: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  feePerClass: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  paymentType: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now(), expires: 3600 },
});

const Booking = mongoose.model("bookings", bookingSchema);

module.exports = Booking;
