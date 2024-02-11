const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getAllUsers, getAllTutors, changeAccountStatus } = require("../controller/adminController");

const router = Router();

router.get("/getAllUsers", authMiddleware, getAllUsers);

router.get("/getAllTutors", authMiddleware, getAllTutors);

router.post("/changeAccountStatus", authMiddleware, changeAccountStatus);

module.exports = router;
