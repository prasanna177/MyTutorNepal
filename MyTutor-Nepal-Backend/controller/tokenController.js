const User = require("../models/userModel");
const Token = require("../models/token");

module.exports.verify_token = async (req, res) => {
  try {
    console.log(req.params);
    const user = await User.findOne({
      _id: req.params.id,
    });
    console.log(user, "user");
    if (!user) {
      return res.status(200).send({ message: "Invalid link" });
    }
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    console.log(token, "token");
    if (!token) {
      return res.status(200).send({ message: "Invalid link" });
    }
    await User.findByIdAndUpdate(user._id, { verified: true });
    await token.deleteOne();

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
    console.log(error);
  }
};
