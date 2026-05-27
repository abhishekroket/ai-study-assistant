import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import ChatMessage from "./components/ChatMessage";
import FileUpload from "./components/FileUpload";
import { askGroqAI } from "./services/aiService";

function App() {

  const [question, setQuestion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(true);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [selectedChat, setSelectedChat] =
    useState(null);

  const [uploadedText, setUploadedText] =
    useState("");

  const [history, setHistory] =
    useState([]);

  // Load Chats
  useEffect(() => {

    const savedChats =
      JSON.parse(
        localStorage.getItem("history")
      ) || [];

    setHistory(savedChats);

  }, []);

  // Save Chats
  useEffect(() => {

    localStorage.setItem(
      "history",
      JSON.stringify(history)
    );

  }, [history]);

  // Ask AI
  const askAI = async (
    customPrompt = question
  ) => {

    if (!customPrompt.trim()) return;

    setLoading(true);

    speechSynthesis.cancel();

    try {

      const result =
        await askGroqAI(customPrompt);

      setAnswer(result);

      const newChat = {
        question: customPrompt,
        answer: result,
      };

      setSelectedChat(newChat);

      setHistory((prev) => [
        newChat,
        ...prev,
      ]);

    } catch (error) {

      console.log(error);

      setAnswer(
        "Something went wrong. Please try again."
      );
    }

    setLoading(false);
  };

  // Voice Output
  const speakAnswer = () => {

    if (!answer) return;

    speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(answer);

    speech.lang = "en-US";

    speech.rate = 1;

    speechSynthesis.speak(speech);
  };

  // Stop Voice
  const stopVoice = () => {

    speechSynthesis.cancel();
  };

  return (

    <div
      className={
        darkMode
          ? "flex h-screen bg-black text-white"
          : "flex h-screen bg-gray-100 text-black"
      }
    >

      {/* SIDEBAR TOGGLE BUTTON */}
      <button
        onClick={() =>
          setSidebarOpen(
            !sidebarOpen
          )
        }
        className="fixed top-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-lg transition"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      {/* OVERLAY */}
      {sidebarOpen && (

        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
        />

      )}

      {/* SIDEBAR */}
      <div
        className={`fixed md:relative z-40 top-0 left-0 h-full transition-all duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        <Sidebar
          history={history}
          setQuestion={setQuestion}
          setAnswer={setAnswer}
          setSelectedChat={setSelectedChat}
          setSidebarOpen={setSidebarOpen}
        />

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto flex justify-center p-4 md:p-8">

        <div className="w-full max-w-5xl">

          {/* HEADER */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mt-16 md:mt-0">
            AI Study Assistant
          </h1>

          <p className="text-gray-400 mt-3 mb-8 text-lg">
            Learn faster using AI-powered
            summaries, coding help,
            document analysis, quizzes,
            and voice responses.
          </p>

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
                e.key === "Enter" &&
                !e.shiftKey
              ) {

                e.preventDefault();

                askAI();
              }
            }}

            placeholder="Ask anything..."

            className="w-full h-40 p-5 rounded-3xl bg-slate-900 border border-slate-700 outline-none shadow-xl resize-none"
          />

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-4 mt-5">

            <button
              onClick={() =>
                setDarkMode(
                  !darkMode
                )
              }
              className="bg-yellow-500 px-5 py-3 rounded-2xl font-semibold hover:scale-105 transition"
            >
              {darkMode
                ? "☀ Light"
                : "🌙 Dark"}
            </button>

            <button
              onClick={() =>
                askAI()
              }
              className="bg-blue-600 px-5 py-3 rounded-2xl font-semibold hover:scale-105 transition"
            >
              🤖 Ask AI
            </button>

            <button
              onClick={speakAnswer}
              className="bg-pink-600 px-5 py-3 rounded-2xl font-semibold hover:scale-105 transition"
            >
              🎤 Voice
            </button>

            <button
              onClick={stopVoice}
              className="bg-red-600 px-5 py-3 rounded-2xl font-semibold hover:scale-105 transition"
            >
              ⛔ Stop
            </button>

          </div>

          {/* FILE UPLOAD */}
          <div className="mt-8">

            <FileUpload
              setUploadedText={
                setUploadedText
              }
            />

          </div>

          {/* ASK PDF */}
          <button
            onClick={() =>
              askAI(
                `Explain this document:\n${uploadedText}`
              )
            }
            className="bg-orange-600 mt-5 px-5 py-3 rounded-2xl font-semibold hover:scale-105 transition"
          >
            📄 Ask PDF
          </button>

          {/* EMPTY STATE */}
          {!answer && !loading && (

            <div className="text-center mt-20 text-gray-500">

              <h2 className="text-2xl font-semibold mb-3">
                Start Learning with AI
              </h2>

              <p>
                Ask coding questions,
                upload notes, summarize
                documents, generate quizzes,
                and much more.
              </p>

            </div>

          )}

          {/* LOADING */}
          {loading && (

            <div className="mt-10 bg-slate-900 border border-slate-700 p-6 rounded-3xl animate-pulse">

              AI is thinking...

            </div>

          )}

          {/* ANSWER */}
          {!loading && answer && (

            <ChatMessage
              answer={answer}
            />

          )}

          {/* FOOTER */}
          <footer className="text-center text-gray-500 mt-14 pb-10 border-t border-slate-800 pt-6">

          <p className="text-sm">
          © 2026 AI Study Assistant.
          All rights reserved.
          </p>

          <p className="text-xs mt-2">
          Built with React, Tailwind CSS & Groq AI 🚀
          </p>

</footer>

        </div>

      </div>

    </div>
  );
}

export default App;