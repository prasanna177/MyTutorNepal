const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const Tutor = require("../models/tutorModel");
const moment = require("moment");

module.exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.body.appointmentId,
    });
    if (!appointment) {
      return res.status(200).send({
        success: false,
        message: "Appointment not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Single Appointment fetched",
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while fetching tutor by id.",
    });
  }
};

module.exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    res.status(200).send({
      success: true,
      message: "Appointments fetched",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching appointments",
      error,
    });
  }
};

module.exports.markAsPaid = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    await Appointment.findByIdAndUpdate(appointmentId, {
      paymentStatus: "Paid",
    });
    res.status(201).send({
      success: true,
      message: "Marked as paid",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while marking appointment as paid",
      error,
    });
  }
};

module.exports.getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Appointments fetched successfully.",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching user appointments",
    });
  }
};

module.exports.getUserOngoingAppointments = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    const currentDate = moment(
      moment().startOf("day").toDate(),
      "YYYY-MM-DD"
    ).toISOString();
    const appointments = await Appointment.find({
      userId: user._id,
      fromDate: { $lte: currentDate },
      toDate: { $gte: currentDate },
      status: "approved",
    });
    res.status(200).send({
      success: true,
      message: "User appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while fetching appointments.",
    });
  }
};

module.exports.getTutorAppointments = async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ userId: req.body.userId });
    const appointments = await Appointment.find({ tutorId: tutor._id });
    res.status(200).send({
      success: true,
      message: "Tutor appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while fetching appointments.",
    });
  }
};

module.exports.getTutorOngoingAppointments = async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ userId: req.body.userId });
    const currentDate = moment(
      moment().startOf("day").toDate(),
      "YYYY-MM-DD"
    ).toISOString();
    const appointments = await Appointment.find({
      tutorId: tutor._id,
      fromDate: { $lte: currentDate },
      toDate: { $gte: currentDate },
      status: "approved",
    });
    res.status(200).send({
      success: true,
      message: "Tutor appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while fetching appointments.",
    });
  }
};
