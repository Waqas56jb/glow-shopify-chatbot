import { useState } from "react";
import styles from "./Settings.module.css";

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    storeName: "GlowUp Goods",
    storeUrl: "https://glowupgoodsshop.com",
    supportEmail: "ana1987milosevic@gmail.com",
    discountCode: "GLOWUP10",
    discountPercent: "10",
    apiUrl: "https://your-server.vercel.app",
    welcomeTitle: "Welcome to Glow Up Goods",
    welcomeSubtitle: "I'm your personal shopping assistant. Together, we'll find the perfect style.",
    botName: "GlowUp AI Stylist",
    languages: "English",
    autoOpen: false,
    leadCapture: true,
    cartRecovery: true,
    upsell: true,
  });

  const set = (key) => (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [key]: val }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form className={styles.page} onSubmit={handleSave}>
      <Section title="Store Information">
        <Row label="Store Name">
          <input className={styles.input} value={form.storeName} onChange={set("storeName")} />
        </Row>
        <Row label="Store URL">
          <input className={styles.input} value={form.storeUrl} onChange={set("storeUrl")} type="url" />
        </Row>
        <Row label="Support Email">
          <input className={styles.input} value={form.supportEmail} onChange={set("supportEmail")} type="email" />
        </Row>
      </Section>

      <Section title="API Configuration">
        <Row label="Server API URL">
          <input className={styles.input} value={form.apiUrl} onChange={set("apiUrl")} />
        </Row>
      </Section>

      <Section title="Chatbot Appearance">
        <Row label="Bot Display Name">
          <input className={styles.input} value={form.botName} onChange={set("botName")} />
        </Row>
        <Row label="Welcome Screen Title">
          <input className={styles.input} value={form.welcomeTitle} onChange={set("welcomeTitle")} />
        </Row>
        <Row label="Welcome Subtitle">
          <textarea className={styles.textarea} value={form.welcomeSubtitle} onChange={set("welcomeSubtitle")} rows={2} />
        </Row>
        <Row label="Supported Languages">
          <input className={styles.input} value={form.languages} onChange={set("languages")} placeholder="English, Spanish…" />
        </Row>
      </Section>

      <Section title="Lead Capture & Offers">
        <Row label="Discount Code">
          <input className={styles.input} value={form.discountCode} onChange={set("discountCode")} />
        </Row>
        <Row label="Discount Percent (%)">
          <input className={styles.input} value={form.discountPercent} onChange={set("discountPercent")} type="number" min="0" max="100" />
        </Row>
      </Section>

      <Section title="Features">
        <Toggle label="Auto-open widget after 3 seconds"     value={form.autoOpen}    onChange={set("autoOpen")} />
        <Toggle label="Lead capture with discount offer"     value={form.leadCapture} onChange={set("leadCapture")} />
        <Toggle label="Cart recovery nudges"                 value={form.cartRecovery}onChange={set("cartRecovery")} />
        <Toggle label="Upsell & cross-sell suggestions"      value={form.upsell}      onChange={set("upsell")} />
      </Section>

      <div className={styles.footer}>
        {saved && <span className={styles.savedMsg}>✓ Settings saved successfully</span>}
        <button type="submit" className={styles.saveBtn}>Save Settings</button>
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

function Toggle({ label, value, onChange }) {
  return (
    <div className={styles.toggleRow}>
      <span className={styles.toggleLabel}>{label}</span>
      <label className={styles.toggle}>
        <input type="checkbox" checked={value} onChange={onChange} className={styles.toggleInput} />
        <span className={styles.toggleSlider} />
      </label>
    </div>
  );
}
