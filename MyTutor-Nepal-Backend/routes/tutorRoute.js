const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const tutorController = require("../controller/tutorController");

const router = Router();

router.post("/getTutorInfo", authMiddleware, tutorController.getTutorInfo);
router.post("/updateProfile", authMiddleware, tutorController.updateProfile);

module.exports = router;
