const Booking = require("../models/bookingModel");
const { bookingValidation } = require("../utils/bookingValidation");
const crypto = require("crypto");
const axios = require("axios");

module.exports.khaltiRequest = async (req, res) => {
  try {
    bookingValidation(req, res);
    const booking = new Booking(req.body);
    booking.save();
    const bookingId = booking._id;

    const { userInfo, totalPrice } = req.body;
    const payload = {
      return_url: `${process.env.CLIENT_PORT}/payment-success/${bookingId}`,
      // return_url: `${process.env.CLIENT_PORT}/payment-success}`,
      website_url: `${process.env.CLIENT_PORT}`,
      amount: totalPrice * 100,
      purchase_order_id: crypto.randomBytes(16).toString("hex"),
      purchase_order_name: "Book tutor",
      customer_info: {
        name: userInfo.fullName,
        email: userInfo.email,
        phone: userInfo.phone,
      },
    };
    const khaltiResponse = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      payload,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_LIVE_SECRET_KEY}`,
        },
      }
    );
    console.log(khaltiResponse, "res");
    if (khaltiResponse) {
      res.status(200).send({
        success: true,
        data: khaltiResponse.data,
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Somethings went wrong",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(200).send({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

module.exports.khaltiPaymentLookup = async (req, res) => {
  try {
    const { pidx } = req.body;
    const khaltiResponse = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_LIVE_SECRET_KEY}`,
        },
      }
    );
    if (khaltiResponse.data.status === "Completed") {
      return res.status(200).send({
        success: true,
        data: khaltiResponse.data,
        message: "Payment successful. Booking request has been sent.",
      });
    } else {
      res.status(200).send({
        success: false,
        message: "Payment failed. Booking was not made.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(200).send({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};
