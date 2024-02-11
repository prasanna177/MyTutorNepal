const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getAllUsers, getAllDoctors } = require("../controller/adminController");

const router = Router();

router.get("/getAllUsers", authMiddleware, getAllUsers);

router.get("/getAllDoctors", authMiddleware, getAllDoctors);

module.exports = router;
