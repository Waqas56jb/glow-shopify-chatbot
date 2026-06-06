import { useState } from "react";
import { chatbotConfig } from "../config/chatbotConfig";
import { promoMessage } from "../data";

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startChat = () => {
    setMessages([{ role: "assistant", content: promoMessage }]);
    setIsStarted(true);
  };

  const sendMessage = async (content) => {
    const currentMessages = isStarted
      ? messages
      : [{ role: "assistant", content: promoMessage }];

    if (!isStarted) {
      setIsStarted(true);
    }

    const userMessage = { role: "user", content };
    const nextMessages = [...currentMessages, userMessage];

    setMessages(nextMessages);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(chatbotConfig.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setMessages([...nextMessages, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, error, isStarted, startChat, sendMessage };
}
