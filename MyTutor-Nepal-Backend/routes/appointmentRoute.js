const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const appointmentController = require("../controller/appointmentController");

const router = Router();

router.post(
  "/getAppointmentById",
  authMiddleware.authMiddleware,
  authMiddleware.isTutorOrStudent,
  appointmentController.getAppointmentById
);

router.post(
  "/cancel-appointment",
  authMiddleware.authMiddleware,
  authMiddleware.isTutor,
  appointmentController.cancelAppointment
);

module.exports = router;
