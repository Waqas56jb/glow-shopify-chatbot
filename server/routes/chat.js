const express  = require("express");
const router   = express.Router();
const OpenAI   = require("openai");
const supabase  = require("../db");
const { buildSystemPrompt } = require("../prompt");
const { getProducts }       = require("../cache/productCache");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODEL        = "gpt-4o-mini";
const MAX_TOKENS   = 400;   // short = fast
const TEMPERATURE  = 0.7;
const MEMORY_LIMIT = 6;

// ── DB context (parallel-fetched, non-fatal) ─────────────────────────────
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
        .insert({
          session_id,
          customer_name:  customer_name  || null,
          customer_email: customer_email || null,
        })
        .select("id").single();
      if (created) convId = created.id;
    }
    history = (histRes.data || []).map((m) => ({ role: m.role, content: m.content }));
    dbOk = true;
  } catch (e) {
    console.warn("DB skip:", e.message);
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

// POST /api/chat
router.post("/", async (req, res) => {
  const { message, session_id, customer_name, customer_email } = req.body;

  if (!message || !session_id) {
    return res.status(400).json({ error: "message and session_id are required" });
  }
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY not configured" });
  }

  // Fetch DB context + product cache in parallel
  const [{ convId, prevCount, history, dbOk }, products] = await Promise.all([
    fetchDbContext(session_id, customer_name, customer_email),
    getProducts().catch(() => []),
  ]);

  const contextMessages = [
    { role: "system", content: buildSystemPrompt(products) },
    ...history,
    { role: "user", content: message },
  ];

  try {
    const completion = await openai.chat.completions.create({
      model:       MODEL,
      messages:    contextMessages,
      max_tokens:  MAX_TOKENS,
      temperature: TEMPERATURE,
    });

    const reply = completion.choices[0]?.message?.content || "";

    // Persist to DB (fire-and-forget)
    if (dbOk && convId) {
      persistAsync(convId, session_id, prevCount, message, reply, customer_name, customer_email);
    }

    return res.json({ reply, session_id });

  } catch (err) {
    console.error("OpenAI error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
