const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    tutorId: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    appointmentId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    grade: {
      type: Number,
    },
    appointmentInfo: {
      type: Object,
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
    submissionDate: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
    },
  },
  { timestamps: true }
);

const Assignment = mongoose.model("assignments", assignmentSchema);

module.exports = Assignment;
