import { useState, useEffect } from "react";
import { apiFetch } from "../hooks/useApi";
import styles from "./Settings.module.css";

/* ─────────────────────────────────────────────────────────────────────────
   WIDGET ICONS
───────────────────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────────────────
   28 THEMES  (name · tag · primary · bg · user · bot · btn · header)
───────────────────────────────────────────────────────────────────────── */
const THEMES = [
  // ── Luxury & Fashion ──────────────────────────────────────────────
  { name:"Gold & Black",       tag:"Luxury",    primary:"#d4af37", bg:"#f5f0eb", user:"#1a1a1a", bot:"#ffffff", btn:"#c9a84c", header:"#1a1a1a" },
  { name:"Rose Gold & Ivory",  tag:"Luxury",    primary:"#b76e79", bg:"#fff8f5", user:"#2d1a1d", bot:"#fff8f5", btn:"#b76e79", header:"#2d1a1d" },
  { name:"Champagne",          tag:"Luxury",    primary:"#f7e7ce", bg:"#fdf8f0", user:"#5c4a1e", bot:"#ffffff", btn:"#d4a853", header:"#5c4a1e" },
  { name:"Platinum & White",   tag:"Luxury",    primary:"#b0b7c3", bg:"#f8f9fa", user:"#2d3142", bot:"#ffffff", btn:"#9da5b4", header:"#2d3142" },
  { name:"Burgundy Gold",      tag:"Luxury",    primary:"#d4af37", bg:"#fdf5f5", user:"#7b2d3a", bot:"#ffffff", btn:"#d4af37", header:"#7b2d3a" },
  { name:"Black Diamond",      tag:"Luxury",    primary:"#a8dadc", bg:"#0a0a0a", user:"#1a1a2e", bot:"#16213e", btn:"#a8dadc", header:"#000000" },

  // ── Nature & Organic ──────────────────────────────────────────────
  { name:"Emerald Forest",     tag:"Nature",    primary:"#059669", bg:"#f0fdf4", user:"#064e3b", bot:"#ffffff", btn:"#059669", header:"#064e3b" },
  { name:"Sage & Linen",       tag:"Nature",    primary:"#84a98c", bg:"#f1ede4", user:"#344e41", bot:"#fefae0", btn:"#588157", header:"#344e41" },
  { name:"Ocean Breeze",       tag:"Nature",    primary:"#0ea5e9", bg:"#f0f9ff", user:"#0c4a6e", bot:"#ffffff", btn:"#0284c7", header:"#0c4a6e" },
  { name:"Lavender Fields",    tag:"Nature",    primary:"#9b72cf", bg:"#faf5ff", user:"#44337a", bot:"#ffffff", btn:"#805ad5", header:"#44337a" },
  { name:"Terracotta",         tag:"Nature",    primary:"#c4714d", bg:"#fdf0eb", user:"#7b3f2a", bot:"#ffffff", btn:"#c4714d", header:"#7b3f2a" },
  { name:"Cherry Blossom",     tag:"Nature",    primary:"#f9a8d4", bg:"#fff1f5", user:"#831843", bot:"#ffffff", btn:"#ec4899", header:"#9d174d" },

  // ── Dark & Dramatic ───────────────────────────────────────────────
  { name:"Midnight Blue",      tag:"Dark",      primary:"#4f46e5", bg:"#0f0f23", user:"#1e1b4b", bot:"#1e1b4b", btn:"#4f46e5", header:"#09090f" },
  { name:"Obsidian",           tag:"Dark",      primary:"#6b7280", bg:"#111827", user:"#1f2937", bot:"#1f2937", btn:"#6b7280", header:"#030712" },
  { name:"Neon Cyber",         tag:"Dark",      primary:"#00f5d4", bg:"#0d0d1a", user:"#1a1a2e", bot:"#16213e", btn:"#00f5d4", header:"#0d0d1a" },
  { name:"Deep Purple",        tag:"Dark",      primary:"#a855f7", bg:"#0a0014", user:"#1a0033", bot:"#1a0033", btn:"#a855f7", header:"#050010" },
  { name:"Volcanic",           tag:"Dark",      primary:"#ef4444", bg:"#1c0a0a", user:"#2d1111", bot:"#2d1111", btn:"#dc2626", header:"#0f0000" },
  { name:"Aurora",             tag:"Dark",      primary:"#34d399", bg:"#0a1628", user:"#0f2744", bot:"#0f2744", btn:"#10b981", header:"#050d1a" },

  // ── Soft & Minimal ────────────────────────────────────────────────
  { name:"Cotton Candy",       tag:"Minimal",   primary:"#f9a8d4", bg:"#fdf2f8", user:"#db2777", bot:"#ffffff", btn:"#f472b6", header:"#be185d" },
  { name:"Sky & Cloud",        tag:"Minimal",   primary:"#60a5fa", bg:"#eff6ff", user:"#1e40af", bot:"#ffffff", btn:"#3b82f6", header:"#1e3a8a" },
  { name:"Peach Cream",        tag:"Minimal",   primary:"#fb923c", bg:"#fff7ed", user:"#9a3412", bot:"#ffffff", btn:"#ea580c", header:"#7c2d12" },
  { name:"Mint Fresh",         tag:"Minimal",   primary:"#34d399", bg:"#ecfdf5", user:"#065f46", bot:"#ffffff", btn:"#10b981", header:"#064e3b" },
  { name:"Lilac Dream",        tag:"Minimal",   primary:"#c084fc", bg:"#fdf4ff", user:"#6b21a8", bot:"#ffffff", btn:"#a855f7", header:"#581c87" },
  { name:"Sand Dune",          tag:"Minimal",   primary:"#d97706", bg:"#fffbeb", user:"#78350f", bot:"#ffffff", btn:"#b45309", header:"#451a03" },

  // ── Bold & Vibrant ────────────────────────────────────────────────
  { name:"Electric Blue",      tag:"Bold",      primary:"#2563eb", bg:"#eff6ff", user:"#1e3a8a", bot:"#ffffff", btn:"#1d4ed8", header:"#1e3a8a" },
  { name:"Crimson & Gold",     tag:"Bold",      primary:"#fbbf24", bg:"#fff1f2", user:"#9f1239", bot:"#ffffff", btn:"#f59e0b", header:"#881337" },
  { name:"Teal & Coral",       tag:"Bold",      primary:"#0d9488", bg:"#f0fdfa", user:"#134e4a", bot:"#ffffff", btn:"#0f766e", header:"#134e4a" },
  { name:"Sunset Gradient",    tag:"Bold",      primary:"#f97316", bg:"#fff7ed", user:"#7c2d12", bot:"#ffffff", btn:"#ea580c", header:"#431407" },
];

const INITIAL_SHOW = 8;

/* ─────────────────────────────────────────────────────────────────────────
   MINI PREVIEW component
───────────────────────────────────────────────────────────────────────── */
function ThemePreview({ theme, size = "sm" }) {
  const isSm = size === "sm";
  return (
    <div className={isSm ? styles.miniChat : styles.medChat} style={{ background: theme.bg }}>
      <div className={isSm ? styles.miniHeader : styles.medHeader} style={{ background: theme.header }}>
        <span className={isSm ? styles.miniDot : styles.medDot} style={{ background: theme.primary }} />
        {!isSm && <span className={styles.medName}>Glow Up Goods</span>}
      </div>
      <div className={isSm ? styles.miniMsgs : styles.medMsgs}>
        <div className={isSm ? styles.miniBot : styles.medBot} style={{ background: theme.bot }} />
        <div className={isSm ? styles.miniUser : styles.medUser} style={{ background: theme.user }} />
        <div className={isSm ? styles.miniBot2 : styles.medBot} style={{ background: theme.bot, width: isSm ? "55%" : "70%" }} />
      </div>
      {!isSm && (
        <div className={styles.medFooter} style={{ borderTop: `1px solid ${theme.primary}33` }}>
          <div className={styles.medInput} style={{ borderColor: `${theme.primary}55` }} />
          <div className={styles.medSend} style={{ background: theme.btn }} />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────── */
export default function Settings() {
  const [s,          setS]          = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const [saved,      setSaved]      = useState(false);
  const [error,      setError]      = useState("");
  const [showAll,    setShowAll]    = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const [widgetOn,   setWidgetOn]   = useState(undefined);
  const [icon,       setIcon]       = useState("bubble");
  const [openaiKey,  setOpenaiKey]  = useState("");
  const [showKey,    setShowKey]    = useState(false);
  const [activeTheme,setActiveTheme]= useState(null); // name of selected preset
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
        setWidgetOn(settings.widget_enabled === true);
        setIcon(settings.widget_icon || "bubble");
        const c = {
          color_primary:     settings.color_primary     || "#d4af37",
          color_bg:          settings.color_bg          || "#f5f0eb",
          color_user_bubble: settings.color_user_bubble || "#1a1a1a",
          color_bot_bubble:  settings.color_bot_bubble  || "#ffffff",
          color_send_btn:    settings.color_send_btn    || "#c9a84c",
          color_header_bg:   settings.color_header_bg   || "#1a1a1a",
        };
        setColors(c);
        // Detect active preset
        const match = THEMES.find(t =>
          t.primary === c.color_primary && t.bg === c.color_bg
        );
        setActiveTheme(match?.name || null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(loadSettings, []);

  const applyTheme = (t) => {
    setColors({ color_primary:t.primary, color_bg:t.bg, color_user_bubble:t.user, color_bot_bubble:t.bot, color_send_btn:t.btn, color_header_bg:t.header });
    setActiveTheme(t.name);
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError(""); setSaved(false);
    try {
      const body = { widget_enabled: widgetOn, widget_icon: icon, ...colors };
      if (openaiKey.trim().length > 10) body.openai_api_key = openaiKey.trim();
      const { settings: updated } = await apiFetch("/api/settings", { method:"PUT", body: JSON.stringify(body) });
      setS(updated);
      setWidgetOn(updated.widget_enabled === true);
      setOpenaiKey("");
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteKey = async () => {
    if (!confirm("Remove stored OpenAI key from database?\nVercel env key will be used as fallback.")) return;
    setDeleting(true);
    try {
      await apiFetch("/api/settings/openai-key", { method:"DELETE" });
      setS((prev) => ({ ...prev, openai_key_set:false, openai_key_masked:null, openai_key_source: prev.env_key_masked?"environment":"none" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading || widgetOn === undefined) return <div className={styles.loadingMsg}>Loading settings…</div>;

  const visibleThemes = showAll ? THEMES : THEMES.slice(0, INITIAL_SHOW);
  const keySource = s?.openai_key_source || "none";

  /* live preview object */
  const liveTheme = { primary:colors.color_primary, bg:colors.color_bg, user:colors.color_user_bubble, bot:colors.color_bot_bubble, btn:colors.color_send_btn, header:colors.color_header_bg };

  return (
    <form className={styles.page} onSubmit={handleSave}>

      {/* ── Widget On/Off ── */}
      <Section title="🔌 Widget Control">
        <div className={styles.bigToggleRow}>
          <div>
            <p className={styles.bigToggleTitle}>Chatbot Widget</p>
            <p className={styles.bigToggleSub} style={{ color: widgetOn ? "var(--green)" : "var(--red)" }}>
              {widgetOn ? "✅ LIVE — customers can see it on Shopify" : "⛔ HIDDEN — customers cannot see the chatbot"}
            </p>
          </div>
          <label className={`${styles.toggle} ${styles.toggleLg}`}>
            <input type="checkbox" className={styles.toggleInput} checked={widgetOn}
              onChange={(e) => { setWidgetOn(e.target.checked); setSaved(false); }} />
            <span className={styles.toggleSlider} />
          </label>
        </div>
      </Section>

      {/* ── OpenAI Key ── */}
      <Section title="🤖 OpenAI API Key">
        <div className={styles.keyStatusRow}>
          <span className={`${styles.keyBadge} ${keySource==="none"?styles.badgeRed:styles.badgeGreen}`}>
            {keySource==="database"    && "✓ Active: Database key"}
            {keySource==="environment" && "✓ Active: Vercel env key"}
            {keySource==="none"        && "⚠ No key — chatbot won't work"}
          </span>
          {keySource==="database" && s?.openai_key_masked && (
            <button type="button" className={styles.deleteKeyBtn} onClick={handleDeleteKey} disabled={deleting}>
              {deleting?"Removing…":"🗑 Remove DB key"}
            </button>
          )}
        </div>

        {(s?.openai_key_masked || s?.env_key_masked) && (
          <div className={styles.keyPreviewRow}>
            {s.openai_key_source==="database" && s.openai_key_masked && (
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
            <p className={styles.keyNote}>🔒 Keys masked for security. Database key takes priority over Vercel env var.</p>
          </div>
        )}

        <Row label={s?.openai_key_set ? "Replace key" : "Add API Key"}>
          <div className={styles.keyInputWrap}>
            <input className={styles.input} type={showKey?"text":"password"} value={openaiKey}
              onChange={(e) => { setOpenaiKey(e.target.value); setSaved(false); }}
              placeholder={s?.openai_key_set?"Enter new key to replace…":"sk-proj-…"}
              autoComplete="new-password" spellCheck={false} />
            <button type="button" className={styles.eyeBtn} onClick={() => setShowKey(v=>!v)}>{showKey?"🙈":"👁"}</button>
          </div>
        </Row>
        <p className={styles.hint}>Leave blank to keep existing. Min 10 characters required.</p>
      </Section>

      {/* ── Color Themes ── */}
      <Section title="🎨 Color Themes">

        {/* Theme grid */}
        <div className={styles.themeGrid}>
          {visibleThemes.map((t, i) => (
            <button
              key={t.name} type="button"
              className={`${styles.themeCard} ${activeTheme===t.name?styles.themeCardActive:""}`}
              onClick={() => applyTheme(t)}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <ThemePreview theme={t} size={hoveredIdx===i?"md":"sm"} />
              <div className={styles.themeInfo}>
                <span className={styles.themeName}>{t.name}</span>
                <span className={styles.themeTag}>{t.tag}</span>
              </div>
              {activeTheme===t.name && <span className={styles.themeCheck}>✓</span>}
            </button>
          ))}
        </div>

        {/* See more / less */}
        {THEMES.length > INITIAL_SHOW && (
          <button type="button" className={styles.seeMoreBtn} onClick={() => setShowAll(v=>!v)}>
            {showAll ? `▲ Show less` : `▼ See all ${THEMES.length} themes`}
          </button>
        )}

        {/* Custom color builder */}
        <div className={styles.customDivider}>
          <span>✦ Custom Color Builder</span>
        </div>

        <div className={styles.colorGrid}>
          {[
            { key:"color_primary",     label:"Brand / Accent" },
            { key:"color_bg",          label:"Chat Background" },
            { key:"color_user_bubble", label:"User Bubble" },
            { key:"color_bot_bubble",  label:"Bot Bubble" },
            { key:"color_send_btn",    label:"Send Button" },
            { key:"color_header_bg",   label:"Header Background" },
          ].map(({ key, label }) => (
            <div key={key} className={styles.colorRow}>
              <label className={styles.colorLabel}>{label}</label>
              <div className={styles.colorInputWrap}>
                <input type="color" className={styles.colorSwatch}
                  value={colors[key]}
                  onChange={(e) => { setColors(c=>({...c,[key]:e.target.value})); setActiveTheme(null); setSaved(false); }}
                />
                <input type="text" className={styles.colorHex}
                  value={colors[key]}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^#[0-9a-fA-F]{0,6}$/.test(v)) { setColors(c=>({...c,[key]:v})); setActiveTheme(null); setSaved(false); }
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
          <ThemePreview theme={liveTheme} size="md" />
        </div>
      </Section>

      {/* ── Widget Icon ── */}
      <Section title="💬 Widget Button Icon">
        <p className={styles.hint} style={{ padding:"10px 18px 4px" }}>
          Floating button icon shown on Shopify. Selected icon is live immediately after save.
        </p>
        <div className={styles.iconGrid}>
          {WIDGET_ICONS.map(({ id, label, emoji, bg }) => (
            <button key={id} type="button"
              className={`${styles.iconBtn} ${icon===id?styles.iconBtnActive:""}`}
              onClick={() => { setIcon(id); setSaved(false); }} title={label}>
              <span className={styles.iconEmoji} style={{ background: icon===id?"rgba(212,175,55,0.2)":bg }}>
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
