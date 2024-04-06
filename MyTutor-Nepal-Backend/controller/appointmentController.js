const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const crypto = require("crypto");
const Tutor = require("../models/tutorModel");

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

module.exports.deleteAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.body.appointmentId,
    });

    if (!appointment) {
      return res.status(200).send({
        success: false,
        message: "Appointment not found",
      });
    }
    const user = await User.findById(appointment.userId);
    const tutor = await Tutor.findById(appointment.tutorId);
    user.unseenNotification.unshift({
      id: crypto.randomBytes(16).toString("hex"),
      type: "Appointment-Rejected",
      message: `Your appointment with ${tutor.fullName} has been rejected.`,
      onClickPath: "/student/appointments",
      date: new Date(),
    });
    await user.save();

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
};
