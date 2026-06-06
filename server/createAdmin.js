require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function createAdmin() {
  console.log("\n👤 Creating admin user...");

  const { data, error } = await supabase.auth.admin.createUser({
    email:             "admin@gmail.com",
    password:          "admin@123!",
    email_confirm:     true,
    user_metadata:     { role: "admin", name: "Admin" },
  });

  if (error) {
    if (error.message.includes("already been registered") || error.message.includes("already exists")) {
      console.log("ℹ️  Admin user already exists — credentials unchanged.");
      console.log("   Email   : admin@gmail.com");
      console.log("   Password: admin@123!\n");
    } else {
      console.error("❌ Failed:", error.message);
    }
    return;
  }

  console.log("✅ Admin account created successfully!");
  console.log("   Email   : admin@gmail.com");
  console.log("   Password: admin@123!");
  console.log("   User ID :", data.user.id);
  console.log("\n🔗 Login at your deployed admin URL\n");
}

createAdmin();
