const { Router } = require("express");
const authController = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");
1;

const router = Router();

router.post("/signup", authController.signup_post);
router.post("/become-tutor", authController.becomeTutor_post);
router.post("/login", authController.login_post);
router.post("/getUserById", authMiddleware, authController.getUserById);

module.exports = router;
