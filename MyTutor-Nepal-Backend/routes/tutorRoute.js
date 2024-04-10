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
router.get(
  "/getTutorAppointments",
  authMiddleware.authMiddleware,
  authMiddleware.isTutor,
  tutorController.getTutorAppointments
);

router.get(
  "/getTutorOngoingAppointments",
  authMiddleware.authMiddleware,
  authMiddleware.isTutor,
  tutorController.getTutorOngoingAppointments
);

router.post(
  "/acceptAppointment",
  authMiddleware.authMiddleware,
  authMiddleware.isTutor,
  tutorController.acceptAppointment
);
router.post(
  "/createAssignment",
  authMiddleware.authMiddleware,
  authMiddleware.isTutor,
  tutorController.createAssignment
);
router.post(
  "/get-assignments-for-appointment",
  authMiddleware.authMiddleware,
  authMiddleware.isTutor,
  tutorController.getAssignmentsForAppointment
);
router.post(
  "/grade-assignment",
  authMiddleware.authMiddleware,
  authMiddleware.isTutor,
  tutorController.gradeAssignment
);

module.exports = router;
