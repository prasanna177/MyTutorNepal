const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    tutorId: {
      type: String,
      required: true,
    },
    appointmentId: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    review: String,
    sentiment: Number
  },
  { timestamps: true }
);

const Rating = mongoose.model("rating", ratingSchema);

module.exports = Rating;
