-- ============================================================
-- Settings table — run this in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS settings (
  id               TEXT PRIMARY KEY DEFAULT 'global',
  openai_api_key   TEXT,                          -- encrypted in transit; stored server-side only
  widget_enabled   BOOLEAN   DEFAULT true,
  widget_icon      TEXT      DEFAULT 'bubble',
  color_primary    TEXT      DEFAULT '#d4af37',   -- gold
  color_bg         TEXT      DEFAULT '#f5f0eb',   -- warm cream
  color_user_bubble TEXT     DEFAULT '#1a1a1a',   -- black
  color_bot_bubble TEXT      DEFAULT '#ffffff',   -- white
  color_send_btn   TEXT      DEFAULT '#c9a84c',   -- gold button
  color_header_bg  TEXT      DEFAULT '#1a1a1a',   -- dark header
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- Insert default row (only once)
INSERT INTO settings (id)
VALUES ('global')
ON CONFLICT (id) DO NOTHING;
