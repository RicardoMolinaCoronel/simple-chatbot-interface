import React from "react";
import styles from "./styles/ChatMessage.module.css";

function ChatMessage({ role, content }) {
  const isUser = role === "user";
  const isTyping = role === "assistant_typing";

  return (
    <div className={`${isUser ? styles.userContainer : styles.assistantContainer}`}>
      <div
        className={`
          ${isUser ? styles.userMessage : isTyping ? styles.typingMessage : styles.assistantMessage}
        `}
      >
        {content}
      </div>
    </div>
  );
}

export default ChatMessage;
