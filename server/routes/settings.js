const express   = require("express");
const router    = express.Router();
const supabase  = require("../db");
const adminAuth = require("../middleware/adminAuth");

const DEFAULT_SETTINGS = {
  widget_enabled:    true,
  widget_icon:       "bubble",
  color_primary:     "#d4af37",
  color_bg:          "#f5f0eb",
  color_user_bubble: "#1a1a1a",
  color_bot_bubble:  "#ffffff",
  color_send_btn:    "#c9a84c",
  color_header_bg:   "#1a1a1a",
  first_message:     "Hey! 👋 Welcome to GlowUp Goods — your personal stylist is here! What are you shopping for today? ✨",
  chatbot_tone:      "friendly",
};

const VALID_TONES = ["friendly", "professional", "luxury", "bold", "playful"];

// Mask an API key: show first 10 chars + **** + last 4 chars
function maskKey(key) {
  if (!key || key.length < 16) return "sk-****";
  return key.slice(0, 10) + "…" + key.slice(-4);
}

// GET /api/settings — public (client + widget: colors & toggle only, NO key)
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("settings").select("*").eq("id", "global").single();
    if (error) throw error;
    const { openai_api_key: _omit, ...safe } = data;
    return res.json({ settings: safe });
  } catch {
    return res.json({ settings: DEFAULT_SETTINGS });
  }
});

// GET /api/settings/admin — admin only (masked key preview + all settings)
router.get("/admin", adminAuth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("settings").select("*").eq("id", "global").single();
    if (error) throw error;

    const { openai_api_key, ...rest } = data;
    return res.json({
      settings: {
        ...rest,
        openai_key_set:     !!openai_api_key,
        openai_key_masked:  openai_api_key ? maskKey(openai_api_key) : null,
        openai_key_source:  openai_api_key
          ? "database"
          : process.env.OPENAI_API_KEY
            ? "environment"
            : "none",
        env_key_masked: process.env.OPENAI_API_KEY
          ? maskKey(process.env.OPENAI_API_KEY)
          : null,
      },
    });
  } catch {
    return res.json({
      settings: {
        ...DEFAULT_SETTINGS,
        openai_key_set:    !!process.env.OPENAI_API_KEY,
        openai_key_masked: null,
        openai_key_source: process.env.OPENAI_API_KEY ? "environment" : "none",
        env_key_masked:    process.env.OPENAI_API_KEY
          ? maskKey(process.env.OPENAI_API_KEY)
          : null,
      },
    });
  }
});

// PUT /api/settings — admin only
router.put("/", adminAuth, async (req, res) => {
  try {
    const {
      openai_api_key,
      widget_enabled, widget_icon,
      color_primary, color_bg, color_user_bubble,
      color_bot_bubble, color_send_btn, color_header_bg,
      first_message, chatbot_tone,
    } = req.body;

    // widget_enabled MUST be sent explicitly — never default to true
    const patch = {
      updated_at: new Date().toISOString(),
    };

    if (widget_enabled !== undefined) patch.widget_enabled = Boolean(widget_enabled);
    if (widget_icon)       patch.widget_icon       = widget_icon;
    if (color_primary)     patch.color_primary     = color_primary;
    if (color_bg)          patch.color_bg          = color_bg;
    if (color_user_bubble) patch.color_user_bubble = color_user_bubble;
    if (color_bot_bubble)  patch.color_bot_bubble  = color_bot_bubble;
    if (color_send_btn)    patch.color_send_btn    = color_send_btn;
    if (color_header_bg)   patch.color_header_bg   = color_header_bg;
    if (first_message !== undefined) patch.first_message = first_message.trim().slice(0, 500) || DEFAULT_SETTINGS.first_message;
    if (chatbot_tone && VALID_TONES.includes(chatbot_tone)) patch.chatbot_tone = chatbot_tone;

    // Save key only if non-empty and looks like a real key
    if (openai_api_key && openai_api_key.trim().length > 10) {
      patch.openai_api_key = openai_api_key.trim();
    }

    const { data, error } = await supabase
      .from("settings")
      .upsert({ id: "global", ...patch })
      .select()
      .single();
    if (error) throw error;

    // Return masked key info — never raw key
    const { openai_api_key: savedKey, ...rest } = data;
    return res.json({
      settings: {
        ...rest,
        openai_key_set:    !!savedKey,
        openai_key_masked: savedKey ? maskKey(savedKey) : null,
        openai_key_source: savedKey
          ? "database"
          : process.env.OPENAI_API_KEY ? "environment" : "none",
        env_key_masked: process.env.OPENAI_API_KEY
          ? maskKey(process.env.OPENAI_API_KEY)
          : null,
      },
      success: true,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/settings/openai-key — remove stored key from DB
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
