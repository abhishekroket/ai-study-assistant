import { useState } from "react";

function Sidebar({
  history = [],
  setQuestion,
  setAnswer,
  setSelectedChat,
  setSidebarOpen,
}) {

  const [search, setSearch] =
    useState("");

  // Filter Chats
  const filteredChats =
    history.filter((item) =>
      item.question
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // New Chat
  const newChat = () => {

    setQuestion("");

    setAnswer("");

    setSelectedChat(null);

    speechSynthesis.cancel();

    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (

    <div className="w-72 h-screen bg-slate-900 p-4 flex flex-col text-white">

      {/* Mobile Close Button */}
      <div className="flex justify-end md:hidden mb-4">

        <button
          onClick={() =>
            setSidebarOpen(false)
          }
          className="bg-red-600 px-3 py-2 rounded-lg"
        >
          ✕
        </button>

      </div>

      {/* New Chat */}
      <button
        onClick={newChat}
        className="w-full bg-blue-600 py-3 rounded-xl hover:bg-blue-700 mb-4"
      >
        + New Chat
      </button>

      {/* Search */}
      <input
        type="text"
        placeholder="Search chats..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        className="w-full p-3 rounded-xl bg-slate-800 outline-none mb-4"
      />

      {/* Title */}
      <h2 className="text-2xl font-bold mb-4">
        Chats
      </h2>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">

        {filteredChats.length === 0 ? (

          <p className="text-gray-400">
            No chats found
          </p>

        ) : (

          filteredChats.map(
            (item, index) => (

              <div
                key={index}

                onClick={() => {

                  setQuestion(
                    item.question
                  );

                  setAnswer(
                    item.answer
                  );

                  setSelectedChat(
                    item
                  );

                  speechSynthesis.cancel();

                  if (
                    setSidebarOpen
                  ) {
                    setSidebarOpen(
                      false
                    );
                  }
                }}

                className="bg-slate-800 p-3 rounded-xl mb-3 cursor-pointer hover:bg-slate-700 transition"
              >

                <p className="truncate font-semibold">
                  {item.question}
                </p>

              </div>
            )
          )
        )}

      </div>

    </div>
  );
}

export default Sidebar;