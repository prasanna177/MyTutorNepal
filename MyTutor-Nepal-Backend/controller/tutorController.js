const Tutor = require("../models/tutorModel");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const crypto = require("crypto");
const Rating = require("../models/ratingModel");

module.exports.getTutorInfo = async (req, res) => {
  try {
    //because tutorDocument is immutable we need to convert it into object
    const tutorDocument = await Tutor.findOne({ userId: req.body.userId });
    const tutor = tutorDocument.toObject();
    const tutorRatings = await Rating.find({ tutorId: tutor._id });
    tutor.ratings = tutorRatings;

    const tutorAppointments = await Appointment.find({ tutorId: tutor._id });
    const dueAmount = tutorAppointments.reduce((total, appointment) => {
      if (
        (appointment.status === "approved" ||
          appointment.status === "completed") &&
        (appointment.paymentStatus === "Pending" ||
          appointment.paymentStatus === "Processing")
      ) {
        total += appointment.totalPrice;
      }
      return total;
    }, 0);
    tutor.dueAmount = dueAmount;

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
    const { address, coordinates, userId, fullName, phone } = req.body;
    if (!address || !coordinates.lat || !coordinates.lng) {
      return res.status(200).send({
        success: false,
        message: "Please enter an address",
      });
    }
    const tutor = await Tutor.findOneAndUpdate({ userId }, req.body);
    await User.findByIdAndUpdate(userId, {
      fullName,
      phone,
      address,
      coordinates,
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
    //because tutorDocument is immutable we need to convert it into object
    const tutorDocument = await Tutor.findOne({ _id: req.body.tutorId });
    if (!tutorDocument) {
      return res.status(200).send({
        success: false,
        message: "Tutor not found",
      });
    }
    const tutor = tutorDocument.toObject();
    const tutorRatings = await Rating.find({ tutorId: tutor._id });
    tutor.ratings = tutorRatings;
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

module.exports.acceptAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId);

    const currentDate = new Date();
    const toDate = new Date(appointment.toDate);

    //accepting after to date
    if (currentDate > toDate) {
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
        message: "Your appointment has been accepted.",
        onClickPath: "/student/appointments",
        date: new Date(),
      });
      await user.save();
      if (appointments.paymentStatus === "Khalti") {
        return res.status(200).send({
          success: true,
          message:
            "Appointment accepted. The money will be sent to your Khalti account in 1-2 business days.",
        });
      }
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

module.exports.cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId);

    const cancelledAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: "cancelled",
      }
    );

    const user = await User.findById(cancelledAppointment.userId);
    const tutor = await Tutor.findById(appointment.tutorId);
    if (cancelledAppointment.paymentType === "Khalti") {
      user.unseenNotification.unshift({
        id: crypto.randomBytes(16).toString("hex"),
        type: "Appointment-Rejected",
        message: `Your appointment with ${tutor.fullName} has been rejected. Your paid amount will be refunded soon.`,
        onClickPath: "/student/appointments",
        date: new Date(),
      });
      await user.save();
    } else if (cancelledAppointment.paymentType === "Cash on delivery") {
      user.unseenNotification.unshift({
        id: crypto.randomBytes(16).toString("hex"),
        type: "Appointment-Rejected",
      message: `Your appointment with ${tutor.fullName} has been rejected.`,
        onClickPath: "/student/appointments",
        date: new Date(),
      });
      await user.save();
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
};

