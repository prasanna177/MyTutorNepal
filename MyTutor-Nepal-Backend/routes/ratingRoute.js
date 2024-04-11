const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const ratingController = require("../controller/ratingController");

const router = Router();

router.post(
  "/rate-tutor",
  authMiddleware.authMiddleware,
  authMiddleware.isStudent,
  ratingController.rateTutor
);
router.post(
  "/skip-tutor-rating",
  authMiddleware.authMiddleware,
  authMiddleware.isStudent,
  ratingController.skipRating
);

module.exports = router;
