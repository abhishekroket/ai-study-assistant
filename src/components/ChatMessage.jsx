function ChatMessage({
  role,
  content,
}) {

  const isUser =
    role === "user";

  return (

    <div
      className={`flex ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >

      <div
        className={`max-w-[75%] px-5 py-4 rounded-3xl ${
          isUser
            ? "bg-blue-600"
            : "bg-[#2f2f2f]"
        }`}
      >

        {content}

      </div>

    </div>
  );
}

export default ChatMessage;