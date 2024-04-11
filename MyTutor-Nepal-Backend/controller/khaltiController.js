const Booking = require("../models/bookingModel");
const { bookingValidation } = require("../utils/bookingValidation");
const crypto = require("crypto");
const axios = require("axios");

module.exports.khaltiRequest = async (req, res) => {
  let paymentResponse;
  try {
    const validationStatus = await bookingValidation(req, res);
    if (!validationStatus.success) {
      paymentResponse = res.status(200).send(validationStatus);
    } else {
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
        `${process.env.KHALTI_INITIATE_API}`,
        payload,
        {
          headers: {
            Authorization: `Key ${process.env.KHALTI_LIVE_SECRET_KEY}`,
          },
        }
      );
      if (khaltiResponse) {
        paymentResponse = res.status(200).send({
          success: true,
          data: khaltiResponse.data,
        });
      } else {
        paymentResponse = res.status(200).send({
          success: false,
          message: "Error processing payment request",
        });
      }
    }
  } catch (error) {
    console.log(error);
    paymentResponse = res.status(200).send({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
  return paymentResponse;
};

module.exports.khaltiPaymentLookup = async (req, res) => {
  try {
    const { pidx } = req.body;
    const khaltiResponse = await axios.post(
      `${process.env.KHALTI_LOOKUP_API}`,
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
