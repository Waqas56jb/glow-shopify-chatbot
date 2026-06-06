import { stats, recentLeads } from "../data/mockData";
import styles from "./Dashboard.module.css";

const STAT_CARDS = [
  { label: "Total Leads",       value: stats.totalLeads,         sub: `+${stats.newLeadsToday} today`,       color: "gold",  icon: "👥" },
  { label: "Conversations",     value: stats.totalConversations, sub: `${stats.activeToday} active today`,   color: "blue",  icon: "💬" },
  { label: "Orders",            value: stats.totalOrders,        sub: `${stats.pendingOrders} pending`,      color: "green", icon: "📦" },
  { label: "Conversion Rate",   value: stats.conversionRate,     sub: "leads → orders",                      color: "purple",icon: "📈" },
];

const STATUS_COLORS = {
  new:       { bg: "rgba(212,175,55,0.12)", color: "#d4af37"  },
  contacted: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6"  },
  converted: { bg: "rgba(34,197,94,0.12)",  color: "#22c55e"  },
};

export default function Dashboard() {
  return (
    <div className={styles.page}>
      <p className={styles.subtitle}>Welcome back, Waqas 👋  Here's what's happening today.</p>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {STAT_CARDS.map((card) => (
          <div key={card.label} className={`${styles.statCard} ${styles[card.color]}`}>
            <div className={styles.statIcon}>{card.icon}</div>
            <div className={styles.statBody}>
              <p className={styles.statValue}>{card.value}</p>
              <p className={styles.statLabel}>{card.label}</p>
              <p className={styles.statSub}>{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Recent Leads</h3>
          <a href="/leads" className={styles.seeAll}>See all →</a>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Interested In</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {recentLeads.map((lead) => (
                <tr key={lead.id}>
                  <td className={styles.nameCell}>{lead.name}</td>
                  <td className={styles.mutedCell}>{lead.email}</td>
                  <td>{lead.product}</td>
                  <td>
                    <span
                      className={styles.badge}
                      style={STATUS_COLORS[lead.status]}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className={styles.mutedCell}>{lead.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className={styles.quickGrid}>
        <div className={styles.quickCard}>
          <div className={styles.quickIcon}>🤖</div>
          <div>
            <p className={styles.quickTitle}>Chatbot Status</p>
            <p className={styles.quickSub}>Online · Responding normally</p>
          </div>
          <span className={styles.onlineDot} />
        </div>
        <div className={styles.quickCard}>
          <div className={styles.quickIcon}>📧</div>
          <div>
            <p className={styles.quickTitle}>Newsletter Signups</p>
            <p className={styles.quickSub}>43 emails collected this week</p>
          </div>
        </div>
        <div className={styles.quickCard}>
          <div className={styles.quickIcon}>🎁</div>
          <div>
            <p className={styles.quickTitle}>Discount Code</p>
            <p className={styles.quickSub}>GLOWUP10 · Used 28 times</p>
          </div>
        </div>
      </div>
    </div>
  );
}
