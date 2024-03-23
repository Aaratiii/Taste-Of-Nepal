const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
router.get("/home", adminController.adminDashboard);

router.get("/", (_, res) => {
  res.redirect("/admin/dashboard");
});

router.get("/dashboard", adminController.adminDashboard);

router.post("/approve-recipe/:recipeId", adminController.approveRecipe);

router.post("/reject-recipe/:recipeId", adminController.rejectRecipe);

module.exports = router;
