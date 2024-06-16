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
});

export default mongoose.models.Command ||
  mongoose.model("Command", commandSchema);
