import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Package, X, ImagePlus, CheckCircle, AlertCircle, Upload, Phone, User, LocateFixed, MapPin } from "lucide-react";
import { CATEGORIES, CITIES, CONDITIONS } from "@/lib/mockData";
import { createListing } from "@/lib/listings";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export default function PostItemPage() {
  const [, setLocation] = useLocation();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [locating, setLocating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: CATEGORIES[1],
    price: "",
    location: "Lilongwe",
    condition: "Good",
    sellerName: "",
    sellerPhone: "",
    negotiable: false,
    // GPS pin captured from the device, stored alongside the listing so
    // buyers can see exactly how far away the seller is (see SellerBuyerMap).
    lat: null as number | null,
    lng: null as number | null,
  });

  const set = (k: string, v: string | boolean | number | null) => setForm(p => ({ ...p, [k]: v }));

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setForm(p => ({ ...p, lat: pos.coords.latitude, lng: pos.coords.longitude }));
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const remaining = 5 - previews.length;
    const allowed = selected.slice(0, remaining);
    const newPreviews = allowed.map(f => URL.createObjectURL(f));
    setPreviews(prev => [...prev, ...newPreviews]);
    setFiles(prev => [...prev, ...allowed]);
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createListing(
        {
          title: form.title,
          description: form.description,
          category: form.category,
          price: form.price ? Number(form.price) : null,
          location: form.location,
          condition: form.condition,
          sellerName: form.sellerName,
          sellerPhone: form.sellerPhone,
          negotiable: form.negotiable,
          lat: form.lat,
          lng: form.lng,
        },
        files
      );
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isValid = form.title && form.description && form.price && form.sellerName && form.sellerPhone && previews.length > 0;

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center page-enter">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto">
            <CheckCircle size={40} className="text-white" strokeWidth={1.5} />
          </div>
        </div>

        <h2 className="text-3xl font-black mb-2 text-foreground">🎉 Listing Posted!</h2>
        <p className="text-muted-foreground text-base mb-8 max-w-sm mx-auto leading-relaxed">
          Your item has been listed on Market Hub Malawi. Buyers will reach you on <strong>{form.sellerPhone}</strong>!
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({ title: "", description: "", category: CATEGORIES[1], price: "", location: "Lilongwe", condition: "Good", sellerName: "", sellerPhone: "", negotiable: false, lat: null, lng: null });
              setPreviews([]);
              setFiles([]);
            }}
            className="px-5 py-3 rounded-xl border-2 border-red-500/30 text-red-600 font-bold hover:border-red-500 hover:bg-red-500/5 transition-all duration-200"
          >
            Post Another
          </button>
          <button
            onClick={() => setLocation("/marketplace")}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-red-500/50 border border-red-400/30"
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
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shrink-0">
          <Package size={20} className="text-white" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-foreground mb-1">Sell an Item</h1>
          <p className="text-muted-foreground text-sm font-medium">
            List your items on Market Hub Malawi and reach buyers across Malawi
          </p>
        </div>
      </div>

      {!isSupabaseConfigured && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-4 mb-6 flex gap-3">
          <AlertCircle size={18} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-700 dark:text-red-300 text-sm font-medium">
            🔒 Backend isn't configured on this deployment yet — listings can't be saved right now.
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl px-4 py-4 mb-6 flex gap-3">
          <AlertCircle size={18} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Item Details */}
        <div className="bg-card border border-red-500/20 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <span className="text-red-600 font-black text-sm">1</span>
            </div>
            <h2 className="text-lg font-bold text-foreground">Item Details</h2>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-bold mb-2 block text-foreground">
              Item Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={e => set("title", e.target.value)}
              required
              placeholder="e.g. Samsung Galaxy A53 — Excellent Condition"
              maxLength={80}
              className="w-full px-4 py-3 rounded-xl border border-red-500/20 bg-background text-sm outline-none transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 font-medium placeholder:text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">{form.title.length}/80 characters</p>
          </div>

          {/* Category & Condition */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold mb-2 block text-foreground">Category <span className="text-red-500">*</span></label>
              <select value={form.category} onChange={e => set("category", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-red-500/20 bg-background text-sm outline-none transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 font-medium cursor-pointer">
                {CATEGORIES.filter(c => c !== "All Categories").map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-bold mb-2 block text-foreground">Condition <span className="text-red-500">*</span></label>
              <select value={form.condition} onChange={e => set("condition", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-red-500/20 bg-background text-sm outline-none transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 font-medium cursor-pointer">
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-bold mb-2 block text-foreground">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => set("description", e.target.value)}
              required
              rows={5}
              placeholder="Describe the item — condition, age, reason for selling, any defects, special features..."
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl border border-red-500/20 bg-background text-sm outline-none transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 font-medium placeholder:text-muted-foreground resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">{form.description.length}/500 characters</p>
          </div>

          {/* Image Upload — up to 5 */}
          <div>
            <label className="text-sm font-bold mb-3 block text-foreground">
              Photos <span className="text-red-500">*</span>
              <span className="text-xs font-normal text-muted-foreground ml-1">(up to 5) — {previews.length}/5</span>
            </label>
            <div className="flex gap-3 flex-wrap">
              {previews.map((src, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-red-500/30 group hover:border-red-500 transition-all duration-200">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <X size={20} className="text-white" strokeWidth={3} />
                  </button>
                </div>
              ))}
              {previews.length < 5 && (
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-red-500/40 hover:border-red-500 hover:bg-red-500/5 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-red-500 transition-all duration-200">
                  <ImagePlus size={20} strokeWidth={2} />
                  <span className="text-xs font-bold">Add</span>
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
          </div>
        </div>

        {/* Section 2: Price & Location */}
        <div className="bg-card border border-red-500/20 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <span className="text-red-600 font-black text-sm">2</span>
            </div>
            <h2 className="text-lg font-bold text-foreground">Price & Location</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold mb-2 block text-foreground">Price (MK) <span className="text-red-500">*</span></label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">MK</span>
                <input type="number" value={form.price} onChange={e => set("price", e.target.value)} required placeholder="e.g. 120000"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-red-500/20 bg-background text-sm outline-none transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 font-medium" />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold mb-2 block text-foreground">Location <span className="text-red-500">*</span></label>
              <select value={form.location} onChange={e => set("location", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-red-500/20 bg-background text-sm outline-none transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 font-medium cursor-pointer">
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locating}
                className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-600 disabled:opacity-50"
              >
                <LocateFixed size={11} className={locating ? "animate-pulse" : ""} />
                {form.lat ? "GPS pin captured ✓" : locating ? "Detecting…" : "Use my exact GPS location"}
              </button>
              {form.lat && form.lng && (
                <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                  <MapPin size={9} /> {form.lat.toFixed(4)}, {form.lng.toFixed(4)} — buyers will see exactly how far you are
                </p>
              )}
            </div>
          </div>

          {/* Negotiable toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-red-500/15">
            <div>
              <p className="text-sm font-semibold">Price Negotiable</p>
              <p className="text-xs text-muted-foreground">Let buyers know the price can be discussed</p>
            </div>
            <button type="button" onClick={() => set("negotiable", !form.negotiable)}
              className={`relative w-11 h-6 rounded-full transition-all duration-300 ${form.negotiable ? "bg-red-500" : "bg-muted border border-border"}`}>
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${form.negotiable ? "left-5.5" : "left-0.5"}`} />
            </button>
          </div>
        </div>

        {/* Section 3: Seller Contact */}
        <div className="bg-card border border-red-500/20 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <span className="text-red-600 font-black text-sm">3</span>
            </div>
            <h2 className="text-lg font-bold text-foreground">Your Contact Info</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-bold mb-2 block text-foreground">Your Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" value={form.sellerName} onChange={e => set("sellerName", e.target.value)} required placeholder="e.g. Chisomo Banda"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-red-500/20 bg-background text-sm outline-none transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 font-medium placeholder:text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="text-sm font-bold mb-2 block text-foreground">Phone / WhatsApp <span className="text-red-500">*</span></label>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="tel" value={form.sellerPhone} onChange={e => set("sellerPhone", e.target.value)} required placeholder="e.g. 0999123456"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-red-500/20 bg-background text-sm outline-none transition-all duration-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 font-medium placeholder:text-muted-foreground" />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Buyers will contact you directly. Use the number you check most.</p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !isValid}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-400 disabled:to-red-500 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-red-500/50 border border-red-400/30 flex items-center justify-center gap-2"
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

        <p className="text-xs text-muted-foreground text-center">
          Your listing will be visible immediately. Buyers will contact you via phone or WhatsApp.
        </p>
      </form>
    </div>
  );
}
