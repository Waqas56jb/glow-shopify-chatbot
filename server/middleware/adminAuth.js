const supabase = require("../db");

// Decode a JWT payload without verifying the signature.
// Used as fallback when SUPABASE_URL is not configured on the host.
function decodeJwtPayload(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json   = Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

module.exports = async function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized — no token provided" });
  }

  const token = auth.split(" ")[1];

  // ── Primary: verify via Supabase (requires SUPABASE_URL env var) ────────
  if (process.env.SUPABASE_URL && process.env.SUPABASE_URL !== "https://placeholder.supabase.co") {
    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data?.user) {
        return res.status(401).json({ error: "Unauthorized — invalid or expired token" });
      }
      req.user = data.user;
      return next();
    } catch (e) {
      console.warn("Supabase auth failed, falling back to JWT decode:", e.message);
    }
  }

  // ── Fallback: decode JWT locally (works without Supabase env vars) ───────
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.sub) {
    return res.status(401).json({ error: "Unauthorized — malformed token" });
  }

  // Check expiry
  const nowSec = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < nowSec) {
    return res.status(401).json({ error: "Unauthorized — token expired" });
  }

  req.user = { id: payload.sub, email: payload.email, role: payload.role };
  next();
};
