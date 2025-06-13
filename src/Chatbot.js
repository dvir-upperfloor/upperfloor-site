import { useEffect, useRef, useState } from "react";
import './components/Chatbot.css';
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./companyInfo";


const Chatbot = () => {
  const chatBodyRef = useRef();
  const OPENAI_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: companyInfo,
    },
  ]);

  const generateBotResponse = async (userMessage, fullHistory) => {
  const updateHistory = (text, isError = false) => {
    setChatHistory((prev) => [
      ...prev.filter((m) => m.text !== "חושב..."),
      { role: "model", text, isError },
    ]);
  };

  try {
    const messages = [
      { role: "system", content: companyInfo },
      ...fullHistory.map(({ role, text }) => ({
        role: role === "user" ? "user" : "assistant",
        content: text,
      })),
    ];

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "OpenAI API error");

    const reply = data.choices[0].message.content.trim();
    updateHistory(reply);
  } catch (err) {
    console.error("❌ generateBotResponse error:", err);
    updateHistory(err.message || "שגיאה לא ידועה", true);
  }
};






  useEffect(() => {
    // Auto-scroll whenever chat history updates
    chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>

      <div className="chatbot-popup">
        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Upperfloor AI Agent</h2>
          </div>
          <button onClick={() => setShowChatbot((prev) => !prev)} className="material-symbols-rounded">
            keyboard_arrow_down
          </button>
        </div>

        {/* Chatbot Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              איך אוכל לעזור לך?
            </p>
          </div>

          {/* Render the chat history dynamically */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Chatbot Footer */}
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
