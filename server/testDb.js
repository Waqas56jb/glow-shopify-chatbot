require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

async function testConnection() {
  console.log("\n🔌 Testing Supabase connection...");
  console.log("   URL:", SUPABASE_URL);

  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    console.error("❌ Missing SUPABASE_URL or SUPABASE_SECRET_KEY in .env");
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

  // Ping the database with a lightweight RPC call
  const { data, error } = await supabase.rpc("version").maybeSingle();

  if (error) {
    // version() RPC may not exist — try a simple table list as fallback
    const { error: err2 } = await supabase
      .from("_test_ping_")
      .select("*")
      .limit(1);

    // Any of these errors means the DB IS reachable — table just doesn't exist yet
    const reachableCodes = ["42P01", "PGRST116", "PGRST200"];
    const isReachable =
      err2 &&
      (reachableCodes.includes(err2.code) ||
        err2.message.includes("schema cache") ||
        err2.message.includes("does not exist"));

    if (isReachable) {
      console.log("✅ Supabase connected successfully!");
      console.log("   Project ID :", process.env.SUPABASE_PROJECT_ID);
      console.log("   Status      : Database reachable (no tables yet — ready to create schema)");
    } else if (err2) {
      console.error("❌ Connection failed:", err2.message);
      process.exit(1);
    }
  } else {
    console.log("✅ Supabase connected successfully!");
    console.log("   Project ID :", process.env.SUPABASE_PROJECT_ID);
    console.log("   DB version  :", data);
  }

  process.exit(0);
}

testConnection();
