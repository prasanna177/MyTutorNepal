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
  hasParentPanel: {
    type: Boolean,
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
  isTutor: {
    type: Boolean,
    default: false
  },
  notification: {
    type: Array,
    default: []
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
