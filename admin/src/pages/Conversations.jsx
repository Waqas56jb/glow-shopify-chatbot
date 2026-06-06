import { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import styles from "./Conversations.module.css";

function fmt(iso) {
  const d = new Date(iso);
  const diff = (Date.now() - d) / 1000;
  if (diff < 60)    return "just now";
  if (diff < 3600)  return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return d.toLocaleDateString("en-US", { month:"short", day:"numeric" });
}

export default function Conversations() {
  const { get } = useApi();
  const [convs,    setConvs]    = useState([]);
  const [active,   setActive]   = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [msgLoad,  setMsgLoad]  = useState(false);
  const [search,   setSearch]   = useState("");
  const [error,    setError]    = useState("");

  useEffect(() => {
    get("/api/conversations?limit=60")
      .then((d) => { setConvs(d.conversations); if (d.conversations.length) selectConv(d.conversations[0]); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const selectConv = async (conv) => {
    setActive(conv);
    setMsgLoad(true);
    try {
      const d = await get(`/api/conversations/${conv.id}`);
      setMessages(d.messages || []);
    } catch {
      setMessages([]);
    } finally {
      setMsgLoad(false);
    }
  };

  const filtered = convs.filter((c) => {
    if (!search) return true;
    return (c.customer_name || "").toLowerCase().includes(search.toLowerCase()) ||
           (c.customer_email || "").toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className={styles.page}>
      <div className={styles.listPanel}>
        <div className={styles.listHeader}>
          <h3 className={styles.listTitle}>Conversations</h3>
          <input className={styles.search} placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className={styles.list}>
          {loading ? (
            <p style={{padding:"20px",color:"var(--text-muted)",fontSize:13}}>Loading…</p>
          ) : error ? (
            <p style={{padding:"20px",color:"var(--red)",fontSize:13}}>⚠️ {error}</p>
          ) : filtered.length === 0 ? (
            <p style={{padding:"20px",color:"var(--text-muted)",fontSize:13}}>No conversations yet.</p>
          ) : filtered.map((conv) => (
            <div
              key={conv.id}
              className={`${styles.listItem} ${active?.id === conv.id ? styles.listItemActive : ""}`}
              onClick={() => selectConv(conv)}
            >
              <div className={styles.listAvatar}>{(conv.customer_name || conv.customer_email || "?")[0].toUpperCase()}</div>
              <div className={styles.listMeta}>
                <div className={styles.listTop}>
                  <span className={styles.listName}>{conv.customer_name || conv.customer_email || "Anonymous"}</span>
                  <span className={styles.listTime}>{fmt(conv.updated_at)}</span>
                </div>
                <p className={styles.listPreview}>{conv.last_message || "No messages yet"}</p>
              </div>
              <span className={styles.statusDot} style={{ background: conv.status === "active" ? "var(--green)" : "var(--text-dim)" }} />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.chatPanel}>
        {!active ? (
          <div className={styles.empty}>Select a conversation to view chat history</div>
        ) : (
          <>
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderAvatar}>{(active.customer_name || active.customer_email || "?")[0].toUpperCase()}</div>
              <div>
                <p className={styles.chatHeaderName}>{active.customer_name || "Anonymous"}</p>
                <p className={styles.chatHeaderEmail}>{active.customer_email || "No email captured"}</p>
              </div>
              <div style={{display:"flex",gap:10,alignItems:"center",marginLeft:"auto"}}>
                <span style={{fontSize:11,color:"var(--text-muted)"}}>{active.message_count || 0} messages</span>
                <span
                  className={styles.statusBadge}
                  style={{
                    background: active.status === "active" ? "rgba(34,197,94,0.12)" : "rgba(90,82,72,0.2)",
                    color:      active.status === "active" ? "var(--green)"          : "var(--text-muted)",
                  }}
                >
                  {active.status}
                </span>
              </div>
            </div>

            <div className={styles.messages}>
              {msgLoad ? (
                <p style={{color:"var(--text-muted)",fontSize:13,padding:16}}>Loading messages…</p>
              ) : messages.length === 0 ? (
                <p style={{color:"var(--text-muted)",fontSize:13,padding:16}}>No messages in this conversation.</p>
              ) : messages.map((msg, i) => (
                <div key={i} className={`${styles.msgRow} ${msg.role === "user" ? styles.msgUser : styles.msgBot}`}>
                  {msg.role === "assistant" && <div className={styles.botAvatar}>G</div>}
                  <div className={`${styles.bubble} ${msg.role === "user" ? styles.bubbleUser : styles.bubbleBot}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
