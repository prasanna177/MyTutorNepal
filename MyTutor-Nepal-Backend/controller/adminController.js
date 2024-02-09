const User = require("../models/userModel");
const Tutor = require("../models/tutorModel");

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

module.exports.getAllDoctors = async (req, res) => {
  try {
    const tutors = await User.find({});
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
