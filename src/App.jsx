import React, { useState } from "react";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import axios from "axios";

function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `I'm ZUBALSISTANT, an AI assistant developed by Ricardo Molina.
I'm here to help you with any product-related questions you may have.
Feel free to ask anything!`,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await axios.post(import.meta.env.VITE_API_URL+"/query", {
        user_id: "user_100",
        query: text,
      });

      const fullResponse = response.data.answer;
      simulateTyping(fullResponse);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ There was an error." },
      ]);
      setLoading(false);
    }
  };

  const simulateTyping = (text) => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last.role === "assistant_typing") {
            prev.pop();
          }
          return [...prev, { role: "assistant_typing", content: text.slice(0, index + 1) }];
        });
        index++;
      } else {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last.role === "assistant_typing") {
            prev.pop();
          }
          return [...prev, { role: "assistant", content: text }];
        });
        clearInterval(typingInterval);
        setLoading(false);
      }
    }, 25); // Velocidad de tipado (puedes ajustar)
  };

  return (
<div className="flex flex-col items-center justify-center min-h-screen p-4">
  <h1 className="text-3xl font-bold mb-6 text-center">Zubale AI Assistant</h1>

  <div className="flex flex-col w-full max-w-2xl h-[90vh] bg-white shadow-lg rounded-xl overflow-hidden">
    <div className="flex-1 overflow-y-auto p-6">
      {messages.map((msg, index) => (
        <ChatMessage key={index} role={msg.role} content={msg.content} />
      ))}
      {loading && (
        <div className="flex justify-start mb-2">
          <div className="animate-pulse p-3 bg-gray-300 rounded-xl max-w-xs text-gray-700 italic">
            Thinking...
          </div>
        </div>
      )}
    </div>
    <div className="border-t p-4">
      <ChatInput onSend={sendMessage} />
    </div>
  </div>
</div>
  );
}

export default App;
