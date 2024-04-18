const cron = require("node-cron");
const moment = require("moment");
const crypto = require("crypto");
const Appointment = require("../models/appointmentModel");
const User = require("../models/userModel");
const Assignment = require("../models/assignmentModel");

function startCronJob() {
  //ending appointment after toDate has passed
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
      }
    } catch (error) {
      console.error("Error processing appointments:", error);
    }
  });

  //mark missed assignment as missed
  cron.schedule("0 */5 * * * *", async () => {
    try {
      const currentDate = moment().utc().format("YYYY-MM-DD HH:mm:ss");
      const missedAssignments = await Assignment.find({
        deadline: { $lt: currentDate },
        status: "Pending",
      });
      for (const assignment of missedAssignments) {
        await Assignment.findByIdAndUpdate(assignment._id, {
          status: "Missed",
        });
        const user = await User.findOne({
          _id: assignment.appointmentInfo.userId,
        });

        user.unseenNotification.unshift({
          id: crypto.randomBytes(16).toString("hex"),
          type: "assignment-missed",
          message: `Your assignemnt ${assignment.title} was missed`,
          date: new Date(),
        });
        await user.save();
      }
    } catch (error) {
      console.log(error);
    }
  });

  cron.schedule("0 0 */1 * * *", async () => {
    try {
      const users = await User.find({ verified: false });

      for (const user of users) {
        await User.findByIdAndDelete(user._id);
      }
    } catch (error) {
      console.error("Error deleting users:", error);
    }
  });
}

module.exports = { startCronJob };
