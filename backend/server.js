import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { handleSocketConnection } from "./controllers/socketController.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(
  cors({
    origin: [
      "http://localhost:5173", // for local dev
      "https://chatappbackend-4f4o.onrender.com", // for deployed app
    ],
    credentials: true,
  })
);

app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("🟢 ChatterUp API is running");
});

// Socket connection
io.on("connection", (socket) => {
  handleSocketConnection(io, socket);
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
