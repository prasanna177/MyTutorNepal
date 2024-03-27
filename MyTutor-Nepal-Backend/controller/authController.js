const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const User = require("../models/userModel");

module.exports.signup_post = async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save(); //save to database

    //verification email
    const token = await new Token({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url = `${process.env.CLIENT_PORT}/users/${newUser._id}/verify/${token.token}`;
    await sendEmail(
      newUser.email,
      "Verify email",
      `Click on this link to verify your registered email ${url}`
    );
    res.status(200).send({
      message:
        "An email has been sent to your account. Please verify to create user.",
      success: true,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Error creating user", success: false, err });
  }
};

module.exports.login_post = async (req, res) => {
  const maxAge = 6 * 24 * 60 * 60;
  try {
    let { email, password, isParent } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "Email does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      if (!user.verified) {
        let token = await Token.findOne({ userId: user._id });
        if (!token) {
          token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
          }).save();
          const url = `${process.env.CLIENT_PORT}/users/${user._id}/verify/${token.token}`;
          await sendEmail(
            user.email,
            "Verify email",
            `Click on this link to verify your registered email ${url}`
          );
        }
        return res.status(200).send({
          message:
            "An email has been sent to your account. Please verify first.",
          success: false,
        });
      }
      const token = jwt.sign(
        { id: user._id, isParent: isParent && user.hasParentPanel },
        process.env.JWT_SECRET,
        {
          expiresIn: maxAge,
        }
      );
      res
        .status(200)
        .send({ message: "Login successful", success: true, token });
    } else {
      return res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Error logging in", success: false, err });
  }
};

module.exports.forgotPassword = async (req, res) => {
  try {
    console.log(req.body, "reqbody");
    const { email } = req.body;
    console.log(email, "email");
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).send({
        message: "User does not exist",
        success: false,
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.RESET_SECRET, {
      expiresIn: "1d",
    });
    console.log(token, "token");
    const url = `${process.env.CLIENT_PORT}/reset-password/${user._id}/${token}`;
    await sendEmail(
      user.email,
      "Reset your password",
      `Click on this link to reset your password ${url}`
    );
    res.status(200).send({
      message: "An link has been sent to your email account. Please verify it.",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    jwt.verify(token, process.env.RESET_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.status(401).send({
          message: "Failed to reset password",
          success: false,
        });
      } else {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.findByIdAndUpdate({ _id: id }, { password: hashedPassword });
        res.status(200).send({
          message: "Password reset successfully",
          success: true,
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
