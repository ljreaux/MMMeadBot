import mongoose from "mongoose";

const ytVideoSchema = new mongoose.Schema({
  video_id: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
  },
});

export default mongoose.models.NewVideo ||
  mongoose.model("NewVideo", ytVideoSchema);
