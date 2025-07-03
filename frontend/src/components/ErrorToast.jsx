import { useEffect, useState } from "react";

export default function ErrorToast({ message }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-red-600 text-white rounded shadow-lg z-50 animate-slide-in">
      {message}
    </div>
  );
}
