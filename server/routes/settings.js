const express   = require("express");
const router    = express.Router();
const supabase  = require("../db");
const adminAuth = require("../middleware/adminAuth");

const DEFAULT_SETTINGS = {
  widget_enabled:   true,
  widget_icon:      "bubble",
  color_primary:    "#d4af37",
  color_bg:         "#f5f0eb",
  color_user_bubble:"#1a1a1a",
  color_bot_bubble: "#ffffff",
  color_send_btn:   "#c9a84c",
  color_header_bg:  "#1a1a1a",
};

// GET /api/settings  — public (client + widget read colors & toggle)
// NOTE: openai_api_key is NEVER returned to the public
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("settings").select("*").eq("id", "global").single();
    if (error) throw error;

    const { openai_api_key: _hidden, ...safe } = data;
    return res.json({ settings: safe });
  } catch {
    return res.json({ settings: DEFAULT_SETTINGS });
  }
});

// GET /api/settings/admin  — admin only (includes key presence flag)
router.get("/admin", adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("settings").select("*").eq("id", "global").single();
    if (error) throw error;

    // Don't send the actual key — just whether it's set
    const { openai_api_key, ...rest } = data;
    return res.json({
      settings: {
        ...rest,
        openai_key_set:    !!openai_api_key,
        openai_key_source: openai_api_key
          ? "database"
          : process.env.OPENAI_API_KEY
            ? "environment"
            : "none",
      },
    });
  } catch {
    return res.json({
      settings: {
        ...DEFAULT_SETTINGS,
        openai_key_set:    !!process.env.OPENAI_API_KEY,
        openai_key_source: process.env.OPENAI_API_KEY ? "environment" : "none",
      },
    });
  }
});

// PUT /api/settings  — admin only
router.put("/", adminAuth, async (req, res) => {
  try {
    const {
      openai_api_key,
      widget_enabled, widget_icon,
      color_primary, color_bg, color_user_bubble,
      color_bot_bubble, color_send_btn, color_header_bg,
    } = req.body;

    const patch = {
      widget_enabled:    widget_enabled   !== undefined ? Boolean(widget_enabled) : undefined,
      widget_icon:       widget_icon       || undefined,
      color_primary:     color_primary     || undefined,
      color_bg:          color_bg          || undefined,
      color_user_bubble: color_user_bubble || undefined,
      color_bot_bubble:  color_bot_bubble  || undefined,
      color_send_btn:    color_send_btn    || undefined,
      color_header_bg:   color_header_bg   || undefined,
      updated_at:        new Date().toISOString(),
    };

    // Only save key if a non-empty value is provided
    if (openai_api_key && openai_api_key.trim()) {
      patch.openai_api_key = openai_api_key.trim();
    }

    // Remove undefined keys
    Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);

    const { data, error } = await supabase
      .from("settings")
      .upsert({ id: "global", ...patch })
      .select()
      .single();
    if (error) throw error;

    const { openai_api_key: _hidden, ...safe } = data;
    return res.json({ settings: safe, success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE openai key only
router.delete("/openai-key", adminAuth, async (req, res) => {
  try {
    await supabase.from("settings")
      .update({ openai_api_key: null, updated_at: new Date().toISOString() })
      .eq("id", "global");
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
