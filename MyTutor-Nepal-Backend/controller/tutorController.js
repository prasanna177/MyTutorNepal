const Tutor = require("../models/tutorModel");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const crypto = require("crypto");
const Rating = require("../models/ratingModel");

module.exports.getTutorInfo = async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ userId: req.body.userId });
    const tutorRatings = await Rating.find({ tutor: tutor._id });
    const newTutor = { ...tutor, tutorRatings };
    console.log(newTutor, "nt");
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
    const { address, coordinates, userId, fullName } = req.body;
    if (!address || !coordinates.lat || !coordinates.lng) {
      return res.status(200).send({
        success: false,
        message: "Please enter an address",
      });
    }
    const tutor = await Tutor.findOneAndUpdate({ userId }, req.body);
    await User.findByIdAndUpdate(userId, {
      fullName,
    });
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
    if (!tutor) {
      return res.status(200).send({
        success: false,
        message: "Tutor not found",
      });
    }
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
    const tutorUser = await User.findById(tutor.userId);
    tutorUser.unseenNotification.unshift({
      id: crypto.randomBytes(16).toString("hex"),
      type: "Application-rejected",
      message: "Your tutor application has been rejected.",
      date: new Date(),
    });
    await tutorUser.save();
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

module.exports.acceptAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId);

    const currentDate = new Date();
    const toDate = new Date(appointment.toDate);
    const fromDate = new Date(appointment.fromDate);

    //accepting between from date and to date
    if (currentDate > fromDate && currentDate < toDate) {
      const daysLeft = Math.ceil(
        (toDate - currentDate) / (1000 * 60 * 60 * 24)
      );
      const updatedTotalPrice = daysLeft * appointment.feePerClass;

      const appointments = await Appointment.findByIdAndUpdate(appointmentId, {
        status: "approved",
        totalPrice: updatedTotalPrice,
      });
      const user = await User.findOne({ _id: appointments.userId });
      user.unseenNotification.unshift({
        id: crypto.randomBytes(16).toString("hex"),
        type: "Status-Updated",
        message: `Your appointment has been accepted. Total price is now ${appointments.totalPrice}`,
        onClickPath: "/student/appointments",
        date: new Date(),
      });
      await user.save();
      return res.status(200).send({
        success: true,
        message:
          "Appointment accepted. Total price has been updated due to late accept.",
      });
    }
    //accepting after to date
    else if (currentDate > toDate) {
      const appointments = await Appointment.findOneAndDelete({
        _id: appointmentId,
      });
      const user = await User.findOne({ _id: appointments.userId });
      user.unseenNotification.unshift({
        id: crypto.randomBytes(16).toString("hex"),
        type: "Status-Updated",
        message: "Your appointment has been removed due to late acceptance.",
        onClickPath: "/student/appointments",
        date: new Date(),
      });
      await user.save();
      return res.status(200).send({
        success: false,
        message: "Past to date. Appointment has been removed",
      });
    }
    //accepting before from date
    else {
      const appointments = await Appointment.findByIdAndUpdate(appointmentId, {
        status: "approved",
      });
      const user = await User.findOne({ _id: appointments.userId });
      user.unseenNotification.unshift({
        id: crypto.randomBytes(16).toString("hex"),
        type: "Status-Updated",
        message: "Your appointment has been accepted",
        onClickPath: "/student/appointments",
        date: new Date(),
      });
      await user.save();
      return res.status(200).send({
        success: true,
        message: "Appointment accepted",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating appointment status",
      error,
    });
  }
};
