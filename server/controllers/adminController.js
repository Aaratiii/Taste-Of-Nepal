const User = require("../models/User");
const Recipe = require("../models/Recipe");

const logout = async (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/login");
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};
const adminDashboard = async (req, res) => {
  try {
    const usersData = await User.find({ is_admin: 0 });
    const pendingRecipes = await Recipe.find({ approvalStatus: "pending" });
    const isLoggedIn = req.session.user ? true : false;
    if (!req.session.user?.is_admin) return res.redirect("/users/dashboard");
    return res.render("admin/dashboard", {
      users: usersData,
      recipes: pendingRecipes,
      isLoggedIn,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};
// const approveRecipe = async (req, res) => {
//   const { recipeId } = req.params;

//   try {
//     const recipe = await Recipe.findById(recipeId);
//     recipe.approvalStatus = "approved";
//     await recipe.save();

//     res.redirect("/views/explore-latest.ejs");

//   } catch (error) {
//     res.status(500).send({ message: error.message || "Error Occurred" });
//   }
// };

const approveRecipe = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findById(recipeId);

    // Check if the recipe is not already approved
    if (recipe.approvalStatus !== "approved") {
      // Set the approvalStatus to "approved"
      recipe.approvalStatus = "approved";

      // Save the updated recipe
      await recipe.save();
    }

    // Redirect back to the admin dashboard with a success message
    req.flash("success", "Recipe approved successfully.");
    res.redirect("/admin/dashboard");
  } catch (error) {
    // Redirect back to the admin dashboard with an error message
    req.flash("error", "An error occurred while approving the recipe.");
    res.redirect("/admin/dashboard");
  }
};

const rejectRecipe = async (req, res) => {
  const { recipeId } = req.params;

  try {
    const recipe = await Recipe.findById(recipeId);
    recipe.approvalStatus = "rejected";
    await recipe.save();

    // Redirect back to the recipe list or a specific page
    res.redirect("/admin/dashboard");
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occurred" });
  }
};

module.exports = {
  logout,
  adminDashboard,
  approveRecipe,
  rejectRecipe,
};
