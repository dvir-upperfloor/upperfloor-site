import { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

 const handleFormSubmit = async (e) => {
  e.preventDefault();

  const userText = inputRef.current.value.trim();
  if (!userText) return;
  inputRef.current.value = "";

  const userMessage = { role: "user", text: userText };

  // ✅ שלב 1: עדכון אחד בלבד
  setChatHistory((prev) => [...prev, userMessage, { role: "model", text: "חושב..." }]);

  // ✅ שלב 2: צור היסטוריה עדכנית ידנית
  const newHistory = [...chatHistory, userMessage];

  // ✅ שלב 3: שלח את ההודעה
  generateBotResponse(userMessage, newHistory);
};

  return (
    <form onSubmit={handleFormSubmit} className="chat-form">
      <input
        ref={inputRef}
        placeholder="Message..."
        className="message-input"
        required
      />
      <button type="submit" id="send-message" className="material-symbols-rounded">
        arrow_upward
      </button>
    </form>
  );
};

export default ChatForm;
