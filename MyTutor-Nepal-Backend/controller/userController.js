const User = require("../models/userModel");
const Tutor = require("../models/tutorModel");
const Appointment = require("../models/appointmentModel");
const Rating = require("../models/ratingModel");
const moment = require("moment");
const crypto = require("crypto");
const Booking = require("../models/bookingModel");
const { bookingValidation } = require("../utils/bookingValidation");

module.exports.mark_notifications_as_seen = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    if (!user.unseenNotification.length) {
      return res.status(200).send({
        success: false,
        message: "No notifications to read",
      });
    }
    const unseenNotification = user.unseenNotification;
    const seenNotification = user.seenNotification;
    seenNotification.push(...unseenNotification);
    user.unseenNotification = [];
    user.seenNotification = seenNotification;
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications marked as seen",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error applying doctor account",
      success: false,
      error,
    });
  }
};

module.exports.delete_all_notifications = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    if (!user.seenNotification.length) {
      return res.status(200).send({
        success: false,
        message: "There are no notifications to delete.",
      });
    }

    user.seenNotification = [];

    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "All notifications cleared",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error deleting notifications",
      success: false,
      error,
    });
  }
};

module.exports.becomeTutor_post = async (req, res) => {
  try {
    const { address, nIdFrontUrl, nIdBackUrl, coordinates, userId } = req.body;
    const existingTutor = await Tutor.find({ userId: userId });
    if (existingTutor.length > 0) {
      return res.status(200).send({
        success: false,
        message: "You have already applied for tutor.",
      });
    }

    if (!nIdFrontUrl || !nIdBackUrl) {
      return res.status(200).send({
        success: false,
        message: "Please provide the National ID pictures",
      });
    }
    if (!address || !coordinates.lat || !coordinates.lng) {
      return res.status(200).send({
        success: false,
        message: "Please enter an address",
      });
    }
    const tutorUser = await User.findById(userId);
    const newTutor = await Tutor({
      ...req.body,
      fullName: tutorUser.fullName,
      email: tutorUser.email,
      status: "Pending",
    });
    await newTutor.save();
    const adminUser = await User.findOne({ role: "admin" });
    const unseenNotification = adminUser.unseenNotification;
    unseenNotification.unshift({
      id: crypto.randomBytes(16).toString("hex"),
      type: "Apply tutor request",
      message: `${newTutor.fullName} has applied for tutor account.`,
      onClickPath: "/admin/tutors",
      date: new Date(),
    });
    await User.findByIdAndUpdate(adminUser._id, { unseenNotification });
    res.status(201).send({
      success: true,
      message: "Applied for tutor account successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while applying for tutor",
    });
  }
};

module.exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    if (user) {
      user.password = undefined;
      res.status(200).send({
        success: true,
        data: user,
      });
    } else {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, error });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.clientId });
    if (user) {
      user.password = undefined;
      res.status(200).send({
        success: true,
        data: user,
      });
    } else {
      return res
        .status(200)
        .send({ message: "User does not exist", success: false });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error getting user info", success: false, error });
  }
};

module.exports.getAllTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find({ status: "Approved" });

    const tutorsWithRatings = [];

    for (let i = 0; i < tutors.length; i++) {
      const tutor = tutors[i];
      const tutorRatings = await Rating.find({ tutorId: tutor._id });
      tutorsWithRatings.push({
        ...tutor.toObject(),
        ratings: tutorRatings,
      });
    }

    res.status(200).send({
      success: true,
      message: "Tutors fetched successfully.",
      data: tutorsWithRatings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error when fetching tutors.",
    });
  }
};

module.exports.updateProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findOneAndUpdate({ _id: userId }, req.body);
    res.status(201).send({
      success: true,
      message: "Profile updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "User profile could not be updated.",
    });
  }
};

module.exports.bookTutor_post = async (req, res) => {
  let paymentResponse;
  try {
    const validationStatus = await bookingValidation(req, res);
    if (!validationStatus.success) {
      paymentResponse = res.status(200).send(validationStatus);
    } else {
      const { fromDate, toDate, time, userInfo, tutorInfo, paymentType } =
        req.body;
      req.body.fromDate = moment(fromDate, "YYYY-MM-DD").toISOString();
      req.body.toDate = moment(toDate, "YYYY-MM-DD").toISOString();
      req.body.time = moment(time, "HH:mm").toISOString();
      req.body.status = "pending";
      req.body.paymentType = paymentType;

      const newAppointment = new Appointment(req.body);
      await newAppointment.save();

      const user = await User.findOne({ _id: tutorInfo.userId });
      user.unseenNotification.unshift({
        id: crypto.randomBytes(16).toString("hex"),
        type: "New-appointment-request",
        message: `A new appointment request has been sent by ${userInfo.fullName}`,
        onClickPath: "/tutor/appointments",
        date: new Date(),
      });
      await user.save();

      paymentResponse = res.status(200).send({
        success: true,
        message: "Appointment booked successfully",
      });
    }
  } catch (error) {
    console.log(error);
    paymentResponse = res.status(500).send({
      success: false,
      error,
      message: "Error booking a tutor",
    });
  }
};

module.exports.bookTutor_khalti_post = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const bookingDocument = await Booking.findById(bookingId);
    const booking = bookingDocument.toObject();
    const { fromDate, toDate, time, userInfo, tutorInfo, paymentType } =
      booking;

    booking.fromDate = moment(fromDate, "YYYY-MM-DD").toISOString();
    booking.toDate = moment(toDate, "YYYY-MM-DD").toISOString();
    booking.time = moment(time, "HH:mm").toISOString();
    booking.status = "pending";
    booking.paymentType = paymentType;
    booking.paymentStatus = "Processing";

    const newAppointment = new Appointment(booking);
    await newAppointment.save();

    const user = await User.findOne({ _id: tutorInfo.userId });
    user.unseenNotification.unshift({
      id: crypto.randomBytes(16).toString("hex"),
      type: "New-appointment-request",
      message: `A new appointment request has been sent by ${userInfo.fullName}`,
      onClickPath: "/tutor/appointments",
      date: new Date(),
    });
    await user.save();

    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error booking tutor.",
    });
  }
};
