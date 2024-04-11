const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports.authMiddleware = (req, res, next) => {
  try {
    const token = req?.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        return res.status(401).send({
          message: "Auth failed",
          success: false,
        });
      } else {
        req.body.userId = decodedToken.id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "Auth failed",
      status: false,
    });
  }
};

//admin access
module.exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (user.role !== "admin") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error",
    });
  }
};

//student access
module.exports.isStudent = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (user.role !== "student") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error",
    });
  }
};

//tutor access
module.exports.isTutor = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (user.role !== "tutor") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error",
    });
  }
};

module.exports.isAdminOrStudent = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (user.role !== "admin" && user.role !== "student") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error",
    });
  }
};


module.exports.isTutorOrStudent = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (user.role !== "tutor" && user.role !== "student") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error",
    });
  }
};

module.exports.isAdminOrTutor = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (user.role !== "admin" && user.role !== "tutor") {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error",
    });
  }
};
