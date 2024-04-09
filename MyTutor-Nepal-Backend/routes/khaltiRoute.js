const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const khaltiController = require("../controller/khaltiController");

const router = Router();

router.post(
  "/khalti-api",
  authMiddleware.authMiddleware,
  authMiddleware.isStudent,
  khaltiController.khaltiRequest
);

module.exports = router;
