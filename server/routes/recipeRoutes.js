const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (_, _, cb) {
    cb(null, "./public/img/");
  },
  filename: function (_, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage,  });

/**
 * App routes
 */
router.get("/", recipeController.homepage);
router.get("/recipe/:id", recipeController.exploreRecipe);
router.get("/categories", recipeController.exploreCategories);
router.get("/categories/:id", recipeController.exploreCategoriesById);
router.post("/search", recipeController.searchRecipe);
router.get("/explore-latest", recipeController.exploreLatest);
router.get("/explore-random", recipeController.exploreRandom);
router.get("/submit-recipe", recipeController.submitRecipe);
router.post(
  "/submit-recipe",
  upload.single("image"),
  recipeController.submitRecipeOnPost
);

// router.get('/', (req, res)=>{
//     res.send("Hello hi");
// })

module.exports = router;
