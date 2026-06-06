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
  try {
    const { message, session_id, customer_name, customer_email } = req.body;

    if (!message || !session_id) {
      return res.status(400).json({ error: "message and session_id are required" });
    }

    // 1. Upsert conversation
    let convId, prevCount = 0;
    const { data: existing } = await supabase
      .from("conversations")
      .select("id, message_count")
      .eq("session_id", session_id)
      .maybeSingle();

    if (existing) {
      convId    = existing.id;
      prevCount = existing.message_count || 0;
    } else {
      const { data: created, error: cErr } = await supabase
        .from("conversations")
        .insert({ session_id, customer_name: customer_name || null, customer_email: customer_email || null })
        .select("id")
        .single();
      if (cErr) throw cErr;
      convId = created.id;
    }

    // 2. Fetch last MEMORY_LIMIT messages
    const { data: history } = await supabase
      .from("messages")
      .select("role, content")
      .eq("session_id", session_id)
      .order("created_at", { ascending: true })
      .limit(MEMORY_LIMIT);

    // 3. Fetch live products from DB (cached 5 min)
    const products = await getProducts();

    // 4. Build prompt + context
    const systemPrompt = buildSystemPrompt(products);
    const contextMessages = [
      { role: "system",  content: systemPrompt },
      ...(history || []).map((m) => ({ role: m.role, content: m.content })),
      { role: "user",    content: message },
    ];

    // 5. Call OpenAI
    const completion = await openai.chat.completions.create({
      model: MODEL, messages: contextMessages, max_tokens: MAX_TOKENS, temperature: TEMPERATURE,
    });
    const reply = completion.choices[0]?.message?.content || "";

    // 6. Persist messages + update conversation
    if (convId) {
      await supabase.from("messages").insert([
        { conversation_id: convId, session_id, role: "user",      content: message },
        { conversation_id: convId, session_id, role: "assistant", content: reply   },
      ]);

      const updatePayload = {
        message_count: prevCount + 2,
        last_message:  message.substring(0, 120),
        updated_at:    new Date().toISOString(),
      };
      if (customer_name)  updatePayload.customer_name  = customer_name;
      if (customer_email) updatePayload.customer_email = customer_email;

      await supabase.from("conversations").update(updatePayload).eq("id", convId);
    }

    res.json({ reply, session_id });
  } catch (err) {
    console.error("Chat error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
