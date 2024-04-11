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

router.get(
  "/getUserAppointments",
  authMiddleware.authMiddleware,
  authMiddleware.isStudent,
  appointmentController.getUserAppointments
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

router.get(
  "/get-user-ongoing-appointments",
  authMiddleware.authMiddleware,
  authMiddleware.isStudent,
  appointmentController.getUserOngoingAppointments
);

router.get(
  "/getTutorAppointments",
  authMiddleware.authMiddleware,
  authMiddleware.isTutor,
  appointmentController.getTutorAppointments
);

router.get(
  "/getTutorOngoingAppointments",
  authMiddleware.authMiddleware,
  authMiddleware.isTutor,
  appointmentController.getTutorOngoingAppointments
);

module.exports = router;
