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

// Simulate typing word-by-word after response arrives
function typeMessage(text, onChunk, onDone) {
  const words = text.split(" ");
  let i = 0;
  let built = "";

  function next() {
    if (i >= words.length) {
      onDone();
      return;
    }
    built += (i === 0 ? "" : " ") + words[i];
    i++;
    onChunk(built);
    // Speed: ~18ms per word (~55 words/sec) — fast but visible
    setTimeout(next, 18);
  }
  next();
}

export function useChat() {
  const [messages,  setMessages]  = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [typing,    setTyping]    = useState(false); // word-by-word animation
  const [error,     setError]     = useState("");
  const [sessionId]               = useState(getOrCreateSessionId);

  const startChat = () => {
    setMessages([{ role: "assistant", content: promoMessage }]);
    setIsStarted(true);
  };

  const sendMessage = async (content) => {
    if (!content.trim() || loading || typing) return;
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
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ message: content, session_id: sessionId }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Server error ${response.status}`);

      setLoading(false);
      setTyping(true);

      // Add empty assistant bubble to type into
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      // Animate word-by-word
      typeMessage(
        data.reply,
        (partial) => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: partial };
            return updated;
          });
        },
        () => {
          // Snap to full reply in case of any missed words
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: data.reply };
            return updated;
          });
          setTyping(false);
        }
      );

    } catch (err) {
      setLoading(false);
      setTyping(false);
      setError(err.message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having a quick moment — please try again in a second! 🙏" },
      ]);
    }
  };

  return {
    messages, loading, typing, error, isStarted, startChat, sendMessage, sessionId,
  };
}
