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

router.get(
  "/get-all-appointments",
  authMiddleware.authMiddleware,
  authMiddleware.isAdmin,
  appointmentController.getAllAppointments
);

router.post(
  "/mark-as-paid",
  authMiddleware.authMiddleware,
  authMiddleware.isAdminOrTutor,
  appointmentController.markAsPaid
);

module.exports = router;
