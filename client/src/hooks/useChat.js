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
  const [messages,  setMessages]  = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [sessionId]               = useState(getOrCreateSessionId);

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

    // Add empty assistant bubble that we'll stream into
    const assistantIdx = { current: -1 };
    setMessages((prev) => {
      assistantIdx.current = prev.length;
      return [...prev, { role: "assistant", content: "" }];
    });

    try {
      const response = await fetch(`${chatbotConfig.baseUrl}/api/chat`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ message: content, session_id: sessionId }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server error ${response.status}`);
      }

      const reader  = response.body.getReader();
      const decoder = new TextDecoder();
      let   buffer  = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop(); // keep incomplete line

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;

          let parsed;
          try { parsed = JSON.parse(raw); } catch { continue; }

          if (parsed.token) {
            // Append token to the last assistant message
            setMessages((prev) => {
              const updated = [...prev];
              const last    = updated[updated.length - 1];
              if (last?.role === "assistant") {
                updated[updated.length - 1] = { ...last, content: last.content + parsed.token };
              }
              return updated;
            });
          }

          if (parsed.error) throw new Error(parsed.error);
          if (parsed.done)  break;
        }
      }
    } catch (err) {
      setError(err.message);
      // Replace the empty assistant bubble with an error message
      setMessages((prev) => {
        const updated = [...prev];
        const last    = updated[updated.length - 1];
        if (last?.role === "assistant" && last.content === "") {
          updated[updated.length - 1] = {
            role:    "assistant",
            content: "I'm having a quick moment — please try again in a second! 🙏",
          };
        }
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, error, isStarted, startChat, sendMessage, sessionId };
}
