const moment = require("moment");
const Appointment = require("../models/appointmentModel");

module.exports.bookingValidation = async (req, res) => {
  const { fromDate, toDate, time, tutorInfo, userInfo } = req.body;
  const { phone, address } = userInfo;
  console.log(phone, "phone");
  console.log(address, "address");
  if (!phone || !address) {
    return res.status(200).send({
      success: false,
      message:
        "User must enter their phone number and address in edit profile before booking.",
      type: "no-phone-or-address",
    });
  }

  // if fromDate is before the current date
  const currentDate = moment().startOf("day");
  const isFromDateValid = moment(fromDate, "YYYY-MM-DD").isSameOrAfter(
    currentDate
  );

  if (!isFromDateValid) {
    return res.status(200).send({
      success: false,
      message: "Start date has already passed.",
    });
  }
  const tutorStartTime = moment(tutorInfo.timing.startTime, "HH:mm");
  const tutorEndTime = moment(tutorInfo.timing.endTime, "HH:mm");
  const bookingTime = moment(time, "HH:mm");

  //booking outside of tutor's timings
  if (
    bookingTime.isBefore(tutorStartTime) ||
    bookingTime.isAfter(tutorEndTime)
  ) {
    return res.status(200).send({
      success: false,
      message: "Cannot book outside of tutor's available hours",
    });
  }

  //if to date is before from date
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
};
