const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
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
    status: {
      type: String,
      required: true,
      default: "Pending",
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
    paymentStatus: {
      type: String,
      required: true,
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("appointments", appointmentSchema);

module.exports = Appointment;
