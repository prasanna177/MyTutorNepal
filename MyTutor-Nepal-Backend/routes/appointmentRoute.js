const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const appointmentController = require("../controller/appointmentController");

const router = Router();

router.post(
  "/getAppointmentById",
  authMiddleware,
  appointmentController.getAppointmentById
);

router.post(
  '/deleteAppointmentById', authMiddleware, appointmentController.deleteAppointmentById
)

module.exports = router;
