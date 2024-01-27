const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
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
});

const User = mongoose.model("user", userSchema);

module.exports = User;
