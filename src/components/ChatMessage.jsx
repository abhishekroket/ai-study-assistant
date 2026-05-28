import { useState } from "react";

import ReactMarkdown from "react-markdown";

function ChatMessage({
  role,
  content,
}) {

  const isUser =
    role === "user";

  const [copied, setCopied] =
    useState(false);

  // COPY
  const copyText = async () => {

    await navigator.clipboard.writeText(
      content
    );

    setCopied(true);

    setTimeout(() => {

      setCopied(false);

    }, 2000);
  };

  return (

    <div
      className={`w-full flex mb-6 ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >

      <div
        className={`max-w-[90%] md:max-w-[75%] px-5 py-4 rounded-3xl shadow-lg break-words ${
          isUser
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-[#2f2f2f] text-white rounded-bl-md border border-gray-700"
        }`}
      >

        {/* MESSAGE */}
        <div className="prose prose-invert max-w-none text-sm md:text-base">

          <ReactMarkdown>
            {content}
          </ReactMarkdown>

        </div>

        {/* COPY BUTTON */}
        {!isUser && (

          <div className="flex justify-end mt-3">

            <button
              onClick={copyText}
              className="text-xs text-gray-400 hover:text-white transition"
            >
              {copied
                ? "Copied ✓"
                : "Copy"}
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default ChatMessage;