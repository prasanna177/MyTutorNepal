const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    teachingInfo: {
      type: Array,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
    timing: {
      type: Object,
      required: true,
    },
    address: {
      type: String,
      required: [true, "Please enter an address"],
    },
    coordinates: {
      type: Object,
      required: true,
    },
    profilePicUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Tutor = mongoose.model("tutor", tutorSchema);

module.exports = Tutor;
