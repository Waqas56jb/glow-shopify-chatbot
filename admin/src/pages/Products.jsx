import { useState, useEffect, useRef } from "react";
import { useApi } from "../hooks/useApi";
import { supabase } from "../lib/supabase";
import styles from "./Products.module.css";

/* ── Constants ── */
const CATEGORY_OPTIONS = ["men", "women", "unisex", "hoodie", "t-shirt", "dress", "swimsuit", "cap", "pajamas", "outerwear", "accessories", "kids"];
const SIZE_OPTIONS     = ["2XS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL", "S/M", "L/XL", "One Size"];
const COLOR_PRESETS    = ["Black", "White", "Gold", "Navy", "Grey", "Red", "Pink", "Green", "Blue", "Beige", "Brown", "Purple", "Yellow", "Orange"];

const EMPTY_FORM = {
  name: "", price: "", description: "", url: "", materials: "",
  sizing_note: "", important: "", category: [], sizes: [], colors: [],
  images: ["", "", "", ""], in_stock: true, featured: false,
};

export default function Products() {
  const { get, post, remove } = useApi();
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [search,   setSearch]   = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null); // null = add, object = edit
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [uploading, setUploading] = useState({ 0: false, 1: false, 2: false, 3: false });

  const fetchProducts = () => {
    setLoading(true);
    get("/api/products?in_stock=false&limit=200")
      .then((d) => setProducts(d.products))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(fetchProducts, []);

  /* ── Open drawer ── */
  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setSaveError("");
    setDrawerOpen(true);
  };

  const openEdit = (p) => {
    setEditTarget(p);
    setForm({
      name:        p.name        || "",
      price:       p.price       || "",
      description: p.description || "",
      url:         p.url         || "",
      materials:   p.materials   || "",
      sizing_note: p.sizing_note || "",
      important:   p.important   || "",
      category:    p.category    || [],
      sizes:       p.sizes       || [],
      colors:      p.colors      || [],
      images:      padImages(p.images || []),
      in_stock:    p.in_stock !== false,
      featured:    p.featured === true,
    });
    setSaveError("");
    setDrawerOpen(true);
  };

  const closeDrawer = () => { setDrawerOpen(false); setEditTarget(null); };

  /* ── Image upload to Supabase Storage ── */
  const BUCKET = "product-images";

  const ensureBucket = async () => {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === BUCKET);
    if (!exists) {
      const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
      if (error && !error.message.includes("already exists")) throw error;
    }
  };

  const uploadImage = async (file, slot) => {
    setUploading((u) => ({ ...u, [slot]: true }));
    try {
      await ensureBucket();
      const ext  = file.name.split(".").pop().toLowerCase();
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
      setForm((f) => {
        const imgs = [...f.images];
        imgs[slot] = publicUrl;
        return { ...f, images: imgs };
      });
    } catch (e) {
      if (e.message?.includes("Bucket not found") || e.message?.includes("bucket")) {
        alert(
          "Storage bucket missing.\n\n" +
          "Go to Supabase → Storage → New Bucket\n" +
          "Name: product-images\n" +
          "Make it PUBLIC ✓\n\n" +
          "Then try uploading again."
        );
      } else {
        alert("Upload failed: " + e.message);
      }
    } finally {
      setUploading((u) => ({ ...u, [slot]: false }));
    }
  };

  const removeImage = (slot) =>
    setForm((f) => { const imgs = [...f.images]; imgs[slot] = ""; return { ...f, images: imgs }; });

  /* ── Save product ── */
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price.trim()) {
      setSaveError("Name and price are required.");
      return;
    }
    setSaving(true);
    setSaveError("");
    const payload = {
      ...form,
      images: form.images.filter(Boolean),
    };
    try {
      if (editTarget) {
        // update via fetch directly (useApi.patch)
        const { session } = (await supabase.auth.getSession()).data;
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products/${editTarget.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
            body: JSON.stringify(payload),
          }
        );
        const d = await res.json();
        if (!res.ok) throw new Error(d.error);
        setProducts((prev) => prev.map((p) => p.id === editTarget.id ? d.product : p));
      } else {
        const d = await post("/api/products", payload);
        setProducts((prev) => [d.product, ...prev]);
      }
      closeDrawer();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await remove(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert("Delete failed: " + e.message);
    }
  };

  /* ── Quick toggle ── */
  const toggleField = async (p, field) => {
    try {
      const { session } = (await supabase.auth.getSession()).data;
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products/${p.id}/toggle`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
          body: JSON.stringify({ field }),
        }
      );
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setProducts((prev) => prev.map((x) => x.id === p.id ? d.product : x));
    } catch (e) {
      alert("Toggle failed: " + e.message);
    }
  };

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Render ── */
  return (
    <div className={styles.page}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <SearchIcon />
          <input className={styles.search} placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button className={styles.addBtn} onClick={openAdd}>+ Add Product</button>
      </div>

      {loading ? (
        <p className={styles.stateMsg}>Loading products…</p>
      ) : error ? (
        <p className={styles.errorMsg}>⚠️ {error}</p>
      ) : (
        <>
          <p className={styles.count}>{filtered.length} product{filtered.length !== 1 ? "s" : ""}</p>

          {filtered.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📦</div>
              <h3>No products yet</h3>
              <p>Add your first product and the chatbot will start selling it automatically.</p>
              <button className={styles.addBtn} onClick={openAdd}>+ Add First Product</button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onEdit={() => openEdit(p)}
                  onDelete={() => handleDelete(p.id)}
                  onToggle={toggleField}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Drawer */}
      {drawerOpen && (
        <div className={styles.drawerOverlay} onClick={closeDrawer}>
          <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h3>{editTarget ? "Edit Product" : "Add New Product"}</h3>
              <button className={styles.closeBtn} onClick={closeDrawer}>✕</button>
            </div>

            <form className={styles.drawerForm} onSubmit={handleSave}>
              {/* Images */}
              <Section title="Product Images (up to 4)">
                <p className={styles.hint}>Upload from Supabase Storage. Chatbot will show these to customers.</p>
                <div className={styles.imageGrid}>
                  {form.images.map((img, i) => (
                    <ImageSlot
                      key={i}
                      idx={i}
                      url={img}
                      uploading={uploading[i]}
                      onUpload={(file) => uploadImage(file, i)}
                      onRemove={() => removeImage(i)}
                    />
                  ))}
                </div>
              </Section>

              {/* Basic Info */}
              <Section title="Basic Information">
                <Field label="Product Name *">
                  <input className={styles.input} placeholder="e.g. Unisex Hoodie" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
                </Field>
                <Field label="Price *">
                  <input className={styles.input} placeholder="e.g. $39.99 or From $29.99" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required />
                </Field>
                <Field label="Product Page URL">
                  <input className={styles.input} placeholder="https://glowupgoodsshop.com/products/unisex-hoodie" value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} />
                </Field>
                <Field label="Description">
                  <textarea className={styles.textarea} placeholder="Brief product description for the chatbot…" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                </Field>
                <Field label="Materials">
                  <input className={styles.input} placeholder="e.g. 100% combed ringspun cotton. 6.2 oz/yd²" value={form.materials} onChange={(e) => setForm((f) => ({ ...f, materials: e.target.value }))} />
                </Field>
              </Section>

              {/* Categories */}
              <Section title="Categories">
                <TagSelector
                  selected={form.category}
                  options={CATEGORY_OPTIONS}
                  onChange={(v) => setForm((f) => ({ ...f, category: v }))}
                />
              </Section>

              {/* Sizes */}
              <Section title="Available Sizes">
                <TagSelector
                  selected={form.sizes}
                  options={SIZE_OPTIONS}
                  onChange={(v) => setForm((f) => ({ ...f, sizes: v }))}
                  allowCustom
                  customPlaceholder="Add custom size…"
                />
              </Section>

              {/* Colors */}
              <Section title="Available Colors">
                <TagSelector
                  selected={form.colors}
                  options={COLOR_PRESETS}
                  onChange={(v) => setForm((f) => ({ ...f, colors: v }))}
                  allowCustom
                  customPlaceholder="Add color…"
                />
              </Section>

              {/* Sizing & Notes */}
              <Section title="Notes & Warnings">
                <Field label="Sizing Note (shown in chatbot)">
                  <input className={styles.input} placeholder="e.g. Runs small — order one size up" value={form.sizing_note} onChange={(e) => setForm((f) => ({ ...f, sizing_note: e.target.value }))} />
                </Field>
                <Field label="Important Notice">
                  <input className={styles.input} placeholder="e.g. Only ships within EU/UK" value={form.important} onChange={(e) => setForm((f) => ({ ...f, important: e.target.value }))} />
                </Field>
              </Section>

              {/* Toggles */}
              <Section title="Visibility">
                <div className={styles.toggleRow}>
                  <span>In Stock</span>
                  <label className={styles.toggle}>
                    <input type="checkbox" checked={form.in_stock} onChange={(e) => setForm((f) => ({ ...f, in_stock: e.target.checked }))} />
                    <span className={styles.toggleSlider} />
                  </label>
                </div>
                <div className={styles.toggleRow}>
                  <span>Featured (chatbot highlights this first)</span>
                  <label className={styles.toggle}>
                    <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
                    <span className={styles.toggleSlider} />
                  </label>
                </div>
              </Section>

              {saveError && <p className={styles.saveError}>⚠️ {saveError}</p>}

              <div className={styles.drawerFooter}>
                <button type="button" className={styles.cancelBtn} onClick={closeDrawer}>Cancel</button>
                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? <span className={styles.spinner} /> : (editTarget ? "Save Changes" : "Add Product")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function ProductCard({ product: p, onEdit, onDelete, onToggle }) {
  const img = (p.images || []).find(Boolean);
  return (
    <div className={`${styles.card} ${!p.in_stock ? styles.outOfStock : ""}`}>
      <div className={styles.cardImg}>
        {img
          ? <img src={img} alt={p.name} loading="lazy" />
          : <div className={styles.noImg}><ImgIcon /></div>
        }
        {p.featured && <span className={styles.featuredBadge}>★ Featured</span>}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <h4 className={styles.cardName}>{p.name}</h4>
          <span className={styles.cardPrice}>{p.price}</span>
        </div>

        {p.description && <p className={styles.cardDesc}>{p.description}</p>}

        <div className={styles.cardMeta}>
          {(p.sizes || []).length > 0 && (
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Sizes</span>
              <div className={styles.tagList}>
                {p.sizes.slice(0, 6).map((s) => <span key={s} className={styles.metaTag}>{s}</span>)}
                {p.sizes.length > 6 && <span className={styles.metaTag}>+{p.sizes.length - 6}</span>}
              </div>
            </div>
          )}
          {(p.colors || []).length > 0 && (
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Colors</span>
              <div className={styles.tagList}>
                {p.colors.slice(0, 4).map((c) => <span key={c} className={styles.metaTag}>{c}</span>)}
                {p.colors.length > 4 && <span className={styles.metaTag}>+{p.colors.length - 4}</span>}
              </div>
            </div>
          )}
          {(p.images || []).filter(Boolean).length > 1 && (
            <p className={styles.imgCount}>📸 {p.images.filter(Boolean).length} images</p>
          )}
        </div>

        <div className={styles.cardActions}>
          <button className={`${styles.stockBtn} ${p.in_stock ? styles.inStock : styles.noStock}`}
            onClick={() => onToggle(p, "in_stock")}>
            {p.in_stock ? "In Stock" : "Out of Stock"}
          </button>
          <button className={styles.featBtn} onClick={() => onToggle(p, "featured")}>
            {p.featured ? "★" : "☆"}
          </button>
          <button className={styles.editBtn} onClick={onEdit}>Edit</button>
          <button className={styles.deleteBtn} onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function ImageSlot({ idx, url, uploading, onUpload, onRemove }) {
  const inputRef = useRef();
  return (
    <div className={`${styles.imgSlot} ${url ? styles.imgSlotFilled : ""}`}>
      {url ? (
        <>
          <img src={url} alt={`Product image ${idx + 1}`} className={styles.imgPreview} />
          <button type="button" className={styles.imgRemove} onClick={onRemove}>✕</button>
        </>
      ) : (
        <label className={styles.imgLabel}>
          <input
            ref={inputRef} type="file" accept="image/*" hidden
            onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
          />
          {uploading ? <span className={styles.spinner} /> : <UploadIcon />}
          <span>{uploading ? "Uploading…" : `Image ${idx + 1}`}</span>
        </label>
      )}
    </div>
  );
}

function TagSelector({ selected, options, onChange, allowCustom, customPlaceholder }) {
  const [custom, setCustom] = useState("");
  const toggle = (val) =>
    selected.includes(val)
      ? onChange(selected.filter((x) => x !== val))
      : onChange([...selected, val]);
  const addCustom = () => {
    const v = custom.trim();
    if (v && !selected.includes(v)) { onChange([...selected, v]); }
    setCustom("");
  };
  return (
    <div className={styles.tagSelector}>
      <div className={styles.tagOptions}>
        {options.map((o) => (
          <button
            key={o} type="button"
            className={`${styles.tagOption} ${selected.includes(o) ? styles.tagOptionSelected : ""}`}
            onClick={() => toggle(o)}
          >
            {o}
          </button>
        ))}
      </div>
      {allowCustom && (
        <div className={styles.customTag}>
          <input
            className={styles.input}
            placeholder={customPlaceholder}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustom())}
          />
          <button type="button" className={styles.addTagBtn} onClick={addCustom}>Add</button>
        </div>
      )}
      {selected.length > 0 && (
        <div className={styles.selectedTags}>
          {selected.map((s) => (
            <span key={s} className={styles.selectedTag}>
              {s}
              <button type="button" onClick={() => toggle(s)}>✕</button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>{title}</h4>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  );
}

function padImages(arr) {
  const padded = [...arr];
  while (padded.length < 4) padded.push("");
  return padded.slice(0, 4);
}

function SearchIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:"var(--text-dim)",flexShrink:0}}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
function ImgIcon() {
  return <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color:"var(--text-dim)"}}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
}
function UploadIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:"var(--text-dim)"}}><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>;
}
