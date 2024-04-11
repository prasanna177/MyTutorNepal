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
  "/book-tutor-khalti",
  authMiddleware.authMiddleware,
  authMiddleware.isStudent,
  userController.bookTutor_khalti_post
);

router.get("/:id/verify/:token", tokenController.verify_token);

module.exports = router;
