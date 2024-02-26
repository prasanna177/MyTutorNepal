const { Router } = require("express");
const userController = require("../controller/userController");
const authMiddleware = require("../middleware/authMiddleware");
1;

const router = Router();

router.post("/signup", userController.signup_post);
router.post("/become-tutor", authMiddleware, userController.becomeTutor_post);
router.post("/login", userController.login_post);
router.post("/getUserById", authMiddleware, userController.getUserById);
router.get("/getAllTutors", authMiddleware, userController.getAllTutors);
router.post("/book-tutor", authMiddleware, userController.bookTutor_post);
router.get("/getAllAppointments", authMiddleware, userController.getAllAppointments);

module.exports = router;
