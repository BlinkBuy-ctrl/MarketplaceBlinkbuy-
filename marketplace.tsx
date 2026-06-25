import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search, ShoppingBag, MapPin, SlidersHorizontal, X } from "lucide-react";
import { MOCK_ITEMS, CATEGORIES, CITIES } from "@/lib/mockData";
import { formatMK } from "@/lib/utils";

const PAGE_SIZE = 12;

const CATEGORY_COLORS: Record<string, string> = {
  Electronics:   "#6babff",
  Phones:        "#a78bfa",
  Vehicles:      "#CE1126",
  "Farm Produce":"#007A33",
  Furniture:     "#f59e0b",
  Clothing:      "#ec4899",
  Food:          "#10b981",
  Tools:         "#f97316",
  Books:         "#06b6d4",
  Other:         "rgba(255,255,255,0.45)",
};

export default function MarketplacePage() {
  const [search, setSearch]           = useState("");
  const [category, setCategory]       = useState("All Categories");
  const [loc, setLoc]                 = useState("");
  const [locSearch, setLocSearch]     = useState("");
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [page, setPage]               = useState(1);

  const filteredCities = CITIES.filter(c =>
    c.toLowerCase().includes(locSearch.toLowerCase())
  );

  const filtered = useMemo(() => {
    return MOCK_ITEMS.filter(item => {
      if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== "All Categories" && item.category !== category) return false;
      if (loc && item.location !== loc) return false;
      return true;
    });
  }, [search, category, loc]);

  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch  = (v: string) => { setSearch(v);   setPage(1); };
  const handleCategory= (v: string) => { setCategory(v); setPage(1); };
  const handleLoc     = (v: string) => { setLoc(v); setLocSearch(""); setShowLocDropdown(false); setPage(1); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 page-enter">

      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white mb-0.5">Marketplace</h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Buy and sell goods across Malawi 🇲🇼
          </p>
        </div>
        <Link
          href="/post-item"
          className="btn-primary px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5"
        >
          + Sell Something
        </Link>
      </div>

      {/* ── Search & Filters ──────────────────────────────────── */}
      <div
        className="rounded-xl p-4 mb-6"
        style={{
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--card-border))",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal size={14} style={{ color: "#6babff" }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.45)" }}>
            Filter
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div
            className="flex-1 flex items-center gap-2 rounded-lg px-3 py-2.5"
            style={{ backgroundColor: "hsl(var(--muted))", border: "1px solid hsl(var(--border))" }}
          >
            <Search size={14} style={{ color: "rgba(255,255,255,0.35)" }} className="shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search items..."
              className="flex-1 text-sm outline-none bg-transparent text-white placeholder:text-white/30"
            />
            {search && (
              <button onClick={() => handleSearch("")} style={{ color: "rgba(255,255,255,0.40)" }}>
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={e => handleCategory(e.target.value)}
            className="px-3 py-2.5 rounded-lg text-sm outline-none sm:w-44 font-medium"
            style={{
              backgroundColor: "hsl(var(--muted))",
              border: "1px solid hsl(var(--border))",
              color: "rgba(255,255,255,0.80)",
            }}
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>

          {/* District dropdown */}
          <div className="relative sm:w-44">
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm cursor-pointer"
              style={{
                backgroundColor: "hsl(var(--muted))",
                border: loc ? "1px solid rgba(0,122,51,0.60)" : "1px solid hsl(var(--border))",
                color: loc ? "#26d97a" : "rgba(255,255,255,0.45)",
              }}
              onClick={() => setShowLocDropdown(!showLocDropdown)}
            >
              <MapPin size={13} className="shrink-0" />
              <span className="truncate">{loc || "All Districts"}</span>
            </div>

            {showLocDropdown && (
              <div
                className="absolute top-full mt-1 left-0 right-0 rounded-xl z-50 overflow-hidden"
                style={{
                  backgroundColor: "#0d0d0d",
                  border: "1px solid hsl(var(--border))",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.80)",
                }}
              >
                <div className="p-2" style={{ borderBottom: "1px solid hsl(var(--border))" }}>
                  <input
                    type="text"
                    value={locSearch}
                    onChange={e => setLocSearch(e.target.value)}
                    placeholder="Search district..."
                    autoFocus
                    className="w-full px-2 py-1.5 rounded-lg text-xs outline-none bg-transparent text-white placeholder:text-white/30"
                    style={{ border: "1px solid hsl(var(--border))" }}
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  <button
                    onClick={() => handleLoc("")}
                    className="w-full text-left px-3 py-2 text-xs transition-all"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    All Districts
                  </button>
                  {filteredCities.map(c => (
                    <button
                      key={c}
                      onClick={() => handleLoc(c)}
                      className="w-full text-left px-3 py-2 text-xs transition-all"
                      style={{
                        color: loc === c ? "#26d97a" : "rgba(255,255,255,0.70)",
                        backgroundColor: loc === c ? "rgba(0,122,51,0.12)" : "transparent",
                        fontWeight: loc === c ? 600 : 400,
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active filter chips */}
        {(loc || category !== "All Categories") && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Active:</span>
            {category !== "All Categories" && (
              <span className="badge-blue text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                {category}
                <button onClick={() => handleCategory("All Categories")} className="ml-1 hover:text-white">×</button>
              </span>
            )}
            {loc && (
              <span className="badge-green text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                <MapPin size={9} /> {loc}
                <button onClick={() => handleLoc("")} className="ml-1 hover:text-white">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Grid ──────────────────────────────────────────────── */}
      {items.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag size={48} className="mx-auto mb-3" style={{ color: "rgba(255,255,255,0.15)" }} />
          <h3 className="text-lg font-bold text-white mb-1">No items found</h3>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.40)" }}>Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <p className="text-xs font-medium mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
            {total} item{total !== 1 ? "s" : ""} found
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {items.map(item => {
              const catColor = CATEGORY_COLORS[item.category] ?? "rgba(255,255,255,0.45)";
              return (
                <Link key={item.id} href={`/marketplace/${item.id}`}>
                  <div
                    className="rounded-xl overflow-hidden card-hover cursor-pointer"
                    style={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--card-border))",
                      boxShadow: "var(--shadow-card)",
                    }}
                  >
                    <div className="aspect-square flex items-center justify-center overflow-hidden" style={{ backgroundColor: "hsl(var(--muted))" }}>
                      {item.images?.[0] ? (
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <ShoppingBag size={28} style={{ color: "rgba(255,255,255,0.18)" }} />
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-semibold line-clamp-2 mb-1 text-white leading-tight">{item.title}</h3>
                      <div className="text-sm font-black mb-1.5" style={{ color: "#6babff" }}>{formatMK(item.price)}</div>
                      <div className="flex items-center gap-1 text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.38)" }}>
                        <MapPin size={9} />{item.location}
                      </div>
                      <div className="flex items-center gap-1 flex-wrap">
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${catColor}18`,
                            color: catColor,
                            border: `1px solid ${catColor}35`,
                          }}
                        >
                          {item.category}
                        </span>
                        {item.is_featured && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full badge-amber">★</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-30"
                style={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  color: "rgba(255,255,255,0.70)",
                }}
              >
                ← Prev
              </button>
              <span className="px-4 py-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-30"
                style={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  color: "rgba(255,255,255,0.70)",
                }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Close dropdown backdrop */}
      {showLocDropdown && (
        <div className="fixed inset-0 z-40" onClick={() => setShowLocDropdown(false)} />
      )}
    </div>
  );
}
