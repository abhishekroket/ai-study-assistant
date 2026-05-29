import { useState } from "react";

import Sidebar from "./components/Sidebar";
import ChatMessage from "./components/ChatMessage";
import FileUpload from "./components/FileUpload";

import { askGroqAI } from "./services/aiService";

import {
  FiMenu,
  FiMic,
  FiSend,
} from "react-icons/fi";

function App() {

  const [question, setQuestion] =
    useState("");

  const [messages, setMessages] =
    useState([]);

  const [chatHistory, setChatHistory] =
    useState([]);

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [uploadedFile, setUploadedFile] =
  useState(null);

  // ASK AI
  const askAI = async () => {

    if (!question.trim())
      return;

    const userMessage = {
      role: "user",
      content: question,
    };

    // SHOW USER MESSAGE
    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    // SAVE HISTORY
    setChatHistory((prev) => [

      question,

      ...prev,

    ]);

    const currentQuestion =
      question;

    setQuestion("");

    setLoading(true);

    try {

      const result =
        await askGroqAI(
          currentQuestion
        );

      const aiMessage = {
        role: "assistant",
        content: result,
      };

      // SHOW AI MESSAGE
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

  // ENTER KEY
  const handleKeyDown = (
    e
  ) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      askAI();
    }
  };

  // MIC
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

  // NEW CHAT
  const newChat = () => {

    // ONLY CLEAR SCREEN
    setMessages([]);

    setQuestion("");
  };

  return (

    <div className="flex h-screen bg-[#212121] text-white overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        chatHistory={chatHistory}
        newChat={newChat}
      />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <div className="flex items-center gap-4 p-4 border-b border-gray-700">

          <button
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
            className="text-2xl"
          >
            <FiMenu />
          </button>

          <h1 className="text-xl font-bold">

            AI Study Assistant

          </h1>

        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-6">

          <div className="max-w-4xl mx-auto space-y-6">

            {messages.length ===
              0 && (

              <div className="text-center text-gray-400 mt-32">

                <h2 className="text-4xl font-bold mb-4">

                  How can I help you?

                </h2>

                <p>

                  Ask anything using AI.

                </p>

              </div>

            )}

            {/* CHAT MESSAGES */}
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

              <div className="bg-[#2f2f2f] px-5 py-4 rounded-3xl w-fit">

                AI is thinking...

              </div>

            )}

          </div>

        </div>

        {/* INPUT */}
        <div className="p-4 border-t border-gray-700">

          <div className="max-w-4xl mx-auto">

            <div className="flex items-center gap-3 bg-[#2f2f2f] border border-gray-700 rounded-3xl px-4 py-3">

              {/* FILE */}
              <FileUpload
                setUploadedFile={setUploadedFile}
              />

              {/* INPUT */}
              <textarea
                value={question}

                onChange={(e) =>
                  setQuestion(
                    e.target.value
                  )
                }

                onKeyDown={
                  handleKeyDown
                }

                placeholder="Ask anything..."

                rows={1}

                className="flex-1 bg-transparent outline-none resize-none text-white placeholder-gray-400"
              />

              {/* MIC */}
              <button
                onClick={
                  startVoiceInput
                }
                className="text-xl text-gray-400 hover:text-white"
              >
                <FiMic />
              </button>

              {/* SEND */}
              <button
                onClick={askAI}
                className="bg-white text-black w-10 h-10 rounded-full flex items-center justify-center"
              >
                <FiSend />
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;