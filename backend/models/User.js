import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  socketId: String,
  username: String,
  avatar: String,
  connectedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("User", UserSchema);
