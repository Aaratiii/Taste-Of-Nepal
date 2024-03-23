const Category = require("../models/Category");
const Recipe = require("../models/Recipe");
const path = require("path");

/**
 * Get /
 * Homepagee
 */
exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({ approvalStatus: "approved" }).limit(
      limitNumber
    );
    const newari = await Recipe.find({
      category: "Newari",
      approvalStatus: "approved",
    }).limit(limitNumber);
    const nepalesetibetian = await Recipe.find({
      category: "Nepalese-Tibetian",
      approvalStatus: "approved",
    }).limit(limitNumber);
    const nepalese = await Recipe.find({
      category: "Nepalese",
      approvalStatus: "approved",
    }).limit(limitNumber);

    const food = { latest, newari, nepalesetibetian, nepalese };
    const isLoggedIn = req.session.user ? true : false;
    res.render("index", {
      title: "Nepali cusine - Home",
      categories,
      food,
      isLoggedIn,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * Get / categories
 * Categories
 */
exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);

    const isLoggedIn = req.session.user ? true : false;
    res.render("categories", {
      title: "Nepali cusine - categories",
      categories,
      isLoggedIn,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * Get / categories/:id
 * Categories  By Id
 */
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;

    const limitNumber = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );
    const isLoggedIn = req.session.user ? true : false;

    res.render("categories", {
      title: "Nepali cusine - categories",
      categoryById,
      isLoggedIn,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * Get / recipe/:id
 * recipe
 */
exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;

    const recipe = await Recipe.findById(recipeId);
    const isLoggedIn = req.session.user ? true : false;
    res.render("recipe", {
      title: "Nepali cusine - Recipe",
      recipe,
      isLoggedIn,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 *POST / search
 * Search
 */
exports.searchRecipe = async (req, res) => {
  //searchTerm
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    const isLoggedIn = req.session.user ? true : false;

    res.render("search", {
      title: "Nepali cusine - Search",
      recipe,
      isLoggedIn,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * Get / explore latest
 * explore Latest
 */
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 200;
    const recipe = await Recipe.find({
      approvalStatus: "approved",
    })
      .sort({ _id: -1 })
      .limit(limitNumber);
    const isLoggedIn = req.session.user ? true : false;
    res.render("explore-latest", {
      title: "Nepali cusine - Explore Latest",
      recipe,
      isLoggedIn,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-random
 * Explore Random as JSON
 */
exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    const isLoggedIn = req.session.user ? true : false;
    res.render("explore-random", {
      title: "Nepali cusine - Explore Latest",
      recipe,
      isLoggedIn,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /submit-recipe
 * Submit Recipe
 */
exports.submitRecipe = async (req, res) => {
  const infoErrorObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  const isLoggedIn = req.session.user ? true : false;
  res.render("submit-recipe", {
    title: "Nepali cusine - Submit Recipe",
    infoErrorObj,
    infoSubmitObj,
    isLoggedIn,
  });
};

/**
 * POST /submit-recipe
 * Submit Recipe
 */
exports.submitRecipeOnPost = async (req, res) => {
  try {
    if (!req.file) throw new Error("Please upload a image");

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: req.file.filename,
    });

    await newRecipe.save();

    req.flash("infoSubmit", "Recipe has been added.");
    res.redirect("/submit-recipe");
  } catch (error) {
    // res.json(error);
    console.log({ error });
    req.flash("infoErrors", error);
    res.redirect("/submit-recipe");
  }
};

/* To updateRecipe*/

// async function updateRecipe(){
//   try{

//     const res = await Recipe.updateOne({ name : 'Chiya'},{name : 'chiaaa'});
// res,n;
// res.nModified;

//   } catch(error){

//     console.log(error);

//   }
// }

// updateRecipe();

/*
To deleteRecipe
*/

// async function deleteRecipe() {
//   try {
//     await Recipe.deleteOne({ name: "Chiaaa" });
//   } catch (error) {
//     console.log(error);
//   }
// }

// deleteRecipe();

// async function insertDymmyCategoryData(){
//  try{
//     await Category.insertMany(
// {
//      "name": "Yomari",
//      "image" : "yomari.jpg"
// },
// {
//     "name": "Choila",
//     "image" : "choila.jpg"
// },
// {
//     "name": "lakhamari",
//     "image" : "lakhamari.jpg"
// },
// {
//     "name": "momo",
//     "image" : "momo.jpg"
// },
// {
//     "name": "thekuwa",
//     "image" : "thekuwa.jpg"
// },
//     );

//  } catch (error){
// console.log('err', + error)
//  }

// }

// insertDymmyCategoryData();

// async function insertDymmyRecipeData() {
//   try {
//     await Recipe.insertMany([
//       {
//         "name": "Lapphing",

//         "description": "Laphing is a popular Tibetan street food made from mung bean starch, typically served cold with a spicy and tangy sauce.",

//         "email": "aaratikharel@gmail.com",

//         "ingredients": [
//           " Mung bean starch or pea starch noodles",
//           "Water",
//           "Garlic",
//           "Ginger",
//           "Sichuan pepper (timur)",
//           "Red chili paste or chili oil",
//           "Soy sauce",
//           "Vinegar",
//           "Salt",
//           "Sugar",
//           "Sesame oil",
//           "Cilantro (coriander leaves) for garnish (optional)",
//         ],

//         "category": "Lapphing",

//         "image": "lapphing.jpg",
//       },

//       {
//         "name": "Keema Noodle",

//         "description":
//           "Keema noodles are a flavorful and spicy South Asian dish that combines minced meat (keema) with stir-fried noodles, often seasoned with various spices and herbs.",

//         "email": "aarushikhanal@gmail.com",

//         "ingredients": [
//           " Minced meat (keema) - often beef or lamb",
//           " Egg noodles or rice noodles",
//           "  Cooking oil ",
//           "Ginger",
//           " Onions",
//           "  Garlic",
//           "   Green chilies",
//           "   Tomatoes",
//           "     Spices (such as cumin, coriander, garam masala) ",
//           "  Turmeric powder",
//           "  Red chili powder ",
//           "Salt",
//           " Fresh cilantro (coriander leaves) for garnish",
//           "            Lemon juice (optional) ",
//           "            Peas or other vegetables (optional)",
//         ],

//         "category": "Keema Noodle",

//         "image": "keema noodle.jpg",
//       },

//       {
//         "name": "Chatpatey ",

//         "description":
//           "Chatpatey is a spicy and tangy Nepali street food snack made from a mixture of crunchy ingredients like puffed rice, fried lentil noodles, and various spices, often mixed with vegetables and served with a zesty tamarind sauce.",

//         "email": "aarushikhanal11@gmail.com",

//         "ingredients": [
//           " Puffed rice (Muri)",
//           "Fried lentil noodles (sev)",
//           "Roasted peanuts",
//           "Chopped onions",
//           "Chopped tomatoes ",
//           "Chopped cucumber ",
//           "Chopped green chilies",
//           "Chopped fresh cilantro (coriander leaves)",
//           "Tamarind chutney or tamarind pulp",
//           "Chaat masala",
//           "Red chili powder",
//           "Salt",
//           "Lemon juice",
//           "Mustard oil (optional)",
//         ],

//         "category": "Chatpatey",

//         "image": "Chatpate.jpg",
//       },

//       {
//         "name": "Dapao",

//         "description":
//           "Dapao is a type of dumpling popular in Nepal and Tibet, typically filled with a mixture of minced meat (such as buffalo, chicken, or pork) or vegetables, and served with a dipping sauce. ",

//         "email": "aarushikhl11@gmail.com",

//         "ingredients": [
//           "Ground meat such as chicken, buffalo, pork, or lamb or vegetables for the filling",
//           "All-purpose flour for the dough",
//           "Water",
//           "Onions",
//           "Garlic",
//           "Ginger",
//           "Water",
//           "Green chilies",
//           "Soy sauce",
//           "Sesame oil",
//           "Salt",
//           "Ground black pepper",
//           "Cilantro coriander leaves for garnish optional",
//           "Dipping sauce ingredients e.g., soy sauce, vinegar, chili sauce",
//         ],

//         "category": "Dapao",

//         "image": "Dapao.jpg",
//       },

//       {
//         "name": "Shya Phaley",

//         "description":
//           "Sha phaley is a popular Bhutanese street food, consisting of deep-fried bread stuffed with seasoned ground meat, vegetables, and spices.",

//         "email": "bin@gmail.com",

//         "ingredients": [
//           "All-purpose flour,Water",
//           "Ground meat (usually beef or pork)",
//           "Cilantro (coriander leaves)",
//           "Salt,Turmeric powder,Red chili powder",
//           "Oil for frying",
//         ],

//         "category": "Shya Phaley",

//         "image": "Sha phaley.jpg",
//       },
//     ]);
//   } catch (error) {
//     console.log("err", +error);
//   }
// }

// insertDymmyRecipeData();
