require("dotenv").config();

const express = require("express");
const cors    = require("cors");
require("./db"); // validate env vars on startup

const app = express();

// Allow ALL origins — open public API
app.use(cors());
app.options("*", cors()); // handle preflight for every route

app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────
app.use("/api/chat",          require("./routes/chat"));
app.use("/api/leads",         require("./routes/leads"));
app.use("/api/conversations", require("./routes/conversations"));
app.use("/api/stats",         require("./routes/stats"));
app.use("/api/products",      require("./routes/products"));

// ── Health ────────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", db: "supabase", timestamp: new Date().toISOString() });
});

// ── 404 ───────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: "Route not found" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
