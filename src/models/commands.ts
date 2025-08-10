import mongoose from "mongoose";

const commandSchema = new mongoose.Schema({
  command: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
});

export default mongoose.models.Command ||
  mongoose.model("Command", commandSchema);
