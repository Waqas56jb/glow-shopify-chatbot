import { useState, useEffect } from "react";
import { apiFetch } from "../hooks/useApi";
import styles from "./Settings.module.css";

/* ── Widget Icon definitions ─────────────────────────────────────────── */
const WIDGET_ICONS = [
  { id: "bubble",   label: "Chat Bubble",  svg: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/> },
  { id: "sparkle",  label: "Sparkle",      svg: <><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></> },
  { id: "bag",      label: "Shopping Bag", svg: <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></> },
  { id: "heart",    label: "Heart",        svg: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/> },
  { id: "star",     label: "Star",         svg: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/> },
  { id: "diamond",  label: "Diamond",      svg: <><path d="M6 3h12l4 6-10 13L2 9z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></> },
  { id: "crown",    label: "Crown",        svg: <path d="M2 20h20M5 20V8l7-6 7 6v12"/> },
  { id: "gift",     label: "Gift",         svg: <><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/></> },
  { id: "wand",     label: "Magic Wand",   svg: <><path d="m15 4-1 1"/><path d="m12 7 1-1"/><path d="M9 4l1 1"/><path d="m4 9 1 1"/><path d="m7 12-1 1"/><path d="M4 15l1-1"/><line x1="5" y1="19" x2="19" y2="5"/><path d="m19 9 1 1"/><path d="m15 20 1-1"/><path d="m20 15-1 1"/></> },
  { id: "message",  label: "Message",      svg: <><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><line x1="9" y1="10" x2="15" y2="10"/><line x1="9" y1="14" x2="13" y2="14"/></> },
  { id: "flower",   label: "Flower",       svg: <><circle cx="12" cy="12" r="3"/><path d="M12 2a4 4 0 0 1 4 4 4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1-4-4 4 4 0 0 1 4-4 4 4 0 0 1 4-4z"/></> },
  { id: "lightning",label: "Lightning",    svg: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/> },
  { id: "handbag",  label: "Handbag",      svg: <><path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M8 2a4 4 0 0 1 8 0"/></> },
  { id: "scissors", label: "Scissors",     svg: <><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></> },
  { id: "dress",    label: "Fashion",      svg: <><path d="M9 2h6l2 5-5 3-5-3z"/><path d="M7 7l-5 15h20L17 7"/></> },
];

const COLOR_PRESETS = [
  { name: "Gold & Black (Default)", primary:"#d4af37", bg:"#f5f0eb", user:"#1a1a1a", bot:"#ffffff", btn:"#c9a84c", header:"#1a1a1a" },
  { name: "Rose Gold & Ivory",      primary:"#b76e79", bg:"#fff8f5", user:"#2d1a1d", bot:"#fff8f5", btn:"#b76e79", header:"#2d1a1d" },
  { name: "Midnight & Silver",      primary:"#94a3b8", bg:"#0f172a", user:"#1e293b", bot:"#1e293b", btn:"#94a3b8", header:"#020617" },
  { name: "Emerald & Cream",        primary:"#059669", bg:"#f0fdf4", user:"#064e3b", bot:"#ffffff", btn:"#059669", header:"#064e3b" },
  { name: "Royal Purple",           primary:"#7c3aed", bg:"#faf5ff", user:"#2e1065", bot:"#ffffff", btn:"#7c3aed", header:"#2e1065" },
  { name: "Blush Pink & White",     primary:"#ec4899", bg:"#fff1f2", user:"#831843", bot:"#ffffff", btn:"#ec4899", header:"#500724" },
];

export default function Settings() {
  const [s, setS]           = useState(null);      // settings from API
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [deleting,setDeleting]= useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState("");

  // Local form state
  const [openaiKey,  setOpenaiKey]  = useState("");
  const [showKey,    setShowKey]    = useState(false);
  const [widgetOn,   setWidgetOn]   = useState(true);
  const [icon,       setIcon]       = useState("bubble");
  const [colors, setColors] = useState({
    color_primary:    "#d4af37",
    color_bg:         "#f5f0eb",
    color_user_bubble:"#1a1a1a",
    color_bot_bubble: "#ffffff",
    color_send_btn:   "#c9a84c",
    color_header_bg:  "#1a1a1a",
  });

  useEffect(() => {
    apiFetch("/api/settings/admin")
      .then(({ settings }) => {
        setS(settings);
        setWidgetOn(settings.widget_enabled !== false);
        setIcon(settings.widget_icon || "bubble");
        setColors({
          color_primary:    settings.color_primary    || "#d4af37",
          color_bg:         settings.color_bg         || "#f5f0eb",
          color_user_bubble:settings.color_user_bubble|| "#1a1a1a",
          color_bot_bubble: settings.color_bot_bubble || "#ffffff",
          color_send_btn:   settings.color_send_btn   || "#c9a84c",
          color_header_bg:  settings.color_header_bg  || "#1a1a1a",
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const applyPreset = (p) => {
    setColors({
      color_primary:    p.primary,
      color_bg:         p.bg,
      color_user_bubble:p.user,
      color_bot_bubble: p.bot,
      color_send_btn:   p.btn,
      color_header_bg:  p.header,
    });
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await apiFetch("/api/settings", {
        method: "PUT",
        body:   JSON.stringify({
          widget_enabled: widgetOn,
          widget_icon:    icon,
          ...colors,
          ...(openaiKey.trim() ? { openai_api_key: openaiKey.trim() } : {}),
        }),
      });
      setOpenaiKey(""); // clear field after save
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteKey = async () => {
    if (!confirm("Remove the stored OpenAI API key from database?")) return;
    setDeleting(true);
    try {
      await apiFetch("/api/settings/openai-key", { method: "DELETE" });
      setS((prev) => ({ ...prev, openai_key_set: false, openai_key_source: process.env.VITE_API_URL ? "environment" : "none" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className={styles.loadingMsg}>Loading settings…</div>;

  return (
    <form className={styles.page} onSubmit={handleSave}>

      {/* ── Widget On/Off ── */}
      <Section title="🔌 Widget Control">
        <div className={styles.bigToggleRow}>
          <div>
            <p className={styles.bigToggleTitle}>Chatbot Widget</p>
            <p className={styles.bigToggleSub}>
              {widgetOn
                ? "✅ Widget is LIVE on Shopify"
                : "⛔ Widget is hidden — customers cannot see the chatbot"}
            </p>
          </div>
          <label className={`${styles.toggle} ${styles.toggleLg}`}>
            <input type="checkbox" className={styles.toggleInput} checked={widgetOn} onChange={(e) => setWidgetOn(e.target.checked)} />
            <span className={styles.toggleSlider} />
          </label>
        </div>
      </Section>

      {/* ── OpenAI Key ── */}
      <Section title="🤖 OpenAI API Key">
        <div className={styles.keyStatus}>
          <span className={`${styles.keyBadge} ${s?.openai_key_source === "none" ? styles.badgeRed : styles.badgeGreen}`}>
            {s?.openai_key_source === "database"    && "✓ Key stored in database"}
            {s?.openai_key_source === "environment" && "✓ Key from Vercel env vars"}
            {s?.openai_key_source === "none"        && "⚠ No key configured"}
          </span>
          {s?.openai_key_source === "database" && (
            <button type="button" className={styles.deleteKeyBtn} onClick={handleDeleteKey} disabled={deleting}>
              {deleting ? "Removing…" : "Remove key"}
            </button>
          )}
        </div>
        <Row label="New API Key">
          <div className={styles.keyInputWrap}>
            <input
              className={styles.input}
              type={showKey ? "text" : "password"}
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder={s?.openai_key_set ? "Enter new key to replace…" : "sk-proj-…"}
              autoComplete="off"
            />
            <button type="button" className={styles.eyeBtn} onClick={() => setShowKey((v) => !v)}>
              {showKey ? "🙈" : "👁"}
            </button>
          </div>
        </Row>
        <p className={styles.hint}>
          Leave blank to keep existing key. Database key takes priority over Vercel env var when set.
        </p>
      </Section>

      {/* ── Color Theme ── */}
      <Section title="🎨 Color Theme">
        <div className={styles.presetGrid}>
          {COLOR_PRESETS.map((p) => (
            <button
              key={p.name} type="button"
              className={styles.presetBtn}
              onClick={() => applyPreset(p)}
            >
              <span className={styles.presetSwatch} style={{ background: p.primary }} />
              <span className={styles.presetSwatch} style={{ background: p.bg, border: "1px solid #ccc" }} />
              <span className={styles.presetName}>{p.name}</span>
            </button>
          ))}
        </div>

        <div className={styles.colorGrid}>
          {[
            { key: "color_primary",     label: "Brand / Accent Color" },
            { key: "color_bg",          label: "Chat Background" },
            { key: "color_user_bubble", label: "User Bubble" },
            { key: "color_bot_bubble",  label: "Bot Bubble" },
            { key: "color_send_btn",    label: "Send Button" },
            { key: "color_header_bg",   label: "Header Background" },
          ].map(({ key, label }) => (
            <div key={key} className={styles.colorRow}>
              <label className={styles.colorLabel}>{label}</label>
              <div className={styles.colorInputWrap}>
                <input
                  type="color"
                  className={styles.colorSwatch}
                  value={colors[key]}
                  onChange={(e) => setColors((c) => ({ ...c, [key]: e.target.value }))}
                />
                <input
                  type="text"
                  className={styles.colorHex}
                  value={colors[key]}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setColors((c) => ({ ...c, [key]: v }));
                  }}
                  maxLength={7}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Live preview */}
        <div className={styles.previewWrap}>
          <p className={styles.previewLabel}>Live Preview</p>
          <div className={styles.previewChat} style={{ background: colors.color_bg }}>
            <div className={styles.previewHeader} style={{ background: colors.color_header_bg }}>
              <span className={styles.previewHeaderDot} style={{ background: colors.color_primary }} />
              <span className={styles.previewHeaderText}>Glow Up Goods</span>
            </div>
            <div className={styles.previewMessages}>
              <div className={styles.previewBubble} style={{ background: colors.color_bot_bubble, color: "#333", alignSelf: "flex-start" }}>
                Hi! How can I help you today? 🔥
              </div>
              <div className={styles.previewBubble} style={{ background: colors.color_user_bubble, color: "#fff", alignSelf: "flex-end" }}>
                I need a dress
              </div>
            </div>
            <div className={styles.previewInputRow}>
              <div className={styles.previewInputBar} style={{ background: colors.color_bg, border: `1px solid ${colors.color_primary}44` }}>
                Write your message…
              </div>
              <div className={styles.previewSendBtn} style={{ background: colors.color_send_btn }}>
                ↑
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Widget Icon ── */}
      <Section title="💬 Widget Button Icon">
        <p className={styles.hint} style={{ padding: "10px 18px 4px" }}>Select the icon shown on the floating chat button in Shopify.</p>
        <div className={styles.iconGrid}>
          {WIDGET_ICONS.map(({ id, label, svg }) => (
            <button
              key={id} type="button"
              className={`${styles.iconBtn} ${icon === id ? styles.iconBtnActive : ""}`}
              onClick={() => setIcon(id)}
              title={label}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" className={styles.iconSvg}>
                {svg}
              </svg>
              <span className={styles.iconLabel}>{label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* ── Save ── */}
      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
      <div className={styles.footer}>
        {saved && <span className={styles.savedMsg}>✓ Settings saved and live!</span>}
        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className={styles.row}>
      <label className={styles.label}>{label}</label>
      <div className={styles.control}>{children}</div>
    </div>
  );
}
