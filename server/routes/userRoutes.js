// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const userController = require("../controllers/userController");

router.get("/register", auth.isLogout, userController.loadRegister);
router.post("/register", upload.single("image"), userController.insertUser);
router.get("/verify", userController.verifyMail);
router.get("/", auth.isLogout, userController.loginLoad);
router.get("/login", auth.isLogout, userController.loginLoad);

router.post("/login", userController.verifyLogin);
router.get("/contact", userController.renderContactUs);

router.get("/userDashboard", auth.isLogin, userController.loadUserDashboard);

//Forgetpassword..................

router.get("/forget",auth.isLogout,userController.forgetLoad);
router.post("/forget",userController.forgetVerify);

router.get("/forget-password",auth.isLogout,userController.forgetPasswordLoad);
router.post("/forget-password",userController.resetPassword);

router.get("/edit",auth.isLogin,userController.editLoad);
router.post("/edit",upload.single('image'),userController.updateProfile);

// Use "/user-dashboard" instead of "views/users/dashboard.ejs"
// router.get("/user-dashboard", auth.isLogout, userController.loadDashboard);

router.post("/main", auth.isLogout, (req, res) => {
  userController.loadHome(req, res);
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

module.exports = router;



