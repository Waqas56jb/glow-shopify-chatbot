const express = require("express");
const router = express.Router();
const supabase = require("../db");
const adminAuth = require("../middleware/adminAuth");

// GET /api/stats  — dashboard stats
router.get("/", adminAuth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      { count: totalLeads },
      { count: newLeadsToday },
      { count: totalConversations },
      { count: activeConversations },
      { count: totalOrders },
      { count: pendingOrders },
      { count: totalMessages },
    ] = await Promise.all([
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", today.toISOString()),
      supabase.from("conversations").select("*", { count: "exact", head: true }),
      supabase.from("conversations").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("order_inquiries").select("*", { count: "exact", head: true }),
      supabase.from("order_inquiries").select("*", { count: "exact", head: true }).eq("inquiry_status", "pending"),
      supabase.from("messages").select("*", { count: "exact", head: true }),
    ]);

    // Conversion rate = leads / conversations
    const conversionRate = totalConversations > 0
      ? ((totalLeads / totalConversations) * 100).toFixed(1) + "%"
      : "0%";

    // Recent leads (last 5)
    const { data: recentLeads } = await supabase
      .from("leads")
      .select("id, name, email, product_interest, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5);

    // Recent conversations (last 5)
    const { data: recentConversations } = await supabase
      .from("conversations")
      .select("id, customer_name, customer_email, last_message, message_count, status, created_at")
      .order("updated_at", { ascending: false })
      .limit(5);

    res.json({
      stats: {
        totalLeads:          totalLeads          || 0,
        newLeadsToday:       newLeadsToday       || 0,
        totalConversations:  totalConversations  || 0,
        activeConversations: activeConversations || 0,
        totalOrders:         totalOrders         || 0,
        pendingOrders:       pendingOrders       || 0,
        totalMessages:       totalMessages       || 0,
        conversionRate,
      },
      recentLeads:         recentLeads         || [],
      recentConversations: recentConversations || [],
    });
  } catch (err) {
    console.error("Stats error:", err.message);
    // Return zeroed stats so admin dashboard renders even when DB is down
    res.json({
      stats: {
        totalLeads: 0, newLeadsToday: 0, totalConversations: 0,
        activeConversations: 0, totalOrders: 0, pendingOrders: 0,
        totalMessages: 0, conversionRate: "0%",
      },
      recentLeads: [],
      recentConversations: [],
      _warning: err.message,
    });
  }
});

module.exports = router;
