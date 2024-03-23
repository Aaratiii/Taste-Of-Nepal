const mongoose = require("mongoose");
const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: "This field is required.",
  },

  description: {
    type: String,
    required: "This field is required.",
  },

  email: {
    type: String,
    required: "This field is required.",
  },

  ingredients: {
    type: Array,
    required: "This field is required.",
  },

  category: {
    type: String,
    enum: ["Newari", "Nepalese-Tibetian", "Nepalese"],
    required: "This field is required.",
  },

  image: {
    type: String,

    required: "This field is required.",
  },
  approvalStatus :{
type: String,
default: "pending",
  }
});

recipeSchema.index({ name: "text", description: "text" });
//wildCard index
// recipeSchema.index({"$**" : 'text'});

module.exports = mongoose.model("Recipe", recipeSchema);
