import { useState, useRef, useEffect } from "react";
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

function TypingDots() {
  return (
    <div className="typing-dots">
      <span /><span /><span />
    </div>
  );
}

export default function ChatWidget() {
  const [input, setInput] = useState("");
  const { messages, loading, typing, error, isStarted, startChat, sendMessage } = useChat();
  const isBusy = loading || typing;
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  /* Auto-scroll to bottom on new messages */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, loading, typing]);

  /* iOS: scroll input into view when keyboard opens */
  const handleInputFocus = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isBusy) return;
    sendMessage(input.trim());
    setInput("");
    inputRef.current?.focus();
  };

  const handleQuickReply = (text) => {
    if (isBusy) return;
    sendMessage(text);
  };

  /* ── Welcome screen ── */
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

  /* ── Active chat ── */
  return (
    <div className="chat-widget chat-widget-active">
      <ChatHeader />

      <div className="chat-body">
        <div className="chat-messages">
          {messages.map((msg, index) => {
            // Hide the empty bubble while it's being typed into
            const isLast = index === messages.length - 1;
            if (msg.role === "assistant" && msg.content === "" && isLast) return null;

            return (
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
            );
          })}

          {/* Typing dots: show while fetching OR at very start of word animation */}
          {loading && (
            <div className="chat-message-row assistant">
              <BotAvatar />
              <div className="chat-bubble assistant typing">
                <TypingDots />
              </div>
            </div>
          )}

          {error && (
            <div className="chat-message-row assistant">
              <BotAvatar />
              <div className="chat-bubble error">{error}</div>
            </div>
          )}

          <div ref={scrollRef} className="scroll-anchor" />
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
            ref={inputRef}
            type="text"
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={handleInputFocus}
            placeholder="Write your message..."
          disabled={isBusy}
          autoComplete="off"
            autoCorrect="off"
            autoCapitalize="sentences"
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={isBusy || !input.trim()}
            aria-label="Send message"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
