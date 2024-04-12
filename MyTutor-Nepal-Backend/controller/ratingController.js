const User = require("../models/userModel");
const Tutor = require("../models/tutorModel");
const Rating = require("../models/ratingModel");
const crypto = require("crypto");
const query = require("../utils/getSentiment");

module.exports.rateTutor = async (req, res) => {
  try {
    const { userId, tutorId, rating, review, notificationId, appointmentId } =
      req.body;
    let sentiment = 0;
    if (review) {
      sentiment = await query(review); //get sentiment from review
    }

    //send failure message if rating exists for tutor by user for that specific appointment
    const existingRating = await Rating.findOne({
      userId,
      tutorId,
      appointmentId,
    });
    if (existingRating) {
      return res.status(200).send({
        success: false,
        message: "Rating already provided for this tutor for this appointment",
      });
    }
    const user = await User.findById(userId);
    const userName = user.fullName;
    const tutorRating = new Rating({
      userName,
      userId,
      tutorId,
      appointmentId,
      rating,
      review,
      sentiment,
    });
    await tutorRating.save();
    const tutor = await Tutor.findById(tutorId);

    //calculate average rating
    const allRatings = await Rating.find({ tutorId });
    console.log(allRatings);
    const totalRatings = allRatings.length;
    const averageRating = Math.round(
      allRatings.reduce((acc, curr) => {
        return acc + curr.rating;
      }, 0) / totalRatings
    );

    //calculate average sentiment
    const totalSentiment = allRatings.reduce((acc, curr) => {
      if (curr.sentiment !== 2) {
        return acc + curr.sentiment;
      } else {
        return acc; // Return accumulator if sentiment is 2
      }
    }, 0);
    console.log(totalSentiment, "tot");
    let averageSentiment;
    if (totalSentiment > 0) {
      averageSentiment = "positive";
    } else if (totalSentiment < 0) {
      averageSentiment = "negative";
    } else if (totalSentiment === 0) {
      averageSentiment = "neutral";
    }
    //update to tutor database
    await Tutor.findByIdAndUpdate(tutorId, { averageSentiment, averageRating });
    // send notification to tutor
    const tutorUser = await User.findById(tutor.userId);
    tutorUser.unseenNotification.unshift({
      id: crypto.randomBytes(16).toString("hex"),
      type: "Rating-received",
      message: "A new rating was provided.",
      onClickPath: `/tutor/profile/${tutorUser._id}`,
      date: new Date(),
    });
    await tutorUser.save();

    //delete the notification from user
    const unseenIndex = user.unseenNotification.findIndex(
      (item) => item.id === notificationId
    );
    user.unseenNotification.splice(unseenIndex, 1);

    const seenIndex = user.seenNotification.findIndex(
      (item) => item.id === notificationId
    );
    user.seenNotification.splice(seenIndex, 1);
    await user.save();
    res.status(200).send({
      message: "Rating successfully provided",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error rating tutor", success: false, error });
  }
};

module.exports.skipRating = async (req, res) => {
  try {
    const { userId, notificationId } = req.body;
    const user = await User.findById(userId);
    const unseenIndex = user.unseenNotification.findIndex(
      (item) => item.id === notificationId
    );
    user.unseenNotification.splice(unseenIndex, 1);

    const seenIndex = user.seenNotification.findIndex(
      (item) => item.id === notificationId
    );
    user.seenNotification.splice(seenIndex, 1);
    await user.save();
    res.status(200).send({
      message: "Rating skipped",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Error skipping tutor rating", success: false, error });
  }
};
