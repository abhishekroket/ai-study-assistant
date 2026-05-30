function Sidebar({
  sidebarOpen,
  chatHistory,
  newChat,
}) {

  return (

    <div
      className={`${
        sidebarOpen
          ? "w-72"
          : "w-0"
      } transition-all duration-300 overflow-hidden bg-[#171717] border-r border-gray-800`}
    >

      <div className="p-4">

        {/* NEW CHAT */}
        <button
          onClick={newChat}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl mb-5 font-medium transition"
        >
        + New Chat
        </button>

        {/* HISTORY */}
        <h2 className="text-gray-400 text-sm mb-3">

          Recent Chats

        </h2>

        <div className="space-y-2">

          {chatHistory.map(
            (
              item,
              index
            ) => (

              <div
                key={index}
                className="bg-[#2a2a2a] p-3 rounded-xl text-sm truncate"
              >
                {item}
              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}

export default Sidebar;