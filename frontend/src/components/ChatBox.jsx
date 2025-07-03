// src/components/ChatBox.jsx
import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import TypingIndicator from "./TypingIndicator";
import UserList from "./UserList";
import ThemeToggle from "./ThemeToggle";
import { getSocket } from "../context/SocketContext";
import Notification from "./Notification";
import ErrorToast from "./ErrorToast";
import { useNavigate } from "react-router-dom";

export default function ChatBox({ user }) {
  const navigate = useNavigate();
  const socket = getSocket(); // get existing socket
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [notif, setNotif] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("chatHistory", (msgs) => {
      setMessages(msgs);
      setInitialLoading(false);
      if (msgs.length < 50) setHasMore(false);
    });

    socket.on("newMessage", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("updateUserList", (userList) => setUsers(userList));

    socket.on("userTyping", (name) => {
      setTypingUsers((prev) => (prev.includes(name) ? prev : [...prev, name]));
    });

    socket.on("userStopTyping", (name) => {
      setTypingUsers((prev) => prev.filter((n) => n !== name));
    });

    socket.on("userJoined", ({ username }) => {
      console.log(`📥 userJoined received: ${username}, current user: ${user.username}`);
      // Only show notification if it's not the current user
      if (username !== user.username) {
        console.log(`✅ Showing join notification for: ${username}`);
        setNotif({ 
          message: `${username} joined the chat!`, 
          type: "join",
          id: Date.now() // Add unique ID to force re-render
        });
      } else {
        console.log(`❌ Skipping join notification for current user: ${username}`);
      }
    });

    socket.on("userLeft", (username) => {
      console.log(`📥 userLeft received: ${username}, current user: ${user.username}`);
      // Only show notification if it's not the current user
      if (username !== user.username) {
        console.log(`✅ Showing leave notification for: ${username}`);
        setNotif({ 
          message: `${username} left the chat.`, 
          type: "leave",
          id: Date.now() // Add unique ID to force re-render
        });
      } else {
        console.log(`❌ Skipping leave notification for current user: ${username}`);
      }
    });

    socket.on("connect", () => {
      setNotif({
        message: `Welcome, ${user.username}! Start chatting now.`,
        type: "join",
        id: Date.now() // Add unique ID to force re-render
      });
    });

    return () => {
      socket.off("chatHistory");
      socket.off("newMessage");
      socket.off("updateUserList");
      socket.off("userTyping");
      socket.off("userStopTyping");
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("connect");
    };
  }, [user.username]); // Add user.username as dependency

  useEffect(() => {
    if (!input) {
      socket.emit("stopTyping");
      return;
    }

    socket.emit("typing");
    const timeout = setTimeout(() => socket.emit("stopTyping"), 3000);
    return () => clearTimeout(timeout);
  }, [input]);

  const sendMessage = () => {
    if (!input.trim()) {
      setError("Cannot send empty message");
      return;
    }
    try {
      socket.emit("chatMessage", input);
      setInput("");
    } catch (err) {
      setError("Failed to send message");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleExit = () => {
    socket.disconnect();
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-screen">
      <div className="flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
          ChatterUp
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-green-600 dark:text-green-400 animate-pulse">
            🟢 {users.length} users online
          </span>
          <ThemeToggle />
          <button
            onClick={handleExit}
            className="text-sm text-red-600 dark:text-red-400 hover:underline ml-4"
          >
            Exit Chat
          </button>
        </div>
      </div>

      {notif && (
        <Notification 
          message={notif.message} 
          type={notif.type} 
          onClose={() => setNotif(null)} 
        />
      )}
      {error && <ErrorToast message={error} />}

      <div className="flex flex-1 overflow-hidden">
        <UserList users={users} />

        {hasMore && (
          <div className="flex justify-center">
            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setMessages((prev) => [
                    {
                      username: "OldUser",
                      avatar:
                        "https://api.dicebear.com/7.x/pixel-art/svg?seed=OldUser",
                      message: "This is an older message...",
                      timestamp: Date.now() - 100000,
                    },
                    ...prev,
                  ]);
                  setLoading(false);
                  setHasMore(false);
                }, 1000);
              }}
              className="text-sm text-teal-600 hover:underline my-2"
            >
              {loading ? (
                <span className="animate-spin border-2 border-t-2 border-teal-500 rounded-full w-5 h-5 inline-block"></span>
              ) : (
                "Load More"
              )}
            </button>
          </div>
        )}

        <div className="flex flex-col flex-1 px-4 py-2 overflow-y-auto space-y-2">
          {messages.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
              No messages yet! Start the conversation!
            </p>
          )}
          {initialLoading &&
            Array(6)
              .fill()
              .map((_, i) => (
                <div
                  key={i}
                  className="w-2/3 h-6 bg-gray-300 dark:bg-gray-700 rounded-md animate-pulse mb-2"
                ></div>
              ))}

          {messages.map((msg, idx) => (
            <Message key={idx} msg={msg} currentUser={user.username} />
          ))}
          <TypingIndicator users={typingUsers} />
          <div ref={messagesEndRef}></div>
        </div>
      </div>

      <div className="flex items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-700 border dark:border-gray-600 text-black dark:text-white focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-full transition transform hover:scale-105"
        >
          🚀
        </button>
      </div>
    </div>
  );
}