(function () {
  "use strict";

  /* ── Config ── */
  var CHAT_URL = "https://glow-shopify-chatbot.vercel.app";
  var WIDGET_ID = "glowup-chat-widget";
  var BTN_ID = "glowup-chat-btn";
  var BADGE_ID = "glowup-chat-badge";

  /* ── Prevent double load ── */
  if (document.getElementById(WIDGET_ID)) return;

  /* ── Styles ── */
  var style = document.createElement("style");
  style.textContent = [
    /* Floating button */
    "#" + BTN_ID + " {",
    "  position: fixed;",
    "  bottom: 24px;",
    "  right: 24px;",
    "  z-index: 999998;",
    "  width: 60px;",
    "  height: 60px;",
    "  border-radius: 50%;",
    "  background: #000;",
    "  border: 2px solid #d4af37;",
    "  box-shadow: 0 6px 28px rgba(0,0,0,0.38);",
    "  cursor: pointer;",
    "  display: flex;",
    "  align-items: center;",
    "  justify-content: center;",
    "  transition: transform 0.2s, box-shadow 0.2s;",
    "  outline: none;",
    "  -webkit-tap-highlight-color: transparent;",
    "}",
    "#" + BTN_ID + ":hover {",
    "  transform: scale(1.08);",
    "  box-shadow: 0 8px 32px rgba(0,0,0,0.45);",
    "}",
    "#" + BTN_ID + " svg { pointer-events: none; }",

    /* Unread badge */
    "#" + BADGE_ID + " {",
    "  position: absolute;",
    "  top: -4px;",
    "  right: -4px;",
    "  width: 18px;",
    "  height: 18px;",
    "  border-radius: 50%;",
    "  background: #d4af37;",
    "  color: #000;",
    "  font-size: 10px;",
    "  font-weight: 700;",
    "  display: flex;",
    "  align-items: center;",
    "  justify-content: center;",
    "  font-family: sans-serif;",
    "  border: 2px solid #fff;",
    "  pointer-events: none;",
    "}",

    /* iframe container */
    "#" + WIDGET_ID + " {",
    "  position: fixed;",
    "  bottom: 96px;",
    "  right: 24px;",
    "  z-index: 999999;",
    "  width: 400px;",
    "  height: 680px;",
    "  max-width: calc(100vw - 32px);",
    "  max-height: calc(100dvh - 110px);",
    "  border-radius: 24px;",
    "  overflow: hidden;",
    "  box-shadow: 0 20px 60px rgba(0,0,0,0.45);",
    "  border: 1px solid rgba(212,175,55,0.2);",
    "  background: #f5f1e8;",
    "  transform: scale(0.92) translateY(12px);",
    "  opacity: 0;",
    "  pointer-events: none;",
    "  transition: transform 0.25s cubic-bezier(.34,1.56,.64,1), opacity 0.2s ease;",
    "  transform-origin: bottom right;",
    "}",
    "#" + WIDGET_ID + ".open {",
    "  transform: scale(1) translateY(0);",
    "  opacity: 1;",
    "  pointer-events: all;",
    "}",

    /* iframe itself */
    "#" + WIDGET_ID + " iframe {",
    "  width: 100%;",
    "  height: 100%;",
    "  border: none;",
    "  display: block;",
    "}",

    /* Mobile: bottom-sheet style */
    "@media (max-width: 480px) {",
    "  #" + WIDGET_ID + " {",
    "    bottom: 0;",
    "    right: 0;",
    "    left: 0;",
    "    width: 100%;",
    "    max-width: 100%;",
    "    height: 90dvh;",
    "    max-height: 90dvh;",
    "    border-radius: 20px 20px 0 0;",
    "    transform-origin: bottom center;",
    "  }",
    "  #" + BTN_ID + " {",
    "    bottom: 20px;",
    "    right: 20px;",
    "  }",
    "}",
  ].join("\n");
  document.head.appendChild(style);

  /* ── Floating button ── */
  var btn = document.createElement("button");
  btn.id = BTN_ID;
  btn.setAttribute("aria-label", "Open GlowUp Goods chat");
  btn.setAttribute("title", "Chat with us");

  /* Chat icon SVG */
  var chatIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

  /* Close icon SVG */
  var closeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  btn.innerHTML = chatIcon;

  /* Badge */
  var badge = document.createElement("span");
  badge.id = BADGE_ID;
  badge.textContent = "1";
  btn.appendChild(badge);

  /* ── Widget iframe container ── */
  var container = document.createElement("div");
  container.id = WIDGET_ID;

  var iframe = document.createElement("iframe");
  iframe.src = CHAT_URL;
  iframe.setAttribute("title", "GlowUp Goods AI Stylist");
  iframe.setAttribute("allow", "microphone");
  iframe.setAttribute("loading", "lazy");

  container.appendChild(iframe);

  /* ── State ── */
  var isOpen = false;
  var iframeLoaded = false;

  /* ── Toggle ── */
  function openWidget() {
    isOpen = true;
    container.classList.add("open");
    btn.setAttribute("aria-expanded", "true");
    btn.innerHTML = closeIcon;

    /* Remove badge on first open */
    if (badge.parentNode) badge.parentNode.removeChild(badge);

    /* Load iframe on first open */
    if (!iframeLoaded) {
      iframeLoaded = true;
    }
  }

  function closeWidget() {
    isOpen = false;
    container.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = chatIcon;
  }

  btn.addEventListener("click", function () {
    if (isOpen) {
      closeWidget();
    } else {
      openWidget();
    }
  });

  /* Close on ESC */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) closeWidget();
  });

  /* ── Append to DOM ── */
  document.body.appendChild(container);
  document.body.appendChild(btn);

  /* ── Auto-open greeting after 3 seconds (optional) ── */
  /* Uncomment to auto-open:
  setTimeout(function () {
    if (!isOpen) openWidget();
  }, 3000);
  */

})();
