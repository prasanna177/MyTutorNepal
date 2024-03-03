const User = require("../models/userModel");
const Token = require("../models/token");
const mongoose = require("mongoose");

module.exports.verify_token = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send({ message: "Invalid user ID" });
    }
    const user = await User.findOne({
      _id: req.params.id,
    });
    if (!user) {
      return res.status(400).send({ message: "Invalid link" });
    }
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(400).send({ message: "Invalid link" });
    }
    await User.findByIdAndUpdate(user._id, { verified: true });
    await token.deleteOne();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
    console.log(error);
  }
};
