import User from "../models/User.js";
import Message from "../models/Message.js";

const users = {};

export const handleSocketConnection = (io, socket) => {
  console.log(`⚡ Connected: ${socket.id}`);

  // JOIN EVENT
  socket.on("joinUser", async ({ username, avatar }) => {
    try {
      console.log(`👤 User joining: ${username} with socket ${socket.id}`);
      users[socket.id] = { username, avatar };

      await User.create({ socketId: socket.id, username, avatar });

      const messages = await Message.find().sort({ timestamp: 1 }).limit(50);
      socket.emit("chatHistory", messages);

      // Broadcast to all OTHER users that someone joined
      console.log(`📤 Broadcasting userJoined to ${Object.keys(users).length - 1} other users for: ${username}`);
      socket.broadcast.emit("userJoined", { username, avatar });

      // Update user list for everyone
      console.log(`📤 Updating user list for all users. Total users: ${Object.keys(users).length}`);
      io.emit("updateUserList", Object.values(users));
    } catch (error) {
      console.error("Error in joinUser:", error);
    }
  });

  // MESSAGE EVENT
  socket.on("chatMessage", async (text) => {
    try {
      const user = users[socket.id];
      if (!user) return;

      const newMsg = await Message.create({
        username: user.username,
        avatar: user.avatar,
        message: text,
      });

      io.emit("newMessage", newMsg);
    } catch (error) {
      console.error("Error in chatMessage:", error);
    }
  });

  // TYPING EVENTS
  socket.on("typing", () => {
    const user = users[socket.id];
    if (user) socket.broadcast.emit("userTyping", user.username);
  });

  socket.on("stopTyping", () => {
    const user = users[socket.id];
    if (user) socket.broadcast.emit("userStopTyping", user.username);
  });

  // DISCONNECT EVENT
  socket.on("disconnect", async () => {
    try {
      const user = users[socket.id];
      console.log(`🔌 Disconnect event triggered for socket: ${socket.id}`);

      if (user) {
        console.log(`👤 User leaving: ${user.username}`);
        
        // Remove user from users object
        delete users[socket.id];
        
        // Remove from database
        await User.deleteOne({ socketId: socket.id });

        console.log(`📤 Broadcasting userLeft to ${Object.keys(users).length} remaining users for: ${user.username}`);
        
        // Broadcast to all remaining users that someone left
        socket.broadcast.emit("userLeft", user.username);
        
        // Update user list for everyone
        console.log(`📤 Updating user list for all users. Remaining users: ${Object.keys(users).length}`);
        io.emit("updateUserList", Object.values(users));
      } else {
        console.log(`❌ No user found for socket: ${socket.id}`);
      }
    } catch (error) {
      console.error("Error in disconnect:", error);
    }
  });
};