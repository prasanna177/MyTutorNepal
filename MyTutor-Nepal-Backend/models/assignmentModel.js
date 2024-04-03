const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    difficulty: {
      type: Number,
      required: true,
    },
    grade: {
      type: Number,
    },
    tutorInfo: {
      type: Object,
      required: true,
    },
    studentInfo: {
      type: String,
      required: true,
    },
    submittedFile: {
      type: String,
    },
    remarks: {
      type: String,
    },
    deadline: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
    }
  },
  { timestamps: true }
);

const Assignment = mongoose.model("assignments", assignmentSchema);

module.exports = Assignment;
