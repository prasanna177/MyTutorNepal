const Tutor = require("../models/tutorModel");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");

module.exports.getTutorInfo = async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Tutor data fetched successfully",
      data: tutor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in fetching details",
    });
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const { subjects, address, coordinates } = req.body;
    const uniqueSubjects = new Set(subjects);
    if (uniqueSubjects.size !== subjects.length) {
      return res.status(200).send({
        success: false,
        message: "Subjects must be unique",
      });
    }
    if (!(address || coordinates.lat || coordinates.lng)) {
      return res.status(200).send({
        success: false,
        message: "Please enter an address",
      });
    }
    const tutor = await Tutor.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Profile updated",
      data: tutor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Tutor profile could not be updated.",
    });
  }
};

module.exports.getTutorById = async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ _id: req.body.tutorId });
    res.status(200).send({
      success: true,
      message: "Single tutor fetched",
      data: tutor,
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

module.exports.deleteTutorById = async (req, res) => {
  try {
    const tutor = await Tutor.findOneAndDelete({ _id: req.body.tutorId });

    if (!tutor) {
      return res.status(200).send({
        success: false,
        message: "Tutor not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Tutor rejected",
      data: tutor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting tutor by id.",
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

module.exports.updateStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointments = await Appointment.findByIdAndUpdate(appointmentId, {
      status,
    });
    const user = await User.findOne({ _id: appointments.userId });
    user.unseenNotification.push({
      type: "Status-Updated",
      message: `Your appointment has been ${status}`,
      onClickPath: "/tutor/appointments",
      date: new Date()
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment status updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating appointment status",
      error,
    });
  }
};
