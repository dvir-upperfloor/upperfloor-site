import { useEffect, useRef, useState } from "react";
import './components/Chatbot.css';
import ChatbotIcon from "./components/ChatbotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { companyInfo } from "./companyInfo";


const Chatbot = () => {
  const chatBodyRef = useRef();
  const OPENAI_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  
  // FIXED: Ensure chatbot NEVER auto-opens - force it to false always
  const [showChatbot, setShowChatbot] = useState(false);
  
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "model",
      text: companyInfo,
    },
  ]);

  // FIXED: Multiple layers of protection against auto-opening
  useEffect(() => {
    // Force chatbot closed immediately and repeatedly
    setShowChatbot(false);
    
    // Add CSS override to force visibility hidden
    const chatbotContainer = document.querySelector('.container');
    if (chatbotContainer) {
      chatbotContainer.classList.remove('show-chatbot');
    }
    
    // Force close multiple times with different intervals
    const timeouts = [0, 50, 100, 200, 500, 1000].map(delay => 
      setTimeout(() => {
        setShowChatbot(false);
        const container = document.querySelector('.container');
        if (container) {
          container.classList.remove('show-chatbot');
        }
      }, delay)
    );
    
    return () => timeouts.forEach(clearTimeout);
  }, []);

  // FIXED: Override any state changes that might auto-open the chatbot
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Check if chatbot somehow got opened without user interaction
      const container = document.querySelector('.container');
      if (container && container.classList.contains('show-chatbot') && !showChatbot) {
        container.classList.remove('show-chatbot');
        setShowChatbot(false);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [showChatbot]);

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
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [chatHistory]);

  // FIXED: Explicit controlled toggle
  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Chatbot toggle clicked, current state:', showChatbot); // Debug log
    setShowChatbot(prev => !prev);
  };

  return (
    <>
      {/* FIXED: Add inline styles to force chatbot closed on mobile */}
      <style jsx>{`
        .container .chatbot-popup {
          display: ${showChatbot ? 'block' : 'none'} !important;
          visibility: ${showChatbot ? 'visible' : 'hidden'} !important;
          opacity: ${showChatbot ? '1' : '0'} !important;
        }
        
        @media (max-width: 768px) {
          .container .chatbot-popup {
            display: ${showChatbot ? 'block' : 'none'} !important;
            visibility: ${showChatbot ? 'visible' : 'hidden'} !important;
            opacity: ${showChatbot ? '1' : '0'} !important;
            transform: ${showChatbot ? 'translateY(0)' : 'translateY(100%)'} !important;
          }
        }
      `}</style>
      
      <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
        {/* FIXED: Controlled toggle button */}
        <button 
          onClick={handleToggle}
          id="chatbot-toggler"
          type="button"
          style={{ zIndex: 9999 }}
        >
          <span className="material-symbols-rounded">mode_comment</span>
          <span className="material-symbols-rounded">close</span>
        </button>

        <div className="chatbot-popup" style={{ 
          display: showChatbot ? 'block' : 'none',
          visibility: showChatbot ? 'visible' : 'hidden',
          opacity: showChatbot ? 1 : 0
        }}>
          {/* Chatbot Header */}
          <div className="chat-header">
            <div className="header-info">
              <ChatbotIcon />
              <h2 className="logo-text">Upperfloor AI Agent</h2>
            </div>
            <button 
              onClick={() => setShowChatbot(false)} 
              className="material-symbols-rounded"
              type="button"
            >
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
    </>
  );
};

export default Chatbot;