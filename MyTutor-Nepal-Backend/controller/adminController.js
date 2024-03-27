const User = require("../models/userModel");
const Tutor = require("../models/tutorModel");
const crypto = require("crypto");

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      success: true,
      message: "Users data list",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching users",
      error,
    });
  }
};

module.exports.getAllTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find({});
    res.status(200).send({
      success: true,
      message: "Tutors data list",
      data: tutors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching tutors",
      error,
    });
  }
};

module.exports.changeAccountStatus = async (req, res) => {
  try {
    const { tutorId, status } = req.body;
    const tutor = await Tutor.findByIdAndUpdate(tutorId, { status });
    const user = await User.findOne({ _id: tutor.userId });
    const unseenNotification = user.unseenNotification;
    unseenNotification.push({
      id: crypto.randomBytes(16).toString("hex"),
      type: "tutor-account-request-accepted",
      message: `Your tutor account request has been ${status}`,
      date: new Date(),
    });
    user.role = status === "Approved" ? "tutor" : user.role;

    await user.save();
    res.status(201).send({
      success: true,
      message: "Account status updated",
      data: tutor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in account status",
      error,
    });
  }
};
