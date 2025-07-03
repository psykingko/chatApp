// src/context/SocketContext.jsx
import { createContext } from "react";
import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:5000", { autoConnect: false }); // Don't auto-connect
  }
  return socket;
};

export const SocketContext = createContext();
