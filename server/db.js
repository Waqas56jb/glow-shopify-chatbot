require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL    = process.env.SUPABASE_URL;
const SUPABASE_SECRET = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SECRET_KEY env vars");
  // Don't throw — let routes fail gracefully with proper error messages
}

const supabase = createClient(
  SUPABASE_URL    || "https://placeholder.supabase.co",
  SUPABASE_SECRET || "placeholder"
);

module.exports = supabase;
