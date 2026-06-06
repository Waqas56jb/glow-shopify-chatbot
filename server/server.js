require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const supabase = require("./db"); // initialises & validates env vars

const app = express();

// Support comma-separated list of allowed origins
// e.g. ALLOWED_ORIGIN=https://client.vercel.app,https://admin.vercel.app
const RAW_ORIGINS = process.env.ALLOWED_ORIGIN || "";
const ALLOWED_ORIGINS = RAW_ORIGINS
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow curl / Postman / server-to-server (no origin header)
      if (!origin) return callback(null, true);
      // Allow all if no whitelist configured
      if (ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes("*"))
        return callback(null, true);
      // Allow whitelisted origins
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      callback(new Error("CORS: origin not allowed — " + origin));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
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
