const express  = require("express");
const router   = express.Router();
const OpenAI   = require("openai");
const supabase  = require("../db");
const { buildSystemPrompt } = require("../prompt");
const { getProducts }       = require("../cache/productCache");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODEL        = "gpt-4o-mini";
const MAX_TOKENS   = 500;   // shorter = faster
const TEMPERATURE  = 0.7;
const MEMORY_LIMIT = 8;     // last 8 messages is enough

// ── helpers ──────────────────────────────────────────────────────────────────
async function fetchDbContext(session_id, customer_name, customer_email) {
  let convId = null, prevCount = 0, history = [], dbOk = false;
  try {
    const [existRes, histRes] = await Promise.all([
      supabase.from("conversations").select("id, message_count")
        .eq("session_id", session_id).maybeSingle(),
      supabase.from("messages").select("role, content")
        .eq("session_id", session_id)
        .order("created_at", { ascending: true }).limit(MEMORY_LIMIT),
    ]);

    if (existRes.data) {
      convId    = existRes.data.id;
      prevCount = existRes.data.message_count || 0;
    } else {
      const { data: created } = await supabase.from("conversations")
        .insert({ session_id, customer_name: customer_name || null, customer_email: customer_email || null })
        .select("id").single();
      if (created) convId = created.id;
    }
    history = (histRes.data || []).map((m) => ({ role: m.role, content: m.content }));
    dbOk = true;
  } catch (e) {
    console.warn("⚠️  DB skip:", e.message);
  }
  return { convId, prevCount, history, dbOk };
}

function persistAsync(convId, session_id, prevCount, message, reply, customer_name, customer_email) {
  supabase.from("messages").insert([
    { conversation_id: convId, session_id, role: "user",      content: message },
    { conversation_id: convId, session_id, role: "assistant", content: reply   },
  ]).then(() =>
    supabase.from("conversations").update({
      message_count: prevCount + 2,
      last_message:  message.substring(0, 120),
      updated_at:    new Date().toISOString(),
      ...(customer_name  ? { customer_name }  : {}),
      ...(customer_email ? { customer_email } : {}),
    }).eq("id", convId)
  ).catch((e) => console.warn("DB write failed:", e.message));
}

// ── POST /api/chat  (streaming SSE) ─────────────────────────────────────────
router.post("/", async (req, res) => {
  const { message, session_id, customer_name, customer_email } = req.body;

  if (!message || !session_id) {
    return res.status(400).json({ error: "message and session_id are required" });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY not configured" });
  }

  // Parallel: DB context + product cache
  const [{ convId, prevCount, history, dbOk }, products] = await Promise.all([
    fetchDbContext(session_id, customer_name, customer_email),
    getProducts().catch(() => []),
  ]);

  const contextMessages = [
    { role: "system", content: buildSystemPrompt(products) },
    ...history,
    { role: "user",   content: message },
  ];

  // ── SSE headers ────────────────────────────────────────────────────────────
  res.setHeader("Content-Type",  "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection",    "keep-alive");
  res.setHeader("X-Accel-Buffering", "no"); // disable Nginx buffering on Vercel

  let fullReply = "";

  try {
    const stream = await openai.chat.completions.create({
      model: MODEL, messages: contextMessages,
      max_tokens: MAX_TOKENS, temperature: TEMPERATURE,
      stream: true,
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content;
      if (token) {
        fullReply += token;
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      }
    }

    // Signal done + pass session_id
    res.write(`data: ${JSON.stringify({ done: true, session_id })}\n\n`);
    res.end();

    // Persist to DB in background
    if (dbOk && convId) {
      persistAsync(convId, session_id, prevCount, message, fullReply, customer_name, customer_email);
    }

  } catch (err) {
    console.error("OpenAI stream error:", err.message);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

module.exports = router;
