export default function Message({ msg, currentUser }) {
  const isOwn = msg.username === currentUser;

  return (
    <div
      className={`flex items-end ${isOwn ? "justify-end" : "justify-start"}`}
    >
      {!isOwn && (
        <img
          src={msg.avatar}
          className="w-8 h-8 rounded-full mr-2 border dark:border-white"
        />
      )}
      <div
        className={`max-w-xs md:max-w-md p-3 rounded-xl shadow text-sm ${
          isOwn
            ? "bg-teal-500 text-white rounded-br-none"
            : "bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded-bl-none"
        }`}
      >
        <div className="font-bold">{msg.username}</div>
        <div>{msg.message}</div>
        <div className="text-xs opacity-70 mt-1 text-right">
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
