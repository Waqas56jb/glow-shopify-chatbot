import { useState } from "react";
import { orders } from "../data/mockData";
import styles from "./Orders.module.css";

const STATUS_COLORS = {
  pending:    { bg: "rgba(212,175,55,0.12)", color: "#d4af37"  },
  processing: { bg: "rgba(59,130,246,0.12)", color: "#3b82f6"  },
  shipped:    { bg: "rgba(168,85,247,0.12)", color: "#a855f7"  },
  delivered:  { bg: "rgba(34,197,94,0.12)",  color: "#22c55e"  },
};

export default function Orders() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || o.status === filter;
    return matchSearch && matchFilter;
  });

  const total = filtered.reduce((sum, o) => sum + parseFloat(o.amount.replace("$", "")), 0);

  return (
    <div className={styles.page}>
      {/* Summary */}
      <div className={styles.summaryRow}>
        {["pending", "processing", "shipped", "delivered"].map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          return (
            <div key={s} className={styles.summaryCard}>
              <p className={styles.summaryCount}>{count}</p>
              <p className={styles.summaryLabel} style={{ color: STATUS_COLORS[s].color }}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </p>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <input
            className={styles.search}
            placeholder="Search by customer, order ID or product…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          {["all", "pending", "processing", "shipped", "delivered"].map((f) => (
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

      <div className={styles.tableInfo}>
        <span>{filtered.length} orders</span>
        <span className={styles.totalAmount}>Total: <strong>${total.toFixed(2)}</strong></span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id}>
                <td className={styles.idCell}>{order.id}</td>
                <td className={styles.nameCell}>{order.customer}</td>
                <td className={styles.mutedCell}>{order.email}</td>
                <td>{order.product}</td>
                <td className={styles.amountCell}>{order.amount}</td>
                <td>
                  <span className={styles.badge} style={STATUS_COLORS[order.status]}>
                    {order.status}
                  </span>
                </td>
                <td className={styles.mutedCell}>{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
