import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  command: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
});

export default mongoose.models.video || mongoose.model("video", recipeSchema);
