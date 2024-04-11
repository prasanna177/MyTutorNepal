const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const assignmentController = require("../controller/assignmentController");

const router = Router();

router.get(
  "/getUserAssignments",
  authMiddleware.authMiddleware,
  authMiddleware.isStudent,
  assignmentController.getUserAssignments
);
router.post(
  "/submit-assignment",
  authMiddleware.authMiddleware,
  authMiddleware.isStudent,
  assignmentController.submitAssignment
);

router.post(
  "/createAssignment",
  authMiddleware.authMiddleware,
  authMiddleware.isTutor,
  assignmentController.createAssignment
);
router.post(
  "/get-assignments-for-appointment",
  authMiddleware.authMiddleware,
  authMiddleware.isTutor,
  assignmentController.getAssignmentsForAppointment
);
router.post(
  "/grade-assignment",
  authMiddleware.authMiddleware,
  authMiddleware.isTutor,
  assignmentController.gradeAssignment
);

module.exports = router;
