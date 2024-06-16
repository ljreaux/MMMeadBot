import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Recipe || mongoose.model("Recipe", recipeSchema);
