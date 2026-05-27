import ReactMarkdown from "react-markdown";
import { useState } from "react";

function ChatMessage({ answer }) {

  const [copied, setCopied] =
    useState(false);

  const copyText = () => {

    navigator.clipboard.writeText(
      answer
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="bg-slate-800 p-5 rounded-2xl mt-6 whitespace-pre-wrap overflow-auto relative">

      {/* Copy Button */}
      <button
        onClick={copyText}
        className="absolute top-3 right-3 bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700"
      >
        {copied
          ? "Copied ✓"
          : "Copy"}
      </button>

      {/* AI Response */}
      <ReactMarkdown>
        {answer}
      </ReactMarkdown>

    </div>
  );
}

export default ChatMessage;