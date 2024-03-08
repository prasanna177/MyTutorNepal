const User = require("../models/userModel");
const Tutor = require("../models/tutorModel");
const Appointment = require("../models/appointmentModel");
const moment = require("moment");

module.exports.saveFilePath = async (req, res) => {
  try {
    const files = req.files;
    const fileDataArray = [];

    // Loop through each file type and extract fieldname and path
    Object.keys(files).forEach((fileType) => {
      const file = files[fileType][0]; // Assuming only one file per type

      const fileData = {
        fieldname: file.fieldname,
        path: file.path,
      };

      fileDataArray.push(fileData);
    });
    console.log(fileDataArray, "fda");
    res.status(200).json({
      message: "Successfully fetched file paths",
      data: fileDataArray,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching file paths",
      error: error.message,
    });
  }
};

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
  console.log(req.body, "body");
  try {
    if (req.body.nIdFrontUrl || req.body.nIdBackUrl) {
      return res.status(200).send({
        success: false,
        message: "Please provide the National ID pictures"
      })
    }
    const { address, coordinates } = req.body;
    if (!(address || coordinates.lat || coordinates.lng)) {
      return res.status(200).send({
        success: false,
        message: "Please enter an address",
      });
    }
    const newTutor = await Tutor({
      ...req.body,
      status: "Pending",
    });
    await newTutor.save();
    const adminUser = await User.findOne({ role: "admin" });
    const unseenNotification = adminUser.unseenNotification;
    unseenNotification.push({
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
    console.log(req.body);
    const { fromDate, toDate, time, tutorInfo, userInfo } = req.body;
    const tutorStartTime = moment(tutorInfo.timing.startTime, "HH:mm");
    const tutorEndTime = moment(tutorInfo.timing.endTime, "HH:mm");
    const bookingTime = moment(time, "HH:mm");

    if (
      bookingTime.isBefore(tutorStartTime) ||
      bookingTime.isAfter(tutorEndTime)
    ) {
      return res.status(200).send({
        success: false,
        message: "Cannot book outside of tutor's available hours",
      });
    }

    const isDateValid = moment(toDate, "YYYY-MM-DD").isSameOrAfter(
      moment(fromDate, "YYYY-MM-DD")
    );

    if (!isDateValid) {
      return res.status(200).send({
        success: false,
        message: "Invalid date range. Please enter valid dates",
      });
    }

    const fromTime = moment(time, "HH:mm").subtract(1, "hours").toISOString();
    const toTime = moment(time, "HH:mm").add(1, "hours").toISOString();
    const appointments = await Appointment.find({
      tutorId: tutorInfo._id,
      $or: [
        {
          $and: [
            { time: { $gte: fromTime, $lte: toTime } },
            { fromDate: { $lte: toDate } },
            { toDate: { $gte: fromDate } },
          ],
        },
        {
          $and: [
            { time: { $gte: fromTime, $lte: toTime } },
            { fromDate: { $gte: toDate } },
            { toDate: { $lte: fromDate } },
          ],
        },
      ],
    });

    if (appointments.length > 0) {
      return res.status(200).send({
        success: false,
        message: "Appointments not available at this time",
      });
    }

    req.body.fromDate = moment(fromDate, "YYYY-MM-DD").toISOString();
    req.body.toDate = moment(toDate, "YYYY-MM-DD").toISOString();
    req.body.time = moment(time, "HH:mm").toISOString();
    req.body.status = "pending";

    const newAppointment = new Appointment(req.body);
    await newAppointment.save();

    const user = await User.findOne({ _id: tutorInfo.userId });
    user.unseenNotification.push({
      type: "New-appointment-request",
      message: `A new appointment request has been sent by ${userInfo.fullName}`,
      onClickPath: "/user/appointments",
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

module.exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.body.userId });
    console.log(appointments);
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
