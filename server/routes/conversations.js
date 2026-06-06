const express = require("express");
const router = express.Router();
const supabase = require("../db");
const adminAuth = require("../middleware/adminAuth");

// All conversation routes require admin auth

// GET /api/conversations
router.get("/", adminAuth, async (req, res) => {
  try {
    const { status, search, limit = 50 } = req.query;
    let query = supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(parseInt(limit));

    if (status && status !== "all") query = query.eq("status", status);
    if (search) {
      query = query.or(
        `customer_name.ilike.%${search}%,customer_email.ilike.%${search}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json({ conversations: data || [] });
  } catch (err) {
    res.json({ conversations: [], _warning: err.message });
  }
});

// GET /api/conversations/:id  — with messages
router.get("/:id", adminAuth, async (req, res) => {
  try {
    const { data: conv, error: convErr } = await supabase
      .from("conversations")
      .select("*")
      .eq("id", req.params.id)
      .single();
    if (convErr) throw convErr;

    const { data: messages, error: msgErr } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", req.params.id)
      .order("created_at", { ascending: true });
    if (msgErr) throw msgErr;

    res.json({ conversation: conv, messages: messages || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/conversations/:id
router.patch("/:id", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase
      .from("conversations")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ conversation: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/conversations/orders/all  — order inquiries
router.get("/orders/all", adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("order_inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.json({ orders: data || [] });
  } catch (err) {
    res.json({ orders: [], _warning: err.message });
  }
});

// PATCH /api/conversations/orders/:id  — update order inquiry status
router.patch("/orders/:id", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase
      .from("order_inquiries")
      .update({ inquiry_status: status })
      .eq("id", req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ order: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
