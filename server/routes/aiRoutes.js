const express = require("express");
const multer = require("multer");
const router = express.Router();
const aiController = require("../controllers/aiController");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/predict/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post("/predict", upload.single("image"), aiController.predict);
router.get("/", aiController.home);

module.exports = router;
