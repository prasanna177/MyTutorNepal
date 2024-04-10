const User = require("../models/userModel");
const Tutor = require("../models/tutorModel");
const Appointment = require("../models/appointmentModel");
const Rating = require("../models/ratingModel");
const moment = require("moment");
const crypto = require("crypto");
const query = require("../utils/getSentiment");
const Assignment = require("../models/assignmentModel");
const axios = require("axios");
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
    console.log(req.body);
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
  try {
    bookingValidation(req, res);
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

    res.status(200).send({
      success: true,
      message: "Appointment booked successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
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

module.exports.getAllAppointments = async (req, res) => {
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

module.exports.rateTutor = async (req, res) => {
  try {
    const { userId, tutorId, rating, review, notificationId, appointmentId } =
      req.body;
    let sentiment = 0;
    if (review) {
      sentiment = await query(review); //get sentiment from review
    }
    console.log(sentiment);

    //send failure message if rating exists for tutor by user for that specific appointment
    const existingRating = await Rating.findOne({
      userId,
      tutorId,
      appointmentId,
    });
    if (existingRating) {
      return res.status(200).send({
        success: false,
        message: "Rating already provided for this tutor for this appointment",
      });
    }
    const user = await User.findById(userId);
    const userName = user.fullName;
    const tutorRating = new Rating({
      userName,
      userId,
      tutorId,
      appointmentId,
      rating,
      review,
      sentiment,
    });
    console.log(tutorRating);
    await tutorRating.save();
    const tutor = await Tutor.findById(tutorId);

    //calculate average rating
    const allRatings = await Rating.find({ tutorId });
    console.log(allRatings);
    const totalRatings = allRatings.length;
    const averageRating = Math.round(
      allRatings.reduce((acc, curr) => {
        return acc + curr.rating;
      }, 0) / totalRatings
    );
    console.log(averageRating, "avgRating");

    //calculate average sentiment
    const totalSentiment = allRatings.reduce((acc, curr) => {
      if (curr.sentiment !== 2) {
        return acc + curr.sentiment;
      }
    }, 0);
    let averageSentiment;
    if (totalSentiment > 0) {
      averageSentiment = "positive";
    } else if (totalSentiment < 0) {
      averageSentiment = "negative";
    } else if (totalSentiment === 0) {
      averageSentiment = "neutral";
    }
    console.log(averageSentiment, "avgRating");
    //update to tutor database
    await Tutor.findByIdAndUpdate(tutorId, { averageSentiment, averageRating });
    // send notification to tutor
    const tutorUser = await User.findById(tutor.userId);
    tutorUser.unseenNotification.unshift({
      id: crypto.randomBytes(16).toString("hex"),
      type: "Rating-received",
      message: "A new rating was provided.",
      onClickPath: `/tutor/profile/${tutorUser._id}`,
      date: new Date(),
    });
    await tutorUser.save();

    //delete the notification from user
    const unseenIndex = user.unseenNotification.findIndex(
      (item) => item.id === notificationId
    );
    user.unseenNotification.splice(unseenIndex, 1);

    const seenIndex = user.seenNotification.findIndex(
      (item) => item.id === notificationId
    );
    user.seenNotification.splice(seenIndex, 1);
    await user.save();
    res.status(200).send({
      message: "Rating successfully provided",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error rating tutor", success: false, error });
  }
};

module.exports.skipRating = async (req, res) => {
  try {
    const { userId, notificationId } = req.body;
    const user = await User.findById(userId);
    const unseenIndex = user.unseenNotification.findIndex(
      (item) => item.id === notificationId
    );
    user.unseenNotification.splice(unseenIndex, 1);

    const seenIndex = user.seenNotification.findIndex(
      (item) => item.id === notificationId
    );
    user.seenNotification.splice(seenIndex, 1);
    await user.save();
    res.status(200).send({
      message: "Rating skipped",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error skipping tutor rating", success: false, error });
  }
};

module.exports.getUserAssignments = async (req, res) => {
  try {
    console.log(req.body, "req");
    const assignments = await Assignment.find({
      studentId: req.body.userId,
    });
    console.log(assignments, "ass");
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
    console.log(existingAssignment, "exi");
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
