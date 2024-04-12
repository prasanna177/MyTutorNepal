const User = require("../models/userModel");
const Tutor = require("../models/tutorModel");
const moment = require("moment");
const crypto = require("crypto");
const Assignment = require("../models/assignmentModel");
const Appointment = require("../models/appointmentModel");

module.exports.getUserAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      studentId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "Assignments fetched successfully.",
      data: assignments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching user assignments",
    });
  }
};

module.exports.submitAssignment = async (req, res) => {
  try {
    let { assignmentInfo, remarks, submittedFile, submissionDate } = req.body;
    if (!submittedFile) {
      return res.status(200).send({
        success: false,
        message: "No file found",
      });
    }
    const existingAssignment = await Assignment.find({
      _id: assignmentInfo._id,
      status: "Submitted",
    });
    if (existingAssignment.length > 0) {
      return res.status(200).send({
        success: false,
        message: "Cannot send assignment more than once.",
      });
    }
    submissionDate = moment(submissionDate).utc().format("YYYY-MM-DD HH:mm:ss");
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      assignmentInfo._id,
      {
        remarks,
        submittedFile,
        status: "Submitted",
        submissionDate,
      }
    );
    const tutor = await Tutor.findById(
      updatedAssignment.appointmentInfo.tutorId
    );
    const tutorUser = await User.findById(tutor.userId);
    const user = await User.findById(updatedAssignment.appointmentInfo.userId);
    tutorUser.unseenNotification.unshift({
      id: crypto.randomBytes(16).toString("hex"),
      type: "submit-assignment",
      message: `Assignment submitted by ${user.fullName}`,
      // onClickPath: "/tutor/appointments/assignments/",
      date: new Date(),
    });
    tutorUser.save();
    res.status(200).send({
      success: true,
      message: "Assignment submitted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in submitting assignments",
    });
  }
};

module.exports.getAssignmentsForAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const assignments = await Assignment.find({ appointmentId });
    res.status(200).send({
      success: true,
      message: "Assignments fetched succcessfully",
      data: assignments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while fetching assignments.",
    });
  }
};

module.exports.createAssignment = async (req, res) => {
  try {
    const currentDate = moment().utc().format("YYYY-MM-DD HH:mm:ss");
    req.body.deadline = moment(req.body.deadline)
      .utc()
      .format("YYYY-MM-DD HH:mm:ss");
    const isDeadlineValid = moment(
      req.body.deadline,
      "YYYY-MM-DD HH:mm:ss"
    ).isSameOrAfter(currentDate);
    if (!isDeadlineValid) {
      return res.status(200).send({
        success: false,
        message: "Deadline has already passed.",
      });
    }
    const { appointmentId } = req.body;
    const appointmentInfo = await Appointment.findById(appointmentId);
    const assignment = await Assignment({
      ...req.body,
      appointmentInfo,
      status: "Pending",
    });
    await assignment.save();
    const user = await User.findById(assignment.appointmentInfo.userId);
    user.unseenNotification.unshift({
      id: crypto.randomBytes(16).toString("hex"),
      type: "provide-assignment",
      message: `You have a new assignment provided by ${assignment.appointmentInfo.tutorInfo.fullName}.`,
      onClickPath: "/student/assignments",
      date: new Date(),
    });
    user.save();
    return res.status(200).send({
      success: true,
      message: "Assignment provided successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while providing assignment.",
    });
  }
};

module.exports.gradeAssignment = async (req, res) => {
  try {
    let { assignmentInfo, grade, feedback } = req.body;
    const gradedAssignment = await Assignment.findOne({
      _id: assignmentInfo._id,
      grade: { $exists: true },
    });
    if (gradedAssignment) {
      return res.status(200).send({
        success: false,
        message: "Assignment is already graded.",
      });
    }
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      assignmentInfo._id,
      {
        feedback,
        grade,
      }
    );
    const user = await User.findById(updatedAssignment.appointmentInfo.userId);
    user.unseenNotification.unshift({
      id: crypto.randomBytes(16).toString("hex"),
      type: "grade-assignment",
      message: `Assignment has been graded for ${updatedAssignment.title}`,
      onClickPath: "/student/assignments",
      date: new Date(),
    });
    user.save();
    res.status(200).send({
      success: true,
      message: "Assignment graded",
    });
    // const user
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in grading assignments",
    });
  }
};

