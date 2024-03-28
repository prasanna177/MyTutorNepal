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

const router = Router();

router.post("/signup", authController.signup_post);
router.post("/become-tutor", authMiddleware, userController.becomeTutor_post);
router.post("/login", authController.login_post);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:id/:token", authController.resetPassword);
router.post(
  "/mark-notification-as-seen",
  authMiddleware,
  userController.mark_notifications_as_seen
);
router.post(
  "/delete-all-notifications",
  authMiddleware,
  userController.delete_all_notifications
);
router.post("/getCurrentUser", authMiddleware, userController.getCurrentUser);
router.post("/getUserById", authMiddleware, userController.getUserById);
router.get("/getAllTutors", authMiddleware, userController.getAllTutors);
router.post("/book-tutor", authMiddleware, userController.bookTutor_post);
router.post("/rate-tutor", authMiddleware, userController.rateTutor);
router.post("/skip-tutor-rating", authMiddleware, userController.skipRating);
router.get(
  "/getAllAppointments",
  authMiddleware,
  userController.getAllAppointments
);
router.get("/:id/verify/:token", tokenController.verify_token);
router.post(
  "/saveFilePath",
  upload.fields([
    {
      name: "profilePicUrl",
      maxCount: 1,
    },
    {
      name: "nIdFrontUrl",
      maxCount: 1,
    },
    {
      name: "nIdBackUrl",
      maxCount: 1,
    },
    {
      name: "teachingCertificateUrl",
      maxCount: 1,
    },
  ]),
  userController.saveFilePath
);

module.exports = router;
