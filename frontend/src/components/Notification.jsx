import { useEffect, useState } from "react";

export default function Notification({ message, type = "info", onClose }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setShow(false);
      // Call onClose after animation completes
      setTimeout(() => onClose?.(), 200);
    }, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  if (!show) return null;

  return (
    <div
      className={`fixed top-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-md z-50 text-white animate-slide-in 
        ${type === "join" ? "bg-green-600" : type === "leave" ? "bg-red-600" : "bg-gray-800"}`}
    >
      {message}
    </div>
  );
}