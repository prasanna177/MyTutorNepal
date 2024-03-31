const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  coordinates: {
    type: Object,
  },
  role: {
    type: String,
    enum: ["student", "admin", "tutor"],
    default: "student",
  },
  unseenNotification: {
    type: Array,
    default: [],
  },
  seenNotification: {
    type: Array,
    default: [],
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
