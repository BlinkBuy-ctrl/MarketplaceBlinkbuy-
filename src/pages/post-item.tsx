import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Plus, Package, X, ImagePlus, CheckCircle, AlertCircle, Upload } from "lucide-react";
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
    category: CATEGORIES[1],
    price: "",
    location: "Lilongwe",
    condition: "Good",
  });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 3 - previews.length;
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
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center page-enter">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-pink-500/20 blur-2xl rounded-full" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mx-auto">
            <CheckCircle size={40} className="text-white" strokeWidth={1.5} />
          </div>
        </div>

        <h2 className="text-3xl font-black mb-2 text-foreground">🎉 Listing Posted!</h2>
        <p className="text-muted-foreground text-base mb-8 max-w-sm mx-auto leading-relaxed">
          Your premium item has been successfully listed on the BlinkBuy marketplace. Start receiving offers from interested buyers!
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => { 
              setSubmitted(false); 
              setForm({ 
                title: "", 
                description: "", 
                category: CATEGORIES[1], 
                price: "", 
                location: "Lilongwe", 
                condition: "Good" 
              }); 
              setPreviews([]); 
            }}
            className="px-5 py-3 rounded-xl border-2 border-pink-500/30 text-pink-600 font-bold hover:border-pink-500 hover:bg-pink-500/5 transition-all duration-200"
          >
            Post Another
          </button>
          <button
            onClick={() => setLocation("/marketplace")}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold hover:from-pink-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-pink-500/50 border border-pink-400/30"
          >
            Browse Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 page-enter">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shrink-0">
          <Package size={20} className="text-white" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-foreground mb-1">Sell an Item</h1>
          <p className="text-muted-foreground text-sm font-medium">
            List your premium items on BlinkBuy marketplace and reach buyers across Malawi
          </p>
        </div>
      </div>

      {/* Demo Alert */}
      <div className="bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800 rounded-xl px-4 py-4 mb-6 flex gap-3">
        <AlertCircle size={18} className="text-pink-600 dark:text-pink-400 shrink-0 mt-0.5" />
        <p className="text-pink-700 dark:text-pink-300 text-sm font-medium">
          🔒 Demo Mode — Listings are not saved. Connect a backend to enable real submissions and payments.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Item Details Section */}
        <div className="bg-card border border-pink-500/20 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <span className="text-pink-600 font-black text-sm">1</span>
            </div>
            <h2 className="text-lg font-bold text-foreground">Item Details</h2>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-bold mb-2 block text-foreground">
              Item Title <span className="text-pink-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => set("title", e.target.value)}
              required
              placeholder="e.g. Samsung Galaxy A53 — Excellent Condition"
              maxLength={80}
              className="w-full px-4 py-3 rounded-xl border border-pink-500/20 bg-background text-sm outline-none transition-all duration-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 font-medium placeholder:text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {form.title.length}/80 characters
            </p>
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold mb-2 block text-foreground">
                Category <span className="text-pink-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={e => set("category", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-pink-500/20 bg-background text-sm outline-none transition-all duration-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 font-medium cursor-pointer"
              >
                {CATEGORIES.filter(c => c !== "All Categories").map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold mb-2 block text-foreground">
                Condition <span className="text-pink-500">*</span>
              </label>
              <select
                value={form.condition}
                onChange={e => set("condition", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-pink-500/20 bg-background text-sm outline-none transition-all duration-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 font-medium cursor-pointer"
              >
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-bold mb-2 block text-foreground">
              Description <span className="text-pink-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              required
              rows={5}
              placeholder="Describe the item — condition, age, reason for selling, any defects, special features..."
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl border border-pink-500/20 bg-background text-sm outline-none transition-all duration-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 font-medium placeholder:text-muted-foreground resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {form.description.length}/500 characters
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-sm font-bold mb-3 block text-foreground">
              Photos <span className="text-pink-500">*</span>
              <span className="text-xs font-normal text-muted-foreground ml-1">
                (max 3) — {previews.length}/3
              </span>
            </label>
            <div className="flex gap-3 flex-wrap">
              {previews.map((src, i) => (
                <div 
                  key={i} 
                  className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-pink-500/30 group hover:border-pink-500 transition-all duration-200"
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X size={20} className="text-white" strokeWidth={3} />
                  </button>
                </div>
              ))}

              {previews.length < 3 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-pink-500/40 hover:border-pink-500 hover:bg-pink-500/5 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-pink-500 transition-all duration-200"
                >
                  <ImagePlus size={20} strokeWidth={2} />
                  <span className="text-xs font-bold">Add</span>
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

        {/* Price & Location Section */}
        <div className="bg-card border border-pink-500/20 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <span className="text-pink-600 font-black text-sm">2</span>
            </div>
            <h2 className="text-lg font-bold text-foreground">Price & Location</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold mb-2 block text-foreground">
                Price (MK) <span className="text-pink-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                  MK
                </span>
                <input
                  type="number"
                  value={form.price}
                  onChange={e => set("price", e.target.value)}
                  required
                  placeholder="e.g. 120000"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-pink-500/20 bg-background text-sm outline-none transition-all duration-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold mb-2 block text-foreground">
                Location <span className="text-pink-500">*</span>
              </label>
              <select
                value={form.location}
                onChange={e => set("location", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-pink-500/20 bg-background text-sm outline-none transition-all duration-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 font-medium cursor-pointer"
              >
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !form.title || !form.description || !form.price}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 disabled:from-pink-400 disabled:to-pink-500 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-pink-500/50 border border-pink-400/30 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <Upload size={18} strokeWidth={2.5} />
              <span>List for Sale</span>
            </>
          )}
        </button>

        {/* Footer Note */}
        <p className="text-xs text-muted-foreground text-center">
          Your listing will be visible immediately after publication. You can manage your listings in your dashboard.
        </p>
      </form>
    </div>
  );
}
