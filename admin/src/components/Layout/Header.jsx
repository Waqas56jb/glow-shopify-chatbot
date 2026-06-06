import { useLocation } from "react-router-dom";
import styles from "./Header.module.css";

const PAGE_TITLES = {
  "/dashboard":     "Dashboard",
  "/leads":         "Leads",
  "/conversations": "Conversations",
  "/orders":        "Orders",
  "/settings":      "Settings",
};

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || "Admin";
  const now = new Date().toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          className={styles.menuBtn}
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <h2 className={styles.title}>{title}</h2>
      </div>

      <div className={styles.right}>
        <span className={styles.date}>{now}</span>
        <div className={styles.avatar}>W</div>
      </div>
    </header>
  );
}
