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
    dueMoney: {
      type: Number,
      default: 0,
    },
    phone: {
      type: String,
      required: true,
    },
    bio: {
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
    },
    nIdFrontUrl: {
      type: String,
      required: true,
    },
    nIdBackUrl: {
      type: String,
      required: true,
    },
    teachingCertificateUrl: String,
    averageSentiment: {
      type: String,
      enum: ["positive", "negative", "neutral"],
      default: "neutral",
    },
    averageRating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Tutor = mongoose.model("tutor", tutorSchema);

module.exports = Tutor;
