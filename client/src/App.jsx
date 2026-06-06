import { useEffect, useState } from "react";
import ChatWidget from "./components/ChatWidget";
import { chatbotConfig } from "./config/chatbotConfig";

function applyColors(settings) {
  const root = document.documentElement;
  if (settings.color_primary)     root.style.setProperty("--chat-primary",    settings.color_primary);
  if (settings.color_bg)          root.style.setProperty("--chat-bg",          settings.color_bg);
  if (settings.color_user_bubble) root.style.setProperty("--chat-user-bubble", settings.color_user_bubble);
  if (settings.color_bot_bubble)  root.style.setProperty("--chat-bot-bubble",  settings.color_bot_bubble);
  if (settings.color_send_btn)    root.style.setProperty("--chat-send-btn",    settings.color_send_btn);
  if (settings.color_header_bg)   root.style.setProperty("--chat-header-bg",   settings.color_header_bg);
}

export default function App() {
  const [ready,         setReady]         = useState(false);
  const [widgetEnabled, setWidgetEnabled] = useState(true);
  const [widgetIcon,    setWidgetIcon]    = useState("bubble");

  useEffect(() => {
    fetch(`${chatbotConfig.baseUrl}/api/settings`)
      .then((r) => r.json())
      .then(({ settings }) => {
        if (settings) {
          applyColors(settings);
          setWidgetEnabled(settings.widget_enabled !== false);
          setWidgetIcon(settings.widget_icon || "bubble");
        }
      })
      .catch(() => {}) // use defaults on failure
      .finally(() => setReady(true));
  }, []);

  if (!ready)          return null; // wait for settings before first paint
  if (!widgetEnabled)  return null; // admin turned off widget

  return (
    <main className="app">
      <ChatWidget widgetIcon={widgetIcon} />
    </main>
  );
}
