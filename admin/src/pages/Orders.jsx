import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import styles from "./Orders.module.css";

const STATUS_COLORS = {
  pending:   { bg: "rgba(212,175,55,0.12)", color: "#d4af37" },
  processed: { bg: "rgba(34,197,94,0.12)",  color: "#22c55e" },
  cancelled: { bg: "rgba(239,68,68,0.12)",  color: "#ef4444" },
};

function fmt(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtTime(iso) {
  const d = (Date.now() - new Date(iso)) / 1000;
  if (d < 60)    return "just now";
  if (d < 3600)  return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return fmt(iso);
}

export default function Orders() {
  const { get, patch } = useApi();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");
  const [selected,setSelected]= useState(null);

  useEffect(() => {
    get("/api/conversations/orders/all")
      .then((d) => setOrders(d.orders || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await patch(`/api/conversations/orders/${id}`, { status });
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, inquiry_status: status } : o));
      if (selected?.id === id) setSelected((s) => ({ ...s, inquiry_status: status }));
    } catch (e) {
      alert("Update failed: " + e.message);
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch = !search ||
      (o.customer_email || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.order_number   || "").toLowerCase().includes(search.toLowerCase()) ||
      JSON.stringify(o.shopify_response || {}).toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || o.inquiry_status === filter;
    return matchSearch && matchFilter;
  });

  const shopify = (o) => o.shopify_response || {};

  return (
    <div className={styles.page}>
      {/* Summary */}
      <div className={styles.summaryRow}>
        {["pending", "processed", "cancelled"].map((s) => (
          <div key={s} className={styles.summaryCard}>
            <p className={styles.summaryCount}>{orders.filter((o) => o.inquiry_status === s).length}</p>
            <p className={styles.summaryLabel} style={{ color: STATUS_COLORS[s]?.color || "var(--text-muted)" }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </p>
          </div>
        ))}
        <div className={styles.summaryCard}>
          <p className={styles.summaryCount}>{orders.length}</p>
          <p className={styles.summaryLabel} style={{ color: "var(--text-muted)" }}>Total</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <input className={styles.search} placeholder="Search email, order number, product…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className={styles.filters}>
          {["all", "pending", "processed", "cancelled"].map((f) => (
            <button key={f} className={`${styles.filterBtn} ${filter === f ? styles.active : ""}`} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className={styles.stateMsg}>Loading order inquiries…</p>
      ) : error ? (
        <p className={styles.errorMsg}>⚠️ {error}</p>
      ) : (
        <>
          <p className={styles.tableInfo}>{filtered.length} order inquir{filtered.length !== 1 ? "ies" : "y"}</p>
          <div className={styles.tableWrap}>
            {filtered.length === 0 ? (
              <p className={styles.emptyMsg}>No order inquiries yet. They appear here when customers express purchase intent in the chatbot.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Size</th>
                    <th>Status</th>
                    <th>Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <div className={styles.nameCell}>{shopify(o).name || "—"}</div>
                        <div className={styles.mutedCell}>{o.customer_email || shopify(o).email || "—"}</div>
                      </td>
                      <td>{shopify(o).product || o.order_number || "—"}</td>
                      <td className={styles.mutedCell}>{shopify(o).size || "—"}</td>
                      <td>
                        <span className={styles.badge} style={STATUS_COLORS[o.inquiry_status] || STATUS_COLORS.pending}>
                          {o.inquiry_status}
                        </span>
                      </td>
                      <td className={styles.mutedCell}>{fmtTime(o.created_at)}</td>
                      <td>
                        <button className={styles.viewBtn} onClick={() => setSelected(o)}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* Detail drawer */}
      {selected && (
        <div className={styles.drawerOverlay} onClick={() => setSelected(null)}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h3>Order Inquiry Details</h3>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className={styles.drawerBody}>
              <div className={styles.detailGrid}>
                {[
                  ["Name",        shopify(selected).name    || "—"],
                  ["Email",       selected.customer_email   || shopify(selected).email || "—"],
                  ["Phone",       shopify(selected).phone   || "—"],
                  ["Product",     shopify(selected).product || selected.order_number || "—"],
                  ["Size",        shopify(selected).size    || "—"],
                  ["Address",     shopify(selected).address || "—"],
                  ["Status",      selected.inquiry_status],
                  ["Date",        fmt(selected.created_at)],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p className={styles.detailLabel}>{l}</p>
                    <p className={styles.detailValue} style={l==="Status"?{textTransform:"capitalize"}:{}}>{v}</p>
                  </div>
                ))}
              </div>
              <div className={styles.drawerActions}>
                <button className={styles.actionBtnGold}    onClick={() => updateStatus(selected.id, "processed")}>Mark Processed</button>
                <button className={styles.actionBtnPrimary} onClick={() => updateStatus(selected.id, "cancelled")}>Mark Cancelled</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
