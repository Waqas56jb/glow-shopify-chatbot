const express = require("express");
const router  = express.Router();
const OpenAI  = require("openai");
const supabase = require("../db");
const { buildSystemPrompt } = require("../prompt");
const { getProducts }       = require("../cache/productCache");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODEL        = "gpt-4o-mini";
const MAX_TOKENS   = 1024;
const TEMPERATURE  = 0.72;
const MEMORY_LIMIT = 20;

// POST /api/chat
router.post("/", async (req, res) => {
  const { message, session_id, customer_name, customer_email } = req.body;

  if (!message || !session_id) {
    return res.status(400).json({ error: "message and session_id are required" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not configured on the server." });
  }

  // ── DB operations (non-fatal — chatbot works even if DB is down) ──────
  let convId     = null;
  let prevCount  = 0;
  let history    = [];
  let dbOk       = false;

  try {
    // Upsert conversation
    const { data: existing } = await supabase
      .from("conversations")
      .select("id, message_count")
      .eq("session_id", session_id)
      .maybeSingle();

    if (existing) {
      convId    = existing.id;
      prevCount = existing.message_count || 0;
    } else {
      const { data: created } = await supabase
        .from("conversations")
        .insert({ session_id, customer_name: customer_name || null, customer_email: customer_email || null })
        .select("id")
        .single();
      if (created) convId = created.id;
    }

    // Fetch history
    const { data: hist } = await supabase
      .from("messages")
      .select("role, content")
      .eq("session_id", session_id)
      .order("created_at", { ascending: true })
      .limit(MEMORY_LIMIT);

    history = (hist || []).map((m) => ({ role: m.role, content: m.content }));
    dbOk = true;
  } catch (dbErr) {
    console.warn("⚠️  DB unavailable — running without memory:", dbErr.message);
  }

  // ── Fetch products (non-fatal) ────────────────────────────────────────
  let products = [];
  try {
    products = await getProducts();
  } catch {
    // proceed without product catalog
  }

  // ── Build prompt + call OpenAI ────────────────────────────────────────
  try {
    const systemPrompt    = buildSystemPrompt(products);
    const contextMessages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user",   content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: MODEL, messages: contextMessages, max_tokens: MAX_TOKENS, temperature: TEMPERATURE,
    });

    const reply = completion.choices[0]?.message?.content || "";

    // ── Persist messages async (fire-and-forget if DB is ok) ─────────────
    if (dbOk && convId) {
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

    return res.json({ reply, session_id });

  } catch (aiErr) {
    console.error("OpenAI error:", aiErr.message);
    return res.status(500).json({ error: aiErr.message });
  }
});

module.exports = router;
