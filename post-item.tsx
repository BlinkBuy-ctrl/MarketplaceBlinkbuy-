import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Plus, Package, X, ImagePlus, CheckCircle, Upload } from "lucide-react";
import { CATEGORIES, CITIES, CONDITIONS } from "@/lib/mockData";

const fieldClass =
  "w-full px-3 py-2.5 rounded-lg text-sm outline-none font-medium transition-all";

const fieldStyle = {
  backgroundColor: "hsl(var(--muted))",
  border: "1px solid hsl(var(--border))",
  color: "#fff",
};

export default function PostItemPage() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title:       "",
    description: "",
    category:    CATEGORIES[1],
    price:       "",
    location:    "Lilongwe",
    condition:   "Good",
  });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files     = Array.from(e.target.files || []);
    const remaining = 3 - previews.length;
    const allowed   = files.slice(0, remaining);
    const newPreviews = allowed.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removeImage = (index: number) =>
    setPreviews(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1200);
  };

  const reset = () => {
    setSubmitted(false);
    setForm({ title: "", description: "", category: CATEGORIES[1], price: "", location: "Lilongwe", condition: "Good" });
    setPreviews([]);
  };

  /* ── Success screen ──────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center page-enter">
        <div
          className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #007A33 0%, #004d1f 100%)" }}
        >
          <CheckCircle size={36} className="text-white" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Listing Posted!</h2>
        <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.50)" }}>
          Your item has been listed on the BlinkBuy marketplace.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              border: "1px solid hsl(var(--border))",
              color: "rgba(255,255,255,0.70)",
              backgroundColor: "hsl(var(--card))",
            }}
          >
            Post Another
          </button>
          <button
            onClick={() => setLocation("/marketplace")}
            className="btn-primary px-5 py-2.5 rounded-xl text-sm"
          >
            Browse Marketplace
          </button>
        </div>
      </div>
    );
  }

  /* ── Form ────────────────────────────────────────────────── */
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 page-enter">

      {/* Page title */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #0047AB 0%, #007A33 100%)" }}
        >
          <Package size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Sell an Item</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            List your item on the BlinkBuy marketplace
          </p>
        </div>
      </div>

      {/* Demo banner */}
      <div
        className="rounded-xl px-4 py-3 mb-5 text-xs font-medium"
        style={{
          backgroundColor: "rgba(206,17,38,0.12)",
          border: "1px solid rgba(206,17,38,0.30)",
          color: "#ff6b7a",
        }}
      >
        🔒 Demo Mode — Listings are not saved. Connect a backend to enable real submissions.
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ── Item Details ───────────────────────────────────── */}
        <section
          className="rounded-2xl p-5 space-y-4"
          style={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--card-border))",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h2 className="text-sm font-bold text-white">Item Details</h2>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "rgba(255,255,255,0.60)" }}>
              Item Title *
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => set("title", e.target.value)}
              required
              placeholder="e.g. Samsung Galaxy A53 — Excellent Condition"
              className={fieldClass}
              style={fieldStyle}
            />
          </div>

          {/* Category + Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: "rgba(255,255,255,0.60)" }}>
                Category
              </label>
              <select
                value={form.category}
                onChange={e => set("category", e.target.value)}
                className={fieldClass}
                style={fieldStyle}
              >
                {CATEGORIES.filter(c => c !== "All Categories").map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: "rgba(255,255,255,0.60)" }}>
                Condition
              </label>
              <select
                value={form.condition}
                onChange={e => set("condition", e.target.value)}
                className={fieldClass}
                style={fieldStyle}
              >
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold mb-1.5 block" style={{ color: "rgba(255,255,255,0.60)" }}>
              Description *
            </label>
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              required
              rows={4}
              placeholder="Describe the item — condition, age, reason for selling, any defects..."
              className={fieldClass}
              style={{ ...fieldStyle, resize: "none" }}
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="text-xs font-semibold mb-2 block" style={{ color: "rgba(255,255,255,0.60)" }}>
              Photos (max 3) — {previews.length}/3
            </label>
            <div className="flex gap-3 flex-wrap">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="relative w-24 h-24 rounded-xl overflow-hidden"
                  style={{ border: "1px solid hsl(var(--border))" }}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all"
                    style={{ backgroundColor: "rgba(0,0,0,0.70)", color: "#fff" }}
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
              {previews.length < 3 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-all"
                  style={{
                    borderColor: "rgba(0,71,171,0.45)",
                    color: "rgba(0,71,171,0.70)",
                    backgroundColor: "rgba(0,71,171,0.06)",
                  }}
                >
                  <ImagePlus size={20} />
                  <span className="text-xs font-medium">Add Photo</span>
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        </section>

        {/* ── Price & Location ────────────────────────────────── */}
        <section
          className="rounded-2xl p-5 space-y-4"
          style={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--card-border))",
            boxShadow: "var(--shadow-card)",
          }}
        >
          <h2 className="text-sm font-bold text-white">Price &amp; Location</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: "rgba(255,255,255,0.60)" }}>
                Price (MK) *
              </label>
              <input
                type="number"
                value={form.price}
                onChange={e => set("price", e.target.value)}
                required
                placeholder="e.g. 120000"
                className={fieldClass}
                style={fieldStyle}
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color: "rgba(255,255,255,0.60)" }}>
                Location *
              </label>
              <select
                value={form.location}
                onChange={e => set("location", e.target.value)}
                className={fieldClass}
                style={fieldStyle}
              >
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><Upload size={16} /> List for Sale</>
          )}
        </button>
      </form>
    </div>
  );
}
