const { Router } = require("express");
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
1;
const authController = require("../controller/authController");
const tokenController = require("../controller/tokenController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Math.round(Math.random() * 1e9) + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};
const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 }, //3mb
  fileFilter: fileFilter,
});
const uploadFields = [
  { name: "profilePicUrl", maxCount: 1 },
  { name: "nIdFrontUrl", maxCount: 1 },
  { name: "nIdBackUrl", maxCount: 1 },
  { name: "teachingCertificateUrl", maxCount: 1 },
];

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
router.get("/:id/verify/:token", tokenController.verify_token);
router.post(
  "/saveFilePath",
  authMiddleware.authMiddleware,
  authMiddleware.isTutorOrStudent,
  upload.fields(uploadFields),
  userController.saveFilePath
);

module.exports = router;
