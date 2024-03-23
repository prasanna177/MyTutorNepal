const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const ratingController = require("../controller/ratingController");

const router = Router();


module.exports = router;
