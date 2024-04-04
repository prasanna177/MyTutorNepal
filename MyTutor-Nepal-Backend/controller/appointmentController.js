const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const cron = require("node-cron");
const crypto = require("crypto");
const Tutor = require("../models/tutorModel");
const moment = require("moment");

// runs every 1 hour (as of now)
cron.schedule("0 0 */1 * * *", async () => {
  try {
    //make currentdate the same format as toDate
    const currentDate = moment(
      moment().startOf("day").toDate(),
      "YYYY-MM-DD"
    ).toISOString();
    //find appointments less than current date and status that is not completed
    const appointments = await Appointment.find({
      toDate: { $lt: currentDate },
      status: "approved",
    });
    console.log(appointments, "app");
    const toDate = appointments.toDate;
    console.log(toDate, "td");
    console.log(currentDate, "cd");
    console.log(currentDate > toDate);

    console.log(appointments);
    for (const appointment of appointments) {
      await Appointment.findByIdAndUpdate(appointment._id, {
        status: "completed",
      });
      const user = await User.findOne({ _id: appointment.userId });

      user.unseenNotification.unshift({
        id: crypto.randomBytes(16).toString("hex"),
        type: "Appointment-completion",
        message: `Your tutoring lessons with ${appointment.tutorInfo.fullName} is over. Click to provide rating.`,
        appointment: appointment,
        date: new Date(),
      });
      await user.save();
      console.log("completed");
    }
  } catch (error) {
    console.error("Error processing appointments:", error);
  }
});

module.exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.body.appointmentId,
    });
    if (!appointment) {
      return res.status(200).send({
        success: false,
        message: "Appointment not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Single Appointment fetched",
      data: appointment,
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

module.exports.deleteAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.body.appointmentId,
    });

    if (!appointment) {
      return res.status(200).send({
        success: false,
        message: "Appointment not found",
      });
    }
    const user = await User.findById(appointment.userId);
    const tutor = await Tutor.findById(appointment.tutorId);
    user.unseenNotification.unshift({
      id: crypto.randomBytes(16).toString("hex"),
      type: "Appointment-Rejected",
      message: `Your appointment with ${tutor.fullName} has been rejected.`,
      onClickPath: "/student/appointments",
      date: new Date(),
    });
    await user.save();

    res.status(200).send({
      success: true,
      message: "Appointment rejected",
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting appointment by id.",
    });
  }
};
