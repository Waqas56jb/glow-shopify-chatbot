import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { quickReplies, welcomeScreen, storeInfo } from "../data";
import { useChat } from "../hooks/useChat";
import "./ChatWidget.css";

function ChatHeader() {
  return (
    <header className="chat-header">
      <div className="chat-header-left">
        <div className="chat-avatar chat-avatar-sm">
          <span className="chat-avatar-text">G</span>
          <span className="chat-status-dot" />
        </div>
        <div className="chat-header-info">
          <h1 className="chat-brand-name">{storeInfo.name}</h1>
          <p className="chat-brand-status">STYLIST · ONLINE</p>
        </div>
      </div>
      <span className="chat-confidential">PRIVATE</span>
    </header>
  );
}

function BotAvatar() {
  return (
    <div className="chat-avatar chat-avatar-xs">
      <span className="chat-avatar-text">G</span>
    </div>
  );
}

export default function ChatWidget() {
  const [input, setInput] = useState("");
  const { messages, loading, error, isStarted, startChat, sendMessage } = useChat();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleQuickReply = (text) => {
    if (loading) return;
    sendMessage(text);
  };

  if (!isStarted) {
    return (
      <div className="chat-widget chat-widget-welcome">
        <ChatHeader />

        <div className="welcome-body">
          <div className="welcome-emblem">
            <div className="welcome-emblem-ring" />
            <div className="welcome-emblem-circle">
              <span>G</span>
            </div>
          </div>

          <h2 className="welcome-title">{welcomeScreen.title}</h2>
          <p className="welcome-subtitle">{welcomeScreen.subtitle}</p>

          <button type="button" className="start-btn" onClick={startChat}>
            <span className="start-btn-icon">✦</span>
            {welcomeScreen.startButton}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-widget chat-widget-active">
      <ChatHeader />

      <div className="chat-body">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-message-row ${msg.role === "assistant" ? "assistant" : "user"}`}
            >
              {msg.role === "assistant" && <BotAvatar />}
              <div className={`chat-bubble ${msg.role}`}>
                {msg.role === "assistant" ? (
                  <div className="md">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message-row assistant">
              <BotAvatar />
              <div className="chat-bubble assistant typing">Typing...</div>
            </div>
          )}

          {error && (
            <div className="chat-message-row assistant">
              <BotAvatar />
              <div className="chat-bubble error">{error}</div>
            </div>
          )}
        </div>

        {messages.length === 1 && messages[0].role === "assistant" && (
          <div className="quick-replies">
            {quickReplies.map((reply) => (
              <button
                key={reply.text}
                type="button"
                className="quick-reply-btn"
                onClick={() => handleQuickReply(reply.text)}
                disabled={loading}
              >
                <span className="quick-reply-icon">{reply.icon}</span>
                {reply.text}
              </button>
            ))}
          </div>
        )}
      </div>

      <footer className="chat-footer">
        <form className="chat-input-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write your message..."
            disabled={loading}
          />
          <button type="submit" className="chat-send-btn" disabled={loading || !input.trim()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </form>
        <p className="chat-powered">
          Powered by {storeInfo.name} · AI Stylist available 24/7
        </p>
      </footer>
    </div>
  );
}
