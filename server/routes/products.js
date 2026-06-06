const express   = require("express");
const router    = express.Router();
const supabase  = require("../db");
const adminAuth = require("../middleware/adminAuth");
const { invalidateCache } = require("../cache/productCache");

// GET /api/products  — public (chatbot) + admin
// Query params:
//   in_stock=true   → only in-stock  (default for chatbot)
//   in_stock=false  → ALL products   (admin wants everything)
//   featured=true   → only featured
//   limit=N         → max rows (default 100)
router.get("/", async (req, res) => {
  try {
    const { featured, in_stock, limit = 100 } = req.query;

    let query = supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(parseInt(limit));

    // Only filter by in_stock when explicitly set to "true"
    // in_stock=false or omitted → return all (admin) or all (no filter)
    if (in_stock === "true") query = query.eq("in_stock", true);
    if (featured === "true") query = query.eq("featured", true);

    const { data, error } = await query;
    if (error) throw error;
    res.json({ products: data || [] });
  } catch (err) {
    console.error("GET /api/products error:", err.message);
    // Return 200 + empty array so admin UI loads even when DB is misconfigured
    res.json({ products: [], _warning: err.message });
  }
});

// GET /api/products/:id  — public
router.get("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products").select("*").eq("id", req.params.id).single();
    if (error) throw error;
    res.json({ product: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Admin routes (require auth) ───────────────────────────────────────────

// POST /api/products
router.post("/", adminAuth, async (req, res) => {
  try {
    const payload = sanitize(req.body);
    const { data, error } = await supabase
      .from("products").insert(payload).select().single();
    if (error) throw error;
    invalidateCache();
    res.status(201).json({ product: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/products/:id
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const payload = { ...sanitize(req.body), updated_at: new Date().toISOString() };
    const { data, error } = await supabase
      .from("products").update(payload).eq("id", req.params.id).select().single();
    if (error) throw error;
    invalidateCache();
    res.json({ product: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/products/:id
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const { error } = await supabase.from("products").delete().eq("id", req.params.id);
    if (error) throw error;
    invalidateCache();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/products/:id/toggle  — quick toggle in_stock / featured
router.patch("/:id/toggle", adminAuth, async (req, res) => {
  try {
    const { field } = req.body;
    if (!["in_stock", "featured"].includes(field)) {
      return res.status(400).json({ error: "field must be in_stock or featured" });
    }
    const { data: cur } = await supabase
      .from("products").select(field).eq("id", req.params.id).single();
    const { data, error } = await supabase
      .from("products")
      .update({ [field]: !cur[field], updated_at: new Date().toISOString() })
      .eq("id", req.params.id).select().single();
    if (error) throw error;
    invalidateCache();
    res.json({ product: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function sanitize(body) {
  const {
    name, price, description, url, materials, sizing_note, important,
    category, sizes, colors, images, in_stock, featured,
  } = body;
  return {
    name:        name        || "",
    price:       price       || "",
    description: description || null,
    url:         url         || null,
    materials:   materials   || null,
    sizing_note: sizing_note || null,
    important:   important   || null,
    category:    Array.isArray(category) ? category : [],
    sizes:       Array.isArray(sizes)    ? sizes    : [],
    colors:      Array.isArray(colors)   ? colors   : [],
    images:      Array.isArray(images)   ? images   : [],
    in_stock:    in_stock  !== undefined ? Boolean(in_stock)  : true,
    featured:    featured  !== undefined ? Boolean(featured)  : false,
  };
}

module.exports = router;
