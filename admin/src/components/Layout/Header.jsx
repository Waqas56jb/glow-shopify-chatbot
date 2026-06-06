import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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
  const { signOut } = useAuth();
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
        <button className={styles.signOutBtn} onClick={signOut} title="Sign out">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
        <div className={styles.avatar}>A</div>
      </div>
    </header>
  );
}
