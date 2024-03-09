const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminController = require("../controller/adminController")

const router = Router();

router.get("/getAllUsers", authMiddleware, adminController.getAllUsers);

router.get("/getAllTutors", authMiddleware, adminController.getAllTutors);

router.post("/changeAccountStatus", authMiddleware, adminController.changeAccountStatus);

module.exports = router;
