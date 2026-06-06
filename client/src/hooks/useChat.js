import { useState } from "react";
import { chatbotConfig } from "../config/chatbotConfig";
import { promoMessage } from "../data";

function getOrCreateSessionId() {
  try {
    let sid = localStorage.getItem("glow_session_id");
    if (!sid) {
      sid = typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem("glow_session_id", sid);
    }
    return sid;
  } catch {
    return Math.random().toString(36).slice(2);
  }
}

export function useChat() {
  const [messages,   setMessages]   = useState([]);
  const [isStarted,  setIsStarted]  = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState("");
  const [sessionId]                 = useState(getOrCreateSessionId);

  const startChat = () => {
    setMessages([{ role: "assistant", content: promoMessage }]);
    setIsStarted(true);
  };

  const sendMessage = async (content) => {
    if (!content.trim()) return;

    if (!isStarted) setIsStarted(true);

    const userMsg = { role: "user", content };
    setMessages((prev) => [
      ...(prev.length === 0 ? [{ role: "assistant", content: promoMessage }] : prev),
      userMsg,
    ]);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${chatbotConfig.baseUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message:    content,
          session_id: sessionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to get response");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having a quick moment — please try again in a second! 🙏",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, error, isStarted, startChat, sendMessage, sessionId };
}
