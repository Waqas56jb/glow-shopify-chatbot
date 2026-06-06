(function () {
  "use strict";

  var API_URL   = "https://glow-shopify-chatbot-backend.vercel.app";
  var CHAT_URL  = "https://glow-shopify-chatbot.vercel.app";
  var WIDGET_ID = "glowup-chat-widget";
  var BTN_ID    = "glowup-chat-btn";
  var BADGE_ID  = "glowup-chat-badge";

  if (document.getElementById(WIDGET_ID)) return;

  /* ── Emoji map (must match Settings.jsx) ── */
  var ICON_MAP = {
    robot:    "🤖", bubble:   "💬", sparkle:  "✨", bag:      "🛍️",
    diamond:  "💎", crown:    "👑", heart:    "❤️", star:     "⭐",
    flower:   "🌸", lipstick: "💄", dress:    "👗", lightning:"⚡",
    gift:     "🎁", crystal:  "🔮", wand:     "🪄",
  };

  /* ── Fetch settings then boot ── */
  fetch(API_URL + "/api/settings")
    .then(function (r) { return r.json(); })
    .then(function (json) {
      var s = json.settings || {};
      if (s.widget_enabled === false) return; // admin disabled widget
      boot(s);
    })
    .catch(function () { boot({}); }); // settings fetch failed → show anyway

  function boot(s) {
    var primary   = s.color_primary   || "#d4af37";
    var headerBg  = s.color_header_bg || "#000000";
    var iconKey   = s.widget_icon     || "bubble";
    var iconEmoji = ICON_MAP[iconKey] || "💬";

    /* ── Styles ── */
    var style = document.createElement("style");
    style.textContent = [
      "#" + BTN_ID + " {",
      "  position:fixed; bottom:24px; right:24px; z-index:999998;",
      "  width:64px; height:64px; border-radius:50%;",
      "  background:" + headerBg + ";",
      "  border:2.5px solid " + primary + ";",
      "  box-shadow:0 6px 28px rgba(0,0,0,.42);",
      "  cursor:pointer; display:flex; align-items:center; justify-content:center;",
      "  transition:transform .2s, box-shadow .2s;",
      "  outline:none; -webkit-tap-highlight-color:transparent;",
      "  font-size:28px; line-height:1; padding:0;",
      "}",
      "#" + BTN_ID + ":hover { transform:scale(1.1); box-shadow:0 10px 36px rgba(0,0,0,.5); }",

      "#" + BADGE_ID + " {",
      "  position:absolute; top:-4px; right:-4px;",
      "  width:20px; height:20px; border-radius:50%;",
      "  background:" + primary + "; color:#000;",
      "  font-size:11px; font-weight:700; font-family:sans-serif;",
      "  display:flex; align-items:center; justify-content:center;",
      "  border:2px solid #fff; pointer-events:none;",
      "}",

      "#" + WIDGET_ID + " {",
      "  position:fixed; bottom:100px; right:24px; z-index:999999;",
      "  width:400px; height:680px;",
      "  max-width:calc(100vw - 32px); max-height:calc(100dvh - 120px);",
      "  border-radius:24px; overflow:hidden;",
      "  box-shadow:0 20px 60px rgba(0,0,0,.45);",
      "  border:1px solid " + primary + "33;",
      "  background:#f5f1e8;",
      "  transform:scale(0.92) translateY(12px); opacity:0; pointer-events:none;",
      "  transition:transform .25s cubic-bezier(.34,1.56,.64,1), opacity .2s ease;",
      "  transform-origin:bottom right;",
      "}",
      "#" + WIDGET_ID + ".open { transform:scale(1) translateY(0); opacity:1; pointer-events:all; }",
      "#" + WIDGET_ID + " iframe { width:100%; height:100%; border:none; display:block; }",

      "@media (max-width:480px) {",
      "  #" + WIDGET_ID + " { bottom:0; right:0; left:0; width:100%; max-width:100%; height:90dvh; max-height:90dvh; border-radius:20px 20px 0 0; transform-origin:bottom center; }",
      "  #" + BTN_ID + " { bottom:20px; right:20px; }",
      "}",
    ].join("\n");
    document.head.appendChild(style);

    /* ── Button ── */
    var btn = document.createElement("button");
    btn.id = BTN_ID;
    btn.setAttribute("aria-label", "Open GlowUp Goods chat");
    btn.setAttribute("title", "Chat with us");
    btn.textContent = iconEmoji;

    /* Badge */
    var badge = document.createElement("span");
    badge.id = BADGE_ID;
    badge.textContent = "1";
    btn.appendChild(badge);

    /* Close icon (×) shown when widget is open */
    var closeHTML = '<span style="font-size:24px;color:' + primary + '">✕</span>';

    /* ── Widget iframe ── */
    var container = document.createElement("div");
    container.id = WIDGET_ID;

    var iframe = document.createElement("iframe");
    iframe.src = CHAT_URL;
    iframe.setAttribute("title", "GlowUp Goods AI Stylist");
    iframe.setAttribute("allow", "microphone");
    iframe.setAttribute("loading", "lazy");
    container.appendChild(iframe);

    /* ── Toggle logic ── */
    var isOpen = false;

    function openWidget() {
      isOpen = true;
      container.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
      btn.innerHTML = closeHTML;
      if (badge.parentNode) badge.parentNode.removeChild(badge);
    }

    function closeWidget() {
      isOpen = false;
      container.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = iconEmoji;
    }

    btn.addEventListener("click", function () {
      isOpen ? closeWidget() : openWidget();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen) closeWidget();
    });

    document.body.appendChild(container);
    document.body.appendChild(btn);
  }
})();
