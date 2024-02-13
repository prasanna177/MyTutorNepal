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
