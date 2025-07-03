// src/context/SocketContext.jsx
import { createContext } from "react";
import { io } from "socket.io-client";

let socket;

// Automatically choose backend URL based on environment
const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://chatappbackend-4f4o.onrender.com"; // ⬅️ Replace with your Render backend URL

export const getSocket = () => {
  if (!socket) {
    socket = io(BACKEND_URL, { autoConnect: false }); // Controlled connection
  }
  return socket;
};

export const SocketContext = createContext();
