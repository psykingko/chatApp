import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  username: String,
  avatar: String,
  message: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Message", MessageSchema);
