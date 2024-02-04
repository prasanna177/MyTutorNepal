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
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    subjects: {
      type: Array,
      required: true,
    },
    feePerClass: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: 'Pending'
    },
    timing: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

const Tutor = mongoose.model("tutor", tutorSchema);

module.exports = Tutor;
