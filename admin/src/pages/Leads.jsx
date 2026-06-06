import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import styles from "./Leads.module.css";

const STATUS_COLORS = {
  new:       { bg: "rgba(212,175,55,0.12)", color: "#d4af37"  },
  contacted: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6"  },
  converted: { bg: "rgba(34,197,94,0.12)",  color: "#22c55e"  },
};

function fmt(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
}

export default function Leads() {
  const { get, patch, remove } = useApi();
  const [leads,   setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");
  const [selected,setSelected]= useState(null);

  const fetchLeads = () => {
    setLoading(true);
    let url = `/api/leads?`;
    if (filter !== "all") url += `status=${filter}&`;
    if (search) url += `search=${encodeURIComponent(search)}`;
    get(url)
      .then((d) => setLeads(d.leads))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(fetchLeads, [filter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLeads();
  };

  const updateStatus = async (id, status) => {
    await patch(`/api/leads/${id}`, { status });
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    if (selected?.id === id) setSelected((s) => ({ ...s, status }));
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    await remove(`/api/leads/${id}`);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className={styles.page}>
      <form className={styles.toolbar} onSubmit={handleSearch}>
        <div className={styles.searchWrap}>
          <SearchIcon />
          <input
            className={styles.search}
            placeholder="Search name, email or product…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          {["all","new","contacted","converted"].map((f) => (
            <button
              key={f} type="button"
              className={`${styles.filterBtn} ${filter === f ? styles.active : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button type="submit" className={styles.searchBtn}>Search</button>
      </form>

      {loading ? (
        <p className={styles.stateMsg}>Loading leads…</p>
      ) : error ? (
        <p className={styles.errorMsg}>⚠️ {error}</p>
      ) : (
        <>
          <p className={styles.count}>{leads.length} lead{leads.length !== 1 ? "s" : ""} found</p>
          <div className={styles.tableWrap}>
            {leads.length === 0 ? (
              <p className={styles.emptyMsg}>No leads yet. Chatbot captures them automatically 🤖</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr><th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Interested In</th><th>Status</th><th>Date</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {leads.map((lead, i) => (
                    <tr key={lead.id}>
                      <td className={styles.idCell}>{i + 1}</td>
                      <td className={styles.nameCell}>{lead.name || "—"}</td>
                      <td className={styles.mutedCell}>{lead.email}</td>
                      <td className={styles.mutedCell}>{lead.phone || "—"}</td>
                      <td>{lead.product_interest || "—"}</td>
                      <td><span className={styles.badge} style={STATUS_COLORS[lead.status] || STATUS_COLORS.new}>{lead.status}</span></td>
                      <td className={styles.mutedCell}>{fmt(lead.created_at)}</td>
                      <td><button className={styles.viewBtn} onClick={() => setSelected(lead)}>View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {selected && (
        <div className={styles.drawerOverlay} onClick={() => setSelected(null)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h3>Lead Details</h3>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className={styles.drawerBody}>
              <div className={styles.drawerAvatar}>{(selected.name || selected.email)[0].toUpperCase()}</div>
              <h4 className={styles.drawerName}>{selected.name || "Unknown"}</h4>
              <p className={styles.drawerSub}>{selected.email}</p>
              <div className={styles.detailGrid}>
                {[
                  ["Phone",    selected.phone || "—"],
                  ["Product",  selected.product_interest || "—"],
                  ["Status",   selected.status],
                  ["Date",     fmt(selected.created_at)],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p style={{fontSize:"10px",color:"var(--text-muted)",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:"3px"}}>{l}</p>
                    <p style={{fontSize:"13.5px",color:"var(--text)",fontWeight:500,textTransform:"capitalize"}}>{v}</p>
                  </div>
                ))}
              </div>
              <div className={styles.drawerActions}>
                <button className={styles.actionBtnPrimary} onClick={() => updateStatus(selected.id, "contacted")}>Mark Contacted</button>
                <button className={styles.actionBtnGold}    onClick={() => updateStatus(selected.id, "converted")}>Mark Converted</button>
                <button className={styles.actionBtnDelete}  onClick={() => deleteLead(selected.id)}>Delete Lead</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0,color:"var(--text-dim)"}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
