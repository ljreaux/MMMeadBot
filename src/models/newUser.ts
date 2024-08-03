import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
  },
  joinedAt: {
    type: Date,
    required: true,
  },
});

export default mongoose.models.User ||
  mongoose.model("User", userSchema);
