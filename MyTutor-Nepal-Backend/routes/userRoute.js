const { Router } = require("express");
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
const tokenController = require("../controller/tokenController");

const router = Router();

router.post(
  "/become-tutor",
  authMiddleware.authMiddleware,
  authMiddleware.isStudent,
  userController.becomeTutor_post
);
router.post(
  "/mark-notification-as-seen",
  authMiddleware.authMiddleware,
  userController.mark_notifications_as_seen
);
router.post(
  "/delete-all-notifications",
  authMiddleware.authMiddleware,
  userController.delete_all_notifications
);
router.post(
  "/getCurrentUser",
  authMiddleware.authMiddleware,
  userController.getCurrentUser
);
router.post(
  "/getUserById",
  authMiddleware.authMiddleware,
  authMiddleware.isAdminOrStudent,
  userController.getUserById
);
router.get(
  "/getAllTutors",
  authMiddleware.authMiddleware,
  authMiddleware.isStudent,
  userController.getAllTutors
);
router.post(
  "/update-profile",
  authMiddleware.authMiddleware,
  authMiddleware.isStudent,
  userController.updateProfile
);
router.post(
  "/book-tutor",
  authMiddleware.authMiddleware,
  authMiddleware.isStudent,
  userController.bookTutor_post
);
router.post(
  "/rate-tutor",
  authMiddleware.authMiddleware,
  authMiddleware.isStudent,
  userController.rateTutor
);
router.post(
  "/skip-tutor-rating",
  authMiddleware.authMiddleware,
  authMiddleware.isStudent,
  userController.skipRating
);
router.get(
  "/getAllAppointments",
  authMiddleware.authMiddleware,
  authMiddleware.isStudent,
  userController.getAllAppointments
);
router.get(
  "/getUserAssignments",
  authMiddleware.authMiddleware,
  authMiddleware.isStudent,
  userController.getUserAssignments
);
router.get("/:id/verify/:token", tokenController.verify_token);
router.post(
  "/submit-assignment",
  authMiddleware.authMiddleware,
  authMiddleware.isStudent,
  userController.submitAssignment
);
router.get(
  "/get-user-ongoing-appointments",
  authMiddleware.authMiddleware,
  authMiddleware.isStudent,
  userController.getUserOngoingAppointments
);
router.post(
  "/khalti-api",
  // authMiddleware.authMiddleware,
  // authMiddleware.isStudent,
  userController.khaltiRequest
);

module.exports = router;
