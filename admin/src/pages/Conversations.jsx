import { useState } from "react";
import { conversations } from "../data/mockData";
import styles from "./Conversations.module.css";

export default function Conversations() {
  const [active, setActive] = useState(conversations[0]);
  const [search, setSearch] = useState("");

  const filtered = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.preview.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      {/* List panel */}
      <div className={styles.listPanel}>
        <div className={styles.listHeader}>
          <h3 className={styles.listTitle}>All Conversations</h3>
          <div className={styles.searchWrap}>
            <input
              className={styles.search}
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.list}>
          {filtered.map((conv) => (
            <div
              key={conv.id}
              className={`${styles.listItem} ${active?.id === conv.id ? styles.listItemActive : ""}`}
              onClick={() => setActive(conv)}
            >
              <div className={styles.listAvatar}>{conv.name[0]}</div>
              <div className={styles.listMeta}>
                <div className={styles.listTop}>
                  <span className={styles.listName}>{conv.name}</span>
                  <span className={styles.listTime}>{conv.time}</span>
                </div>
                <p className={styles.listPreview}>{conv.preview}</p>
              </div>
              <span
                className={styles.statusDot}
                style={{ background: conv.status === "active" ? "var(--green)" : "var(--text-dim)" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Chat panel */}
      <div className={styles.chatPanel}>
        {active ? (
          <>
            <div className={styles.chatHeader}>
              <div className={styles.chatHeaderAvatar}>{active.name[0]}</div>
              <div>
                <p className={styles.chatHeaderName}>{active.name}</p>
                <p className={styles.chatHeaderEmail}>{active.email}</p>
              </div>
              <span
                className={styles.statusBadge}
                style={{
                  background: active.status === "active" ? "rgba(34,197,94,0.12)" : "rgba(90,82,72,0.2)",
                  color: active.status === "active" ? "var(--green)" : "var(--text-muted)",
                }}
              >
                {active.status}
              </span>
            </div>

            <div className={styles.messages}>
              {active.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`${styles.msgRow} ${msg.role === "user" ? styles.msgUser : styles.msgBot}`}
                >
                  {msg.role === "assistant" && (
                    <div className={styles.botAvatar}>G</div>
                  )}
                  <div className={`${styles.bubble} ${msg.role === "user" ? styles.bubbleUser : styles.bubbleBot}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className={styles.empty}>Select a conversation</div>
        )}
      </div>
    </div>
  );
}
