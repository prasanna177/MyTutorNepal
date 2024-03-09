const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const appointmentController = require("../controller/appointmentController");

const router = Router();

router.post(
  "/getAppointmentById",
  authMiddleware,
  appointmentController.getAppointmentById
);

module.exports = router;
