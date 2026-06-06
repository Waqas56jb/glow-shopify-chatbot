import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import styles from "./Dashboard.module.css";

const STATUS_COLORS = {
  new:       { bg: "rgba(212,175,55,0.12)", color: "#d4af37"  },
  contacted: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6"  },
  converted: { bg: "rgba(34,197,94,0.12)",  color: "#22c55e"  },
};

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Dashboard() {
  const { get } = useApi();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    get("/api/stats")
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState />;
  if (error)   return <ErrorState msg={error} />;

  const { stats, recentLeads } = data;

  const STAT_CARDS = [
    { label: "Total Leads",       value: stats.totalLeads,          sub: `+${stats.newLeadsToday} today`,        color: "gold",   icon: "👥" },
    { label: "Conversations",     value: stats.totalConversations,  sub: `${stats.activeConversations} active`,  color: "blue",   icon: "💬" },
    { label: "Order Inquiries",   value: stats.totalOrders,         sub: `${stats.pendingOrders} pending`,       color: "green",  icon: "📦" },
    { label: "Conversion Rate",   value: stats.conversionRate,      sub: "leads ÷ conversations",               color: "purple", icon: "📈" },
  ];

  return (
    <div className={styles.page}>
      <p className={styles.subtitle}>Welcome back! Here's your store overview.</p>

      <div className={styles.statsGrid}>
        {STAT_CARDS.map((c) => (
          <div key={c.label} className={`${styles.statCard} ${styles[c.color]}`}>
            <div className={styles.statIcon}>{c.icon}</div>
            <div className={styles.statBody}>
              <p className={styles.statValue}>{c.value}</p>
              <p className={styles.statLabel}>{c.label}</p>
              <p className={styles.statSub}>{c.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Recent Leads</h3>
          <a href="/leads" className={styles.seeAll}>See all →</a>
        </div>
        <div className={styles.tableWrap}>
          {recentLeads.length === 0 ? (
            <p className={styles.empty}>No leads captured yet. Chatbot will collect them automatically!</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Interested In</th><th>Status</th><th>Time</th></tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td className={styles.nameCell}>{lead.name || "—"}</td>
                    <td className={styles.mutedCell}>{lead.email}</td>
                    <td>{lead.product_interest || "—"}</td>
                    <td><span className={styles.badge} style={STATUS_COLORS[lead.status] || STATUS_COLORS.new}>{lead.status}</span></td>
                    <td className={styles.mutedCell}>{timeAgo(lead.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className={styles.quickGrid}>
        <div className={styles.quickCard}>
          <div className={styles.quickIcon}>🤖</div>
          <div><p className={styles.quickTitle}>Chatbot Status</p><p className={styles.quickSub}>Online · Responding normally</p></div>
          <span className={styles.onlineDot} />
        </div>
        <div className={styles.quickCard}>
          <div className={styles.quickIcon}>💬</div>
          <div><p className={styles.quickTitle}>Total Messages</p><p className={styles.quickSub}>{stats.totalMessages} messages processed</p></div>
        </div>
        <div className={styles.quickCard}>
          <div className={styles.quickIcon}>🎁</div>
          <div><p className={styles.quickTitle}>Discount Code</p><p className={styles.quickSub}>GLOWUP10 · 10% off first order</p></div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {[1,2,3].map(i => <div key={i} style={{ height:80, background:"var(--surface)", borderRadius:12, animation:"pulse 1.5s ease infinite" }} />)}
    </div>
  );
}
function ErrorState({ msg }) {
  return <div style={{ color:"var(--red)", padding:20, background:"rgba(239,68,68,0.08)", borderRadius:12 }}>⚠️ {msg}</div>;
}
