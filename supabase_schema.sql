-- ============================================================
--  GlowUp Goods — Complete Supabase Database Schema
--  Run this entire file in: Supabase → SQL Editor → New Query
-- ============================================================

-- ── 1. Enable UUID extension ────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ── 2. CONVERSATIONS ────────────────────────────────────────
--  One record per chat session (session_id from browser)
CREATE TABLE IF NOT EXISTS conversations (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id     TEXT        UNIQUE NOT NULL,
  customer_name  TEXT,
  customer_email TEXT,
  status         TEXT        DEFAULT 'active'  CHECK (status IN ('active', 'closed')),
  lead_captured  BOOLEAN     DEFAULT FALSE,
  message_count  INTEGER     DEFAULT 0,
  last_message   TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conv_session  ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conv_updated  ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conv_status   ON conversations(status);

ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;


-- ── 3. MESSAGES ─────────────────────────────────────────────
--  Full chat history. Last 20 pulled per session for AI context.
CREATE TABLE IF NOT EXISTS messages (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID        REFERENCES conversations(id) ON DELETE CASCADE,
  session_id      TEXT        NOT NULL,
  role            TEXT        NOT NULL CHECK (role IN ('user', 'assistant')),
  content         TEXT        NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_msg_session ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_msg_conv    ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_msg_time    ON messages(created_at ASC);

ALTER TABLE messages DISABLE ROW LEVEL SECURITY;


-- ── 4. LEADS ────────────────────────────────────────────────
--  Captured customer contacts (name + email) from chatbot.
CREATE TABLE IF NOT EXISTS leads (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id  UUID        REFERENCES conversations(id) ON DELETE SET NULL,
  name             TEXT,
  email            TEXT        NOT NULL UNIQUE,
  phone            TEXT,
  product_interest TEXT,
  discount_sent    BOOLEAN     DEFAULT FALSE,
  status           TEXT        DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted')),
  source           TEXT        DEFAULT 'chatbot',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_email  ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_time   ON leads(created_at DESC);

ALTER TABLE leads DISABLE ROW LEVEL SECURITY;


-- ── 5. ORDER INQUIRIES ──────────────────────────────────────
--  Saved when customer expresses purchase intent in chatbot.
CREATE TABLE IF NOT EXISTS order_inquiries (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id  UUID        REFERENCES conversations(id) ON DELETE SET NULL,
  session_id       TEXT,
  order_number     TEXT,
  customer_email   TEXT,
  inquiry_status   TEXT        DEFAULT 'pending' CHECK (inquiry_status IN ('pending', 'processed', 'cancelled')),
  shopify_response JSONB       DEFAULT '{}',   -- stores: product, size, name, phone, address
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON order_inquiries(inquiry_status);
CREATE INDEX IF NOT EXISTS idx_orders_email  ON order_inquiries(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_time   ON order_inquiries(created_at DESC);

ALTER TABLE order_inquiries DISABLE ROW LEVEL SECURITY;


-- ── 6. PRODUCTS ─────────────────────────────────────────────
--  Managed by admin. Used by chatbot to sell products dynamically.
CREATE TABLE IF NOT EXISTS products (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT        NOT NULL,
  price        TEXT        NOT NULL,
  description  TEXT,
  url          TEXT,                          -- full product page URL
  materials    TEXT,
  sizing_note  TEXT,                          -- shown by chatbot for size guidance
  important    TEXT,                          -- e.g. "EU/UK only"
  category     TEXT[]      DEFAULT '{}',      -- e.g. ['men', 'hoodie']
  sizes        TEXT[]      DEFAULT '{}',      -- e.g. ['S', 'M', 'L', 'XL']
  colors       TEXT[]      DEFAULT '{}',      -- e.g. ['Black', 'White', 'Gold']
  images       TEXT[]      DEFAULT '{}',      -- Supabase Storage public URLs (up to 4)
  in_stock     BOOLEAN     DEFAULT TRUE,
  featured     BOOLEAN     DEFAULT FALSE,     -- chatbot highlights featured products
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_stock    ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_time     ON products(created_at DESC);

ALTER TABLE products DISABLE ROW LEVEL SECURITY;


-- ============================================================
--  DONE ✅
--  After running this SQL, go to:
--  Supabase → Storage → New Bucket
--    Name   : product-images
--    Public : YES (toggle ON)
-- ============================================================
