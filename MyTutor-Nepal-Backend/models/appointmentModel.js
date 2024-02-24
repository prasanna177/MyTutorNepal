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
      type: String,
      required: true,
    },
    userInfo: {
      type: String,
      required: true,
    },
    date: {
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
  },
  { timestamps: true }
);

const Appointment = mongoose.model("appointments", appointmentSchema);

module.exports = Appointment;
