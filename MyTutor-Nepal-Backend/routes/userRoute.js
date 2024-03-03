const { Router } = require("express");
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
1;
const authController = require("../controller/authController");
const tokenController = require("../controller/tokenController");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const router = Router();

router.post("/signup", authController.signup_post);
router.post(
  "/become-tutor",
  authMiddleware, 
  userController.becomeTutor_post
);
router.post("/login", authController.login_post);
router.post("/getUserById", authMiddleware, userController.getUserById);
router.get("/getAllTutors", authMiddleware, userController.getAllTutors);
router.post("/book-tutor", authMiddleware, userController.bookTutor_post);
router.get(
  "/getAllAppointments",
  authMiddleware,
  userController.getAllAppointments
);
router.get("/:id/verify/:token", tokenController.verify_token);
router.post('/saveFilePath',upload.single("profilePic"),userController.saveFilePath)

module.exports = router;
