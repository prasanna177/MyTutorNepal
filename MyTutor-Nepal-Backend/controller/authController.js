const User = require("../models/userModel");
const Tutor = require("../models/tutorModel");
const Appointment = require("../models/appointmentModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");

module.exports.signup_post = async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await User.findOne({ email });
    const tutor = await Tutor.findOne({ email });
    if (user || tutor) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save(); //save to database
    res
      .status(200)
      .send({ message: "User created successfully", success: true });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ message: "Error creating user", success: false, err });
  }
};

module.exports.becomeTutor_post = async (req, res) => {
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
    const newTutor = await Tutor({ ...req.body, status: "Pending" });
    await newTutor.save();
    const adminUser = await User.findOne({ role: "admin" });
    const notification = adminUser.notification;
    notification.push({
      type: "Apply tutor request",
      message: `${newTutor.fullName} has applied for tutor account.`,
      data: {
        tutorId: newTutor._id,
        name: newTutor.fullName,
        onClickPath: "/admin/tutors",
      },
    });
    await User.findByIdAndUpdate(adminUser._id, { notification });
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

module.exports.login_post = async (req, res) => {
  const maxAge = 6 * 24 * 60 * 60;
  try {
    let { email, password, isParent } = req.body;
    const user =
      (await User.findOne({ email })) || (await Tutor.findOne({ email }));
    if (!user) {
      return res
        .status(200)
        .send({ message: "Email does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      if (isParent && !user.hasParentPanel) {
        return res.status(200).send({
          message: "This account does not have a parent panel",
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

module.exports.getUserById = async (req, res) => {
  try {
    const user =
      (await User.findOne({ _id: req.body.userId })) ||
      (await Tutor.findOne({ _id: req.body.userId }));
    console.log(req.body);
    if (user) {
      user.password = undefined;
      const userData = user;
      if (req.body.isParent) {
        userData.role = "parent";
      } else {
        userData.role = user.role;
      }

      res.status(200).send({
        success: true,
        data: userData,
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
    res.status(200).send({
      success: true,
      message: "Tutors fetched successfully.",
      data: tutors,
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

module.exports.bookTutor_post = async (req, res) => {
  try {
    const { fromDate, toDate, time, tutorInfo, userInfo } = req.body;

    const fromDateISO = moment(fromDate, "YYYY-MM-DD").toISOString();
    const toDateISO = moment(toDate, "YYYY-MM-DD").toISOString();
    const timeISO = moment(time, "HH:mm").toISOString();
    const tutorId = tutorInfo._id; 

    const appointments = await Appointment.find({
      tutorId,
      $or: [
        {
          $and: [
            { time: { $gte: moment(timeISO).subtract(1, "hours").toISOString(), $lte: moment(timeISO).add(1, "hours").toISOString() } },
            { fromDate: { $lte: toDateISO } },
            { toDate: { $gte: fromDateISO } },
          ],
        },
        {
          $and: [
            { time: { $gte: moment(timeISO).subtract(1, "hours").toISOString(), $lte: moment(timeISO).add(1, "hours").toISOString() } },
            { fromDate: { $gte: toDateISO } },
            { toDate: { $lte: fromDateISO } },
          ],
        },
      ],
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not available at this time",
        success: false,
      });
    }

    const newAppointment = new Appointment({
      ...req.body,
      fromDate: fromDateISO,
      toDate: toDateISO,
      time: timeISO,
      status: "pending",
    });

    await newAppointment.save();

    const user = await User.findOne({ _id: tutorInfo.userId });
    user.notification.push({
      type: "New-appointment-request",
      message: `A new appointment request has been sent by ${userInfo.fullName}`,
      onClickPath: "/user/appointments",
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


// const bookingAvailabilityController = async (req, res) => {
//   try {
//     const fromDate = moment(req.body.fromDate, "YYYY-MM-DD").toISOString();
//     const toDate = moment(req.body.toDate, "YYYY-MM-DD").toISOString();
//     const fromTime = moment(req.body.time, "HH:mm")
//       .subtract(1, "hours")
//       .toISOString();
//     const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
//     const tutorId = req.body.tutorId;
//     const appointments = await Appointment.find({
//       tutorId,
//       $or: [
//         {
//           $and: [
//             { time: { $gte: fromTime, $lte: toTime } },
//             { fromDate: { $lte: toDate } },
//             { toDate: { $gte: fromDate } },
//           ],
//         },
//         {
//           $and: [
//             { time: { $gte: fromTime, $lte: toTime } },
//             { fromDate: { $gte: toDate } },
//             { toDate: { $lte: fromDate } },
//           ],
//         },
//       ],
//     });
//     if (appointments.length > 0) {
//       return res.status(200).send({
//         message: "Appointments not available at this time",
//         success: false,
//       });
//     } else {
//       return res.status(200).send({
//         message: "Appointment booked",
//         success: true,
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error in booking",
//     });
//   }
// };
