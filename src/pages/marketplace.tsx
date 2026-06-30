import { useState, useMemo, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { Search, ShoppingBag, MapPin, X, Heart, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import SmartSearchBar from "@/components/SmartSearchBar";
import { MOCK_ITEMS, CATEGORIES, CITIES } from "@/lib/mockData";
import { formatMK } from "@/lib/utils";

const PAGE_SIZE = 12;

const CATEGORY_ICONS: Record<string, string> = {
  "All Categories": "🛍️", "Electronics": "💻", "Phones": "📱",
  "Clothing": "👗", "Food": "🥑", "Furniture": "🛋️",
  "Tools": "🔧", "Vehicles": "🚗", "Farm Produce": "🌽",
  "Books": "📚", "Other": "📦",
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "featured", label: "Featured First" },
];

const PRICE_RANGES = [
  { label: "Any", min: 0, max: Infinity },
  { label: "Under MK 50k", min: 0, max: 50000 },
  { label: "MK 50k–200k", min: 50000, max: 200000 },
  { label: "MK 200k–500k", min: 200000, max: 500000 },
  { label: "MK 500k+", min: 500000, max: Infinity },
];

export default function MarketplacePage() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);

  const [search, setSearch] = useState(params.get("q") || "");
  const [category, setCategory] = useState(params.get("cat") || "All Categories");
  const [loc, setLoc] = useState("");
  const [locSearch, setLocSearch] = useState("");
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState(0); // index into PRICE_RANGES
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wishlist") || "[]")); }
    catch { return new Set(); }
  });

  useEffect(() => {
    const q = params.get("q") || "";
    const cat = params.get("cat") || "All Categories";
    setSearch(q);
    setCategory(cat);
    setPage(1);
  }, [searchStr]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("wishlist", JSON.stringify([...next]));
      return next;
    });
  };

  const filteredCities = CITIES.filter(c => c.toLowerCase().includes(locSearch.toLowerCase()));

  const filtered = useMemo(() => {
    const range = PRICE_RANGES[priceRange];
    let result = MOCK_ITEMS.filter(item => {
      if (search && !item.title.toLowerCase().includes(search.toLowerCase()) &&
          !item.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== "All Categories" && item.category !== category) return false;
      if (loc && item.location !== loc) return false;
      const price = item.price ?? 0;
      if (price < range.min || price > range.max) return false;
      return true;
    });

    if (sortBy === "price_asc") result = [...result].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    else if (sortBy === "price_desc") result = [...result].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    else if (sortBy === "featured") result = [...result].sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    else result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return result;
  }, [search, category, loc, sortBy, priceRange]);

  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleCategory = (v: string) => { setCategory(v); setPage(1); };
  const handleLoc = (v: string) => { setLoc(v); setLocSearch(""); setShowLocDropdown(false); setPage(1); };
  const clearAll = () => { setSearch(""); setCategory("All Categories"); setLoc(""); setPriceRange(0); setPage(1); };

  const hasFilters = search || category !== "All Categories" || loc || priceRange > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-foreground mb-0.5">Marketplace</h1>
          <p className="text-muted-foreground text-xs font-medium">
            {total} item{total !== 1 ? "s" : ""} available across Malawi
          </p>
        </div>
        <Link
          href="/post-item"
          className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-lg hover:shadow-pink-500/50"
        >
          + Sell Something
        </Link>
      </div>

      {/* Single Search Bar + Controls Row */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <SmartSearchBar
            value={search}
            onChange={handleSearch}
            onSubmit={handleSearch}
            placeholder="Search items, brands, models, districts..."
          />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={e => { setSortBy(e.target.value); setPage(1); }}
            className="appearance-none pl-9 pr-4 py-3 rounded-xl border border-pink-500/20 bg-card text-sm font-semibold outline-none focus:border-pink-500 cursor-pointer hidden sm:block"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none hidden sm:block" />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
            hasFilters ? "border-pink-500 text-pink-500 bg-pink-500/10" : "border-border text-foreground hover:border-pink-500/40"
          }`}
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filters</span>
          {hasFilters && <span className="w-2 h-2 rounded-full bg-pink-500" />}
        </button>
      </div>

      {/* Filters Dropdown */}
      {showFilters && (
        <div className="bg-card border border-pink-500/20 rounded-xl p-4 mb-4 space-y-4">
          {/* Category Filter */}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Category</p>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                    category === cat
                      ? "border-pink-500 bg-pink-500/15 text-pink-500"
                      : "border-border text-muted-foreground hover:border-pink-500/40 hover:text-foreground"
                  }`}
                >
                  {CATEGORY_ICONS[cat]} {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Price Range</p>
            <div className="flex gap-2 flex-wrap">
              {PRICE_RANGES.map((r, i) => (
                <button
                  key={r.label}
                  onClick={() => { setPriceRange(i); setPage(1); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                    priceRange === i
                      ? "border-pink-500 bg-pink-500/15 text-pink-500"
                      : "border-border text-muted-foreground hover:border-pink-500/40 hover:text-foreground"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* District Filter */}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">District</p>
            <div className="relative">
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-pink-500/20 bg-background text-sm cursor-pointer hover:border-pink-500/40 font-medium"
                onClick={() => setShowLocDropdown(!showLocDropdown)}
              >
                <MapPin size={13} className="text-muted-foreground shrink-0" />
                <span className={loc ? "text-foreground" : "text-muted-foreground"}>{loc || "All Districts"}</span>
              </div>
              {showLocDropdown && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-card border border-pink-500/30 rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-2 border-b border-border">
                    <input
                      type="text"
                      value={locSearch}
                      onChange={e => setLocSearch(e.target.value)}
                      placeholder="Search district..."
                      className="w-full px-3 py-2 rounded-lg border border-pink-500/20 bg-background text-xs outline-none focus:border-pink-500"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    <button onClick={() => handleLoc("")} className="w-full text-left px-4 py-2.5 text-sm hover:bg-pink-500/10 text-muted-foreground font-medium">All Districts</button>
                    {filteredCities.map(c => (
                      <button
                        key={c}
                        onClick={() => handleLoc(c)}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-pink-500/10 font-medium ${loc === c ? "text-pink-500 font-bold" : "text-foreground"}`}
                      >{c}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile sort (inside filters) */}
          <div className="sm:hidden">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Sort By</p>
            <div className="flex gap-2 flex-wrap">
              {SORT_OPTIONS.map(o => (
                <button key={o.value} onClick={() => { setSortBy(o.value); setPage(1); }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    sortBy === o.value ? "border-pink-500 bg-pink-500/15 text-pink-500" : "border-border text-muted-foreground"
                  }`}
                >{o.label}</button>
              ))}
            </div>
          </div>

          {hasFilters && (
            <button onClick={clearAll} className="flex items-center gap-1.5 text-xs text-pink-500 font-bold hover:text-pink-600 transition-colors">
              <X size={12} /> Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Active Filter Pills */}
      {hasFilters && !showFilters && (
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {search && (
            <div className="inline-flex items-center gap-1.5 bg-pink-500/10 text-pink-600 text-xs px-3 py-1.5 rounded-full border border-pink-500/30 font-medium">
              <Search size={10} /> "{search}"
              <button onClick={() => handleSearch("")} className="ml-1 hover:text-pink-800">×</button>
            </div>
          )}
          {category !== "All Categories" && (
            <div className="inline-flex items-center gap-1.5 bg-pink-500/10 text-pink-600 text-xs px-3 py-1.5 rounded-full border border-pink-500/30 font-medium">
              {CATEGORY_ICONS[category]} {category}
              <button onClick={() => handleCategory("All Categories")} className="ml-1 hover:text-pink-800">×</button>
            </div>
          )}
          {loc && (
            <div className="inline-flex items-center gap-1.5 bg-pink-500/10 text-pink-600 text-xs px-3 py-1.5 rounded-full border border-pink-500/30 font-medium">
              <MapPin size={10} /> {loc}
              <button onClick={() => handleLoc("")} className="ml-1 hover:text-pink-800">×</button>
            </div>
          )}
          {priceRange > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-pink-500/10 text-pink-600 text-xs px-3 py-1.5 rounded-full border border-pink-500/30 font-medium">
              💰 {PRICE_RANGES[priceRange].label}
              <button onClick={() => setPriceRange(0)} className="ml-1 hover:text-pink-800">×</button>
            </div>
          )}
        </div>
      )}

      {/* PRODUCTS GRID */}
      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={28} className="text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-lg font-bold mb-2">No items found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">Try adjusting your search or filters.</p>
          <button
            onClick={clearAll}
            className="inline-flex items-center gap-2 bg-pink-500/10 text-pink-600 hover:bg-pink-500/20 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border border-pink-500/30"
          >
            <X size={14} /> Clear Filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground font-semibold mb-4">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} items
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5 mb-8">
            {items.map((item, i) => (
              <Link key={item.id} href={`/marketplace/${item.id}`}>
                <div
                  className="bg-card border border-pink-500/20 hover:border-pink-500/50 rounded-xl overflow-hidden card-hover cursor-pointer group relative"
                  style={{ animationDelay: `${(i % 6) * 30}ms` }}
                >
                  <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden relative">
                    {item.images?.[0] ? (
                      <>
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300" />
                      </>
                    ) : (
                      <ShoppingBag size={24} className="text-muted-foreground opacity-30" />
                    )}

                    {item.is_featured && (
                      <div className="absolute top-2 left-2 badge-featured text-[10px] px-1.5 py-0.5">⭐</div>
                    )}

                    <button
                      onClick={e => toggleWishlist(item.id, e)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Heart
                        size={12}
                        className={wishlist.has(item.id) ? "text-pink-400 fill-pink-400" : "text-white"}
                        strokeWidth={2}
                      />
                    </button>
                  </div>

                  <div className="p-3">
                    <h3 className="text-xs font-bold line-clamp-2 mb-1.5 group-hover:text-pink-500 transition-colors">{item.title}</h3>
                    <div className="text-sm font-black text-pink-500 mb-1">{formatMK(item.price)}</div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                      <MapPin size={9} />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2.5 rounded-xl border border-pink-500/20 text-sm font-bold hover:border-pink-500 hover:text-pink-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ← Prev
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pn = i + 1;
                  return (
                    <button
                      key={pn}
                      onClick={() => setPage(pn)}
                      className={`w-9 h-9 rounded-xl font-bold text-sm transition-all ${
                        page === pn
                          ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white"
                          : "border border-border hover:border-pink-500 hover:text-pink-500"
                      }`}
                    >{pn}</button>
                  );
                })}
              </div>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2.5 rounded-xl border border-pink-500/20 text-sm font-bold hover:border-pink-500 hover:text-pink-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {showLocDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowLocDropdown(false)} />}
    </div>
  );
}
