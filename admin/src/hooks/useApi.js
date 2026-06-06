import { supabase } from "../lib/supabase";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function getAuthHeaders() {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function apiFetch(path, options = {}) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || `Request failed: ${res.status}`);
  return json;
}

export function useApi() {
  const get    = (path)         => apiFetch(path);
  const post   = (path, body)   => apiFetch(path, { method: "POST",   body: JSON.stringify(body) });
  const patch  = (path, body)   => apiFetch(path, { method: "PATCH",  body: JSON.stringify(body) });
  const remove = (path)         => apiFetch(path, { method: "DELETE" });
  return { get, post, patch, remove };
}
