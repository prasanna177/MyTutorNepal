const { Router } = require("express");
const authController = require("../controller/authController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = Router();

router.post("/signup", authController.signup_post);
router.post("/login", authController.login_post);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:id/:token", authController.resetPassword);
router.post(
  "/change-password",
  // authMiddleware.authMiddleware,
  // authMiddleware.isTutorOrStudent,
  authController.changePassword
);

module.exports = router;
