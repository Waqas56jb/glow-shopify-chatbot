require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const supabase = require("./db"); // initialises & validates env vars

const app = express();

app.use(cors({
  origin:  process.env.ALLOWED_ORIGIN || "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────
app.use("/api/chat",          require("./routes/chat"));
app.use("/api/leads",         require("./routes/leads"));
app.use("/api/conversations", require("./routes/conversations"));
app.use("/api/stats",         require("./routes/stats"));

// ── Health ────────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", db: "supabase", timestamp: new Date().toISOString() });
});

// ── 404 ───────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: "Route not found" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
