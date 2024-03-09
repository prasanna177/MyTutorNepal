const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

module.exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({ _id: req.body.appointmentId });
    if (!appointment) {
      return res.status(200).send({
        success: false,
        message: "Appointment not found"
      })
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

module.exports.deleteAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({ _id: req.body.appointmentId });

    if (!appointment) {
      return res.status(200).send({
        success: false,
        message: "Appointment not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Appointment rejected",
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting appointment by id.",
    });
  }
}