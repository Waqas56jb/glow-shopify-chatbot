import { useState } from "react";
import { leads } from "../data/mockData";
import styles from "./Leads.module.css";

const STATUS_COLORS = {
  new:       { bg: "rgba(212,175,55,0.12)", color: "#d4af37"  },
  contacted: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6"  },
  converted: { bg: "rgba(34,197,94,0.12)",  color: "#22c55e"  },
};

export default function Leads() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = leads.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.product.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || l.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className={styles.page}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <SearchIcon />
          <input
            className={styles.search}
            placeholder="Search by name, email or product…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          {["all", "new", "contacted", "converted"].map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.active : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.count}>{filtered.length} leads found</p>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Interested In</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((lead) => (
              <tr key={lead.id}>
                <td className={styles.idCell}>{lead.id}</td>
                <td className={styles.nameCell}>{lead.name}</td>
                <td className={styles.mutedCell}>{lead.email}</td>
                <td className={styles.mutedCell}>{lead.phone}</td>
                <td>{lead.product}</td>
                <td>
                  <span className={styles.badge} style={STATUS_COLORS[lead.status]}>
                    {lead.status}
                  </span>
                </td>
                <td className={styles.mutedCell}>{lead.date}</td>
                <td>
                  <button
                    className={styles.viewBtn}
                    onClick={() => setSelected(lead)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div className={styles.drawerOverlay} onClick={() => setSelected(null)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h3>Lead Details</h3>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className={styles.drawerBody}>
              <div className={styles.drawerAvatar}>{selected.name[0]}</div>
              <h4 className={styles.drawerName}>{selected.name}</h4>
              <p className={styles.drawerSub}>{selected.email}</p>
              <div className={styles.detailGrid}>
                <DetailRow label="Phone"    value={selected.phone} />
                <DetailRow label="Product"  value={selected.product} />
                <DetailRow label="Status"   value={selected.status} />
                <DetailRow label="Date"     value={selected.date} />
              </div>
              <div className={styles.drawerActions}>
                <button className={styles.actionBtnPrimary}>Mark Contacted</button>
                <button className={styles.actionBtnGold}>Mark Converted</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "3px" }}>{label}</p>
      <p style={{ fontSize: "13.5px", color: "var(--text)", fontWeight: 500 }}>{value}</p>
    </div>
  );
}

function SearchIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0, color:"var(--text-dim)"}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
