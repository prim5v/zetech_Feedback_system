import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquareIcon, SearchIcon, UsersIcon, BotIcon, SendIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/ApiSocket"; // ✅ Import your secured Axios instance
import { useAuth } from "../context/AuthContext"; // ✅ Import AuthContext

const ZETECH_LOGO = "/download.jpeg";

const HomePage = () => {
  const { loadingAuth } = useAuth(); // ✅ Get auth loading state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const newMessages = [...messages, { sender: "user", text: prompt }];
    setMessages(newMessages);
    setPrompt("");
    setLoading(true);

    try {
      const res = await api.post("/ask", { prompt });
      const data = res.data;
      const reply = data.response || "Sorry, I couldn’t understand that.";
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    } catch (err) {
      console.error("Chatbot API Error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error reaching the assistant. Try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Show global spinner while auth/profile is loading
  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto relative">
      {/* Hero Section */}
      <section className="text-center py-12 px-4">
        <img src={ZETECH_LOGO} alt="Zetech University" className="h-24 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-zetech-blue-dark mb-4">
          Zetech University Feedback Portal
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A platform for students to share issues and suggestions anonymously or with their identity.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/submit" className="btn-zetech">Submit an Issue</Link>
          <Link to="/track" className="btn-zetech-secondary">Track an Issue</Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-zetech-blue-dark">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="zetech-card p-6 text-center hover-scale">
            <div className="w-16 h-16 bg-zetech-blue-dark bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquareIcon size={30} className="text-zetech-blue-dark" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Submit</h3>
            <p className="text-gray-600">
              Submit your issue or suggestion with details and category. Choose to submit anonymously or with your information.
            </p>
          </div>

          <div className="zetech-card p-6 text-center hover-scale">
            <div className="w-16 h-16 bg-zetech-blue-dark bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <UsersIcon size={30} className="text-zetech-blue-dark" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Review</h3>
            <p className="text-gray-600">
              University administrators review your submission and work on addressing the issue or implementing suggestions.
            </p>
          </div>

          <div className="zetech-card p-6 text-center hover-scale">
            <div className="w-16 h-16 bg-zetech-blue-dark bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon size={30} className="text-zetech-blue-dark" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track</h3>
            <p className="text-gray-600">
              Track the status of your submission using your ticket ID or by logging in to see all your submissions.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4 bg-zetech-gray rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-zetech-blue-dark">Issue Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Academics", "Facilities", "Cafeteria", "Administration",
            "Library", "Technology", "Sports", "Others",
          ].map((category) => (
            <div key={category} className="zetech-card p-4 text-center hover-scale">
              <h3 className="font-medium text-gray-800">{category}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-zetech-blue-dark">
          Ready to make a difference at Zetech?
        </h2>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Your feedback helps us improve the university experience for everyone.
        </p>
        <Link to="/submit" className="btn-zetech inline-block">Submit an Issue or Suggestion</Link>
      </section>

      {/* 💬 Floating Chatbot */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-zetech-blue-dark text-white rounded-full p-4 shadow-lg hover:scale-105 transition"
        >
          <BotIcon size={28} />
        </button>
      </motion.div>

      {/* 🧠 Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 right-6 w-80 bg-white rounded-2xl shadow-xl border p-4 flex flex-col z-50"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-zetech-blue-dark">Zetech Assistant</h3>
              <button onClick={() => setIsChatOpen(false)}>✖</button>
            </div>
            <div className="flex-1 overflow-y-auto mb-3 space-y-2 max-h-64">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-zetech-blue-dark text-white self-end ml-8"
                      : "bg-gray-100 text-gray-800 mr-8"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && <p className="text-gray-400 text-sm">Typing...</p>}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask about the portal..."
                className="flex-1 border rounded-lg p-2 text-sm"
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="bg-zetech-blue-dark text-white p-2 rounded-lg hover:scale-105"
              >
                <SendIcon size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
