import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Plus, Package, X, ImagePlus, CheckCircle } from "lucide-react";
import { CATEGORIES, CITIES, CONDITIONS } from "@/lib/mockData";

export default function PostItemPage() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: CATEGORIES[1], // skip "All Categories"
    price: "",
    location: "Lilongwe",
    condition: "Good",
  });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 2 - previews.length;
    const allowed = files.slice(0, remaining);
    const newPreviews = allowed.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center page-enter">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-xl font-black mb-2">Listing Posted!</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Your item has been listed on the marketplace.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => { setSubmitted(false); setForm({ title: "", description: "", category: CATEGORIES[1], price: "", location: "Lilongwe", condition: "Good" }); setPreviews([]); }}
            className="px-5 py-2.5 rounded-xl border border-border text-sm hover:bg-muted transition-all"
          >
            Post Another
          </button>
          <button
            onClick={() => setLocation("/marketplace")}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-all"
          >
            Browse Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 page-enter">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Package size={18} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-black">Sell an Item</h1>
          <p className="text-muted-foreground text-sm">List your item on the BlinkBuy marketplace</p>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3 mb-4">
        <p className="text-amber-700 dark:text-amber-400 text-xs font-medium">
          🔒 Demo Mode — Listings are not saved. Connect a backend to enable real submissions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Item Details */}
        <div className="bg-card border border-card-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold">Item Details</h2>

          <div>
            <label className="text-xs font-medium mb-1 block">Item Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => set("title", e.target.value)}
              required
              placeholder="e.g. Samsung Galaxy A53 — Excellent Condition"
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={e => set("category", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {CATEGORIES.filter(c => c !== "All Categories").map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Condition</label>
              <select
                value={form.condition}
                onChange={e => set("condition", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium mb-1 block">Description *</label>
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              required
              rows={4}
              placeholder="Describe the item — condition, age, reason for selling, any defects..."
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="text-xs font-medium mb-2 block">
              Photos (max 2) — {previews.length}/2
            </label>
            <div className="flex gap-3 flex-wrap">
              {previews.map((src, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-border">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
              {previews.length < 2 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-all"
                >
                  <ImagePlus size={20} />
                  <span className="text-xs">Add Photo</span>
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
        </div>

        {/* Price & Location */}
        <div className="bg-card border border-card-border rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold">Price & Location</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Price (MK) *</label>
              <input
                type="number"
                value={form.price}
                onChange={e => set("price", e.target.value)}
                required
                placeholder="e.g. 120000"
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Location *</label>
              <select
                value={form.location}
                onChange={e => set("location", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <><Plus size={16} /> List for Sale</>
          )}
        </button>
      </form>
    </div>
  );
}
