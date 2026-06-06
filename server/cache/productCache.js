const supabase = require("../db");

let _cache   = [];
let _fetchedAt = 0;
const TTL    = 5 * 60 * 1000; // 5 minutes

async function getProducts() {
  if (_cache.length > 0 && Date.now() - _fetchedAt < TTL) return _cache;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("in_stock", true)
    .order("created_at", { ascending: false });

  if (!error && data) {
    _cache     = data;
    _fetchedAt = Date.now();
  }
  return _cache;
}

function invalidateCache() {
  _cache     = [];
  _fetchedAt = 0;
}

module.exports = { getProducts, invalidateCache };
