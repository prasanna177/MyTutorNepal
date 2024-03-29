const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminController = require("../controller/adminController");

const router = Router();

router.get(
  "/getAllUsers",
  authMiddleware.authMiddleware,
  authMiddleware.isAdmin,
  adminController.getAllUsers
);

router.get(
  "/getAllTutors",
  authMiddleware.authMiddleware,
  authMiddleware.isAdmin,
  adminController.getAllTutors
);

router.post(
  "/changeAccountStatus",
  authMiddleware.authMiddleware,
  authMiddleware.isAdmin,
  adminController.changeAccountStatus
);

module.exports = router;
