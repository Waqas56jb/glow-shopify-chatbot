const express = require("express");
const router = express.Router();
const supabase = require("../db");
const adminAuth = require("../middleware/adminAuth");

// POST /api/leads  — public (called by chatbot when lead captured)
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, product_interest, session_id } = req.body;
    if (!email) return res.status(400).json({ error: "email is required" });

    // Get conversation id if session provided
    let conversation_id = null;
    if (session_id) {
      const { data: conv } = await supabase
        .from("conversations")
        .select("id")
        .eq("session_id", session_id)
        .maybeSingle();
      conversation_id = conv?.id || null;
    }

    // Upsert lead (same email = update)
    const { data, error } = await supabase
      .from("leads")
      .upsert(
        { name, email, phone, product_interest, conversation_id, source: "chatbot" },
        { onConflict: "email" }
      )
      .select()
      .single();

    if (error) throw error;

    // Mark conversation lead_captured
    if (conversation_id) {
      await supabase
        .from("conversations")
        .update({ lead_captured: true, customer_name: name || undefined, customer_email: email })
        .eq("id", conversation_id);
    }

    res.json({ success: true, lead: data });
  } catch (err) {
    console.error("Lead save error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/leads/order  — capture order intent from chatbot
router.post("/order", async (req, res) => {
  try {
    const { session_id, order_number, customer_email, product, size, name, phone, address } = req.body;

    let conversation_id = null;
    if (session_id) {
      const { data: conv } = await supabase
        .from("conversations")
        .select("id")
        .eq("session_id", session_id)
        .maybeSingle();
      conversation_id = conv?.id || null;
    }

    const { data, error } = await supabase
      .from("order_inquiries")
      .insert({
        conversation_id,
        session_id,
        order_number: order_number || null,
        customer_email,
        inquiry_status: "pending",
        shopify_response: { product, size, name, phone, address },
      })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, inquiry: data });
  } catch (err) {
    console.error("Order capture error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── Admin routes (require auth) ────────────────────────────────────────────

// GET /api/leads  — all leads
router.get("/", adminAuth, async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (status && status !== "all") query = query.eq("status", status);
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,product_interest.ilike.%${search}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ leads: data || [] });
  } catch (err) {
    res.json({ leads: [], _warning: err.message });
  }
});

// PATCH /api/leads/:id  — update status
router.patch("/:id", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase
      .from("leads")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ lead: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/leads/:id
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const { error } = await supabase.from("leads").delete().eq("id", req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
