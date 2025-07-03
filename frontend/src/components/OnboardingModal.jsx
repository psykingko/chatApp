import { useState } from "react";
import { motion } from "framer-motion";
import { getSocket } from "../context/SocketContext";
import { generateAvatarUrl } from "../utils/avatars";

export default function OnboardingModal({ setUser }) {
  const [name, setName] = useState("");

  const handleJoin = () => {
    if (!name.trim()) return;

    const socket = getSocket(); // controlled socket instance
    socket.connect(); // <== KEY LINE

    const avatar = generateAvatarUrl(name);
    const userData = { username: name.trim(), avatar };

    socket.emit("joinUser", userData);
    setUser(userData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-11/12 max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
          Enter your name to join chat
        </h2>
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full px-4 py-2 mb-4 rounded-lg border dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleJoin()}
        />
        <button
          onClick={handleJoin}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          Join Chat
        </button>
      </motion.div>
    </div>
  );
}
