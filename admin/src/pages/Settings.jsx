import { useState, useEffect } from "react";
import { apiFetch } from "../hooks/useApi";
import styles from "./Settings.module.css";

/* ── Widget Icons ── */
const WIDGET_ICONS = [
  { id: "robot",    label: "AI Robot",   emoji: "🤖", bg: "#e8f4fd" },
  { id: "bubble",   label: "Chat",       emoji: "💬", bg: "#e8f5e9" },
  { id: "sparkle",  label: "Magic",      emoji: "✨", bg: "#fff8e1" },
  { id: "bag",      label: "Shopping",   emoji: "🛍️", bg: "#fce4ec" },
  { id: "diamond",  label: "Diamond",    emoji: "💎", bg: "#e3f2fd" },
  { id: "crown",    label: "Crown",      emoji: "👑", bg: "#fff3e0" },
  { id: "heart",    label: "Heart",      emoji: "❤️", bg: "#fce4ec" },
  { id: "star",     label: "Star",       emoji: "⭐", bg: "#fffde7" },
  { id: "flower",   label: "Blossom",    emoji: "🌸", bg: "#fce4ec" },
  { id: "lipstick", label: "Beauty",     emoji: "💄", bg: "#fce4ec" },
  { id: "dress",    label: "Fashion",    emoji: "👗", bg: "#f3e5f5" },
  { id: "lightning",label: "Lightning",  emoji: "⚡", bg: "#fffde7" },
  { id: "gift",     label: "Gift",       emoji: "🎁", bg: "#e8f5e9" },
  { id: "crystal",  label: "Crystal",    emoji: "🔮", bg: "#ede7f6" },
  { id: "wand",     label: "Magic Wand", emoji: "🪄", bg: "#e8eaf6" },
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
  const [s,         setS]         = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [saved,     setSaved]     = useState(false);
  const [error,     setError]     = useState("");

  // Form fields — undefined until loaded from DB
  const [widgetOn,  setWidgetOn]  = useState(undefined);
  const [icon,      setIcon]      = useState("bubble");
  const [openaiKey, setOpenaiKey] = useState("");
  const [showKey,   setShowKey]   = useState(false);
  const [colors, setColors] = useState({
    color_primary:    "#d4af37",
    color_bg:         "#f5f0eb",
    color_user_bubble:"#1a1a1a",
    color_bot_bubble: "#ffffff",
    color_send_btn:   "#c9a84c",
    color_header_bg:  "#1a1a1a",
  });

  const loadSettings = () => {
    setLoading(true);
    apiFetch("/api/settings/admin")
      .then(({ settings }) => {
        setS(settings);
        // Explicit boolean check — never default to true if DB says false
        setWidgetOn(settings.widget_enabled === true);
        setIcon(settings.widget_icon || "bubble");
        setColors({
          color_primary:     settings.color_primary     || "#d4af37",
          color_bg:          settings.color_bg          || "#f5f0eb",
          color_user_bubble: settings.color_user_bubble || "#1a1a1a",
          color_bot_bubble:  settings.color_bot_bubble  || "#ffffff",
          color_send_btn:    settings.color_send_btn    || "#c9a84c",
          color_header_bg:   settings.color_header_bg   || "#1a1a1a",
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadSettings, []);

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
      const body = {
        widget_enabled: widgetOn, // always send explicit boolean
        widget_icon:    icon,
        ...colors,
      };
      if (openaiKey.trim().length > 10) {
        body.openai_api_key = openaiKey.trim();
      }

      const { settings: updated } = await apiFetch("/api/settings", {
        method: "PUT",
        body:   JSON.stringify(body),
      });

      // Refresh local state from response
      setS(updated);
      setWidgetOn(updated.widget_enabled === true);
      setOpenaiKey(""); // clear input
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteKey = async () => {
    if (!confirm("Remove the stored OpenAI API key from database?\n\nThe Vercel env var key will be used as fallback.")) return;
    setDeleting(true);
    try {
      await apiFetch("/api/settings/openai-key", { method: "DELETE" });
      setS((prev) => ({ ...prev, openai_key_set: false, openai_key_masked: null, openai_key_source: prev.env_key_masked ? "environment" : "none" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading || widgetOn === undefined) {
    return <div className={styles.loadingMsg}>Loading settings…</div>;
  }

  const keySource = s?.openai_key_source || "none";

  return (
    <form className={styles.page} onSubmit={handleSave}>

      {/* ── Widget On/Off ── */}
      <Section title="🔌 Widget Control">
        <div className={styles.bigToggleRow}>
          <div>
            <p className={styles.bigToggleTitle}>Chatbot Widget</p>
            <p className={styles.bigToggleSub} style={{ color: widgetOn ? "var(--green)" : "var(--red)" }}>
              {widgetOn
                ? "✅ Widget is LIVE — customers can see it on Shopify"
                : "⛔ Widget is HIDDEN — customers cannot see the chatbot"}
            </p>
          </div>
          <label className={`${styles.toggle} ${styles.toggleLg}`}>
            <input
              type="checkbox"
              className={styles.toggleInput}
              checked={widgetOn}
              onChange={(e) => { setWidgetOn(e.target.checked); setSaved(false); }}
            />
            <span className={styles.toggleSlider} />
          </label>
        </div>
      </Section>

      {/* ── OpenAI API Key ── */}
      <Section title="🤖 OpenAI API Key">
        {/* Source indicator */}
        <div className={styles.keyStatusRow}>
          <div>
            <span className={`${styles.keyBadge} ${keySource === "none" ? styles.badgeRed : styles.badgeGreen}`}>
              {keySource === "database"    && "✓ Active key: Database"}
              {keySource === "environment" && "✓ Active key: Vercel env vars"}
              {keySource === "none"        && "⚠ No API key — chatbot won't work"}
            </span>
          </div>
          {keySource !== "none" && (
            <div className={styles.keyDeleteRow}>
              {keySource === "database" && s?.openai_key_masked && (
                <button type="button" className={styles.deleteKeyBtn} onClick={handleDeleteKey} disabled={deleting}>
                  {deleting ? "Removing…" : "🗑 Remove DB key"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Masked key preview */}
        {(s?.openai_key_masked || s?.env_key_masked) && (
          <div className={styles.keyPreviewRow}>
            {s.openai_key_source === "database" && s.openai_key_masked && (
              <div className={styles.keyPreviewItem}>
                <span className={styles.keyPreviewLabel}>Database key</span>
                <code className={styles.keyPreviewVal}>{s.openai_key_masked}</code>
              </div>
            )}
            {s.env_key_masked && (
              <div className={styles.keyPreviewItem}>
                <span className={styles.keyPreviewLabel}>Vercel env key</span>
                <code className={styles.keyPreviewVal}>{s.env_key_masked}</code>
              </div>
            )}
            <p className={styles.keyNote}>
              🔒 Keys are masked for security. Database key takes priority over Vercel env var.
            </p>
          </div>
        )}

        {/* New key input */}
        <Row label={s?.openai_key_set ? "Replace key" : "Add API Key"}>
          <div className={styles.keyInputWrap}>
            <input
              className={styles.input}
              type={showKey ? "text" : "password"}
              value={openaiKey}
              onChange={(e) => { setOpenaiKey(e.target.value); setSaved(false); }}
              placeholder={s?.openai_key_set ? "Enter new key to replace existing…" : "sk-proj-…"}
              autoComplete="new-password"
              spellCheck={false}
            />
            <button type="button" className={styles.eyeBtn} onClick={() => setShowKey((v) => !v)} title={showKey ? "Hide" : "Show"}>
              {showKey ? "🙈" : "👁"}
            </button>
          </div>
        </Row>
        <p className={styles.hint}>Leave blank to keep existing key. Min 10 characters required to save.</p>
      </Section>

      {/* ── Color Theme ── */}
      <Section title="🎨 Color Theme">
        <div className={styles.presetGrid}>
          {COLOR_PRESETS.map((p) => (
            <button key={p.name} type="button" className={styles.presetBtn} onClick={() => applyPreset(p)}>
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
                <input type="color" className={styles.colorSwatch}
                  value={colors[key]}
                  onChange={(e) => { setColors((c) => ({ ...c, [key]: e.target.value })); setSaved(false); }}
                />
                <input type="text" className={styles.colorHex}
                  value={colors[key]}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) { setColors((c) => ({ ...c, [key]: v })); setSaved(false); }
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
              <div className={styles.previewBubble} style={{ background: colors.color_bot_bubble, color: "#333", alignSelf: "flex-start" }}>Hi! How can I help you? 🔥</div>
              <div className={styles.previewBubble} style={{ background: colors.color_user_bubble, color: "#fff", alignSelf: "flex-end" }}>I need a dress</div>
            </div>
            <div className={styles.previewInputRow}>
              <div className={styles.previewInputBar} style={{ background: colors.color_bg, border: `1px solid ${colors.color_primary}44` }}>Write your message…</div>
              <div className={styles.previewSendBtn} style={{ background: colors.color_send_btn }}>↑</div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Widget Icon ── */}
      <Section title="💬 Widget Button Icon">
        <p className={styles.hint} style={{ padding: "10px 18px 4px" }}>
          Select the icon on the floating chat button. Saved icon appears live on Shopify.
        </p>
        <div className={styles.iconGrid}>
          {WIDGET_ICONS.map(({ id, label, emoji, bg }) => (
            <button key={id} type="button"
              className={`${styles.iconBtn} ${icon === id ? styles.iconBtnActive : ""}`}
              onClick={() => { setIcon(id); setSaved(false); }}
              title={label}
            >
              <span className={styles.iconEmoji} style={{ background: icon === id ? "rgba(212,175,55,0.2)" : bg }}>
                {emoji}
              </span>
              <span className={styles.iconLabel}>{label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* ── Save ── */}
      {error && <p className={styles.errorMsg}>⚠ {error}</p>}
      <div className={styles.footer}>
        {saved && <span className={styles.savedMsg}>✓ All settings saved and live!</span>}
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
