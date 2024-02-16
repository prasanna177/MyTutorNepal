const Tutor = require("../models/tutorModel");

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
