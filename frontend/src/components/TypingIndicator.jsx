export default function TypingIndicator({ users = [] }) {
  if (users.length === 0) return null;

  const text =
    users.length === 1
      ? `${users[0]} is typing...`
      : `${users.slice(0, 2).join(", ")} ${
          users.length > 2 ? "and others are" : "are"
        } typing...`;

  return (
    <div className="text-sm italic text-gray-500 dark:text-gray-400 px-4 pb-2">
      {text}
    </div>
  );
}
