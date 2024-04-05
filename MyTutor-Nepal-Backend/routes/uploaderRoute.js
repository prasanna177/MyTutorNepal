const multer = require("multer");
const path = require("path");
const { Router } = require("express");
const uploaderController = require("../controller/uploaderController");
const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Math.round(Math.random() * 1e9) + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/pdf/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Math.round(Math.random() * 1e9) + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};

const pdfFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF files are allowed."), false);
  }
};


const upload = multer({
  storage: storage,
  limits: { fileSize: 3 * 1024 * 1024 }, //3mb
  fileFilter: fileFilter,
});

const uploadPdf = multer({
  storage: pdfStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB file size limit for PDF files
  fileFilter: pdfFilter,
});

const uploadFields = [
  { name: "profilePicUrl", maxCount: 1 },
  { name: "nIdFrontUrl", maxCount: 1 },
  { name: "nIdBackUrl", maxCount: 1 },
  { name: "teachingCertificateUrl", maxCount: 1 },
];

router.post(
  "/saveFilePath",
  authMiddleware.authMiddleware,
  authMiddleware.isTutorOrStudent,
  upload.fields(uploadFields),
  uploaderController.saveFilePath
);

router.post(
  "/savePdfFilePath",
  authMiddleware.authMiddleware,
  authMiddleware.isStudent,
  uploadPdf.single("submittedFile"),
  uploaderController.savePdfFilePath
);

module.exports = router;
