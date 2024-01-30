const mongoose = require("mongoose");

const tutorSchema = new mongoose.Schema({
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
  role: {
    type: String,
  },
});

const Tutor = mongoose.model("tutor", tutorSchema);

module.exports = Tutor;
