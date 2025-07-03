export default function UserList({ users }) {
  return (
    <aside className="hidden md:flex flex-col w-56 bg-gray-100 dark:bg-gray-900 border-r dark:border-gray-800 px-4 py-2 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-white">
        Online Users
      </h2>
      {users.map((user, i) => (
        <div
          key={i}
          className="flex items-center gap-2 mb-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        >
          <img
            src={user.avatar}
            alt={user.username}
            className="w-8 h-8 rounded-full border dark:border-white"
          />
          <span className="text-sm text-gray-800 dark:text-white">
            {user.username}
          </span>
        </div>
      ))}
    </aside>
  );
}
