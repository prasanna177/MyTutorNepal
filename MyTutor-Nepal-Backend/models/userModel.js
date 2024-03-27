const mongoose = require("mongoose");
const Tutor = require("./tutorModel");

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

userSchema.pre("save", async function (next) {
  // Check if the fullName or email field has changed
  if (this.isModified("fullName") || this.isModified("email")) {
    // Update associated Tutor documents
    await Tutor.updateMany(
      { userId: this._id },
      { fullName: this.fullName, email: this.email }
    );
  }
  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
