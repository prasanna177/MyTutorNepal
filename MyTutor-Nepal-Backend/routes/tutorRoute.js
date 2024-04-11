const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const tutorController = require("../controller/tutorController");

const router = Router();

router.post(
  "/getTutorInfo",
  authMiddleware.authMiddleware,
  authMiddleware.isAdminOrTutor,
  tutorController.getTutorInfo
);

router.post(
  "/updateProfile",
  authMiddleware.authMiddleware,
  authMiddleware.isTutor,
  tutorController.updateProfile
);
router.post(
  "/getTutorById",
  authMiddleware.authMiddleware,
  authMiddleware.isAdminOrStudent,
  tutorController.getTutorById
);
router.post(
  "/deleteTutorById",
  authMiddleware.authMiddleware,
  authMiddleware.isAdmin,
  tutorController.deleteTutorById
);

router.post(
  "/acceptAppointment",
  authMiddleware.authMiddleware,
  authMiddleware.isTutor,
  tutorController.acceptAppointment
);

router.post(
  "/cancel-appointment",
  authMiddleware.authMiddleware,
  authMiddleware.isTutor,
  tutorController.cancelAppointment
);

module.exports = router;
