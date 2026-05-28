import { useState, useEffect, useRef } from "react";

import Sidebar from "./components/Sidebar";

import ChatMessage from "./components/ChatMessage";

import FileUpload from "./components/FileUpload";

import { askGroqAI } from "./services/aiService";

function App() {

  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(true);

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [uploadedText, setUploadedText] =
    useState("");

  const chatEndRef = useRef(null);

  // LOAD CHAT HISTORY
  useEffect(() => {

    const savedChats =
      JSON.parse(
        localStorage.getItem(
          "chatHistory"
        )
      ) || [];

    setMessages(savedChats);

  }, []);

  // SAVE CHAT HISTORY
  useEffect(() => {

    localStorage.setItem(
      "chatHistory",
      JSON.stringify(messages)
    );

  }, [messages]);

  // AUTO SCROLL
  useEffect(() => {

    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  // ASK AI
  const askAI = async (
    customPrompt = question
  ) => {

    if (!customPrompt.trim()) return;

    const userMessage = {
      role: "user",
      content: customPrompt,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setQuestion("");

    setLoading(true);

    try {

      const result =
        await askGroqAI(customPrompt);

      const aiMessage = {
        role: "assistant",
        content: result,
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);

    } catch (error) {

      console.log(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong.",
        },
      ]);
    }

    setLoading(false);
  };

  // NEW CHAT
  const newChat = () => {

    setMessages([]);

    localStorage.removeItem(
      "chatHistory"
    );
  };

  // VOICE INPUT
  const startVoiceInput = () => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

      alert(
        "Voice recognition not supported"
      );

      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = (
      event
    ) => {

      const transcript =
        event.results[0][0]
          .transcript;

      setQuestion(transcript);
    };
  };

  return (

    <div
      className={
        darkMode
          ? "bg-[#212121] text-white"
          : "bg-white text-black"
      }
    >

      <div className="flex h-screen overflow-hidden">

        {/* SIDEBAR */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={
            setSidebarOpen
          }
          darkMode={darkMode}
          setDarkMode={
            setDarkMode
          }
          messages={messages}
          newChat={newChat}
        />

        {/* MAIN */}
        <div className="flex-1 flex flex-col">

          {/* TOP BAR */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">

            <button
              onClick={() =>
                setSidebarOpen(
                  !sidebarOpen
                )
              }
              className="text-2xl"
            >
              ☰
            </button>

            <h1 className="text-lg md:text-2xl font-bold">

              AI Study Assistant

            </h1>

            <button
              onClick={() =>
                setDarkMode(
                  !darkMode
                )
              }
              className="bg-[#2f2f2f] px-3 py-1 rounded-xl border border-gray-700"
            >
              {darkMode
                ? "☀"
                : "🌙"}
            </button>

          </div>

          {/* CHAT AREA */}
          <div className="flex-1 overflow-y-auto px-4 py-6">

            {messages.length === 0 && (

              <div className="h-full flex items-center justify-center text-center text-gray-400">

                <div>

                  <h2 className="text-4xl font-bold mb-4">

                    How can I help you?

                  </h2>

                  <p className="max-w-xl">

                    Ask questions,
                    upload notes,
                    summarize PDFs,
                    generate quizzes,
                    and more.

                  </p>

                </div>

              </div>

            )}

            {/* CHAT */}
            <div className="max-w-4xl mx-auto space-y-6">

              {messages.map(
                (
                  msg,
                  index
                ) => (

                  <ChatMessage
                    key={index}
                    role={msg.role}
                    content={
                      msg.content
                    }
                  />

                )
              )}

              {/* LOADING */}
              {loading && (

                <div className="flex justify-start">

                  <div className="bg-[#2f2f2f] px-5 py-4 rounded-3xl border border-gray-700">

                    AI is thinking...

                  </div>

                </div>

              )}

              <div ref={chatEndRef} />

            </div>

          </div>

          {/* CHATGPT STYLE INPUT */}
          <div className="p-4 bg-[#212121] border-t border-gray-800">

            <div className="max-w-4xl mx-auto">

              <div className="flex items-end gap-3 bg-[#2f2f2f] border border-gray-700 rounded-3xl px-4 py-3 shadow-xl">

                {/* FILE */}
                <FileUpload
                  setUploadedText={
                    setUploadedText
                  }
                />

                {/* INPUT */}
                <textarea
                  value={question}

                  onChange={(e) =>
                    setQuestion(
                      e.target.value
                    )
                  }

                  onKeyDown={(e) => {

                    if (
                      e.key ===
                        "Enter" &&
                      !e.shiftKey
                    ) {

                      e.preventDefault();

                      askAI(
                        uploadedText
                          ? `${question}

Uploaded Notes:
${uploadedText}`
                          : question
                      );
                    }
                  }}

                  placeholder="Ask anything..."

                  rows={1}

                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none resize-none max-h-40 py-2"
                />

                {/* MIC */}
                <button
                  onClick={
                    startVoiceInput
                  }
                  className="text-gray-400 hover:text-white text-xl transition"
                >
                  🎤
                </button>

                {/* SEND */}
                <button
                  onClick={() =>
                    askAI(
                      uploadedText
                        ? `${question}

Uploaded Notes:
${uploadedText}`
                        : question
                    )
                  }
                  className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center font-bold hover:scale-105 transition"
                >
                  ↑
                </button>

              </div>

              {/* FOOTER */}
              <p className="text-center text-xs text-gray-500 mt-2">

                AI Study Assistant can make mistakes. Verify important information.

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;