const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

router.post("/getTutorInfo", authMiddleware, getTutorInfo);

module.exports = router;
