import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search, ShoppingBag, MapPin, Filter, X } from "lucide-react";
import { MOCK_ITEMS, CATEGORIES, CITIES } from "@/lib/mockData";
import { formatMK } from "@/lib/utils";

const PAGE_SIZE = 12;

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [loc, setLoc] = useState("");
  const [locSearch, setLocSearch] = useState("");
  const [showLocDropdown, setShowLocDropdown] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [page, setPage] = useState(1);

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

  const handleSearch = (v: string) => { setSearch(v); setPage(1); };
  const handleCategory = (v: string) => { setCategory(v); setPage(1); };
  const handleLoc = (v: string) => { setLoc(v); setLocSearch(""); setShowLocDropdown(false); setPage(1); };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-foreground mb-1">Marketplace</h1>
          <p className="text-muted-foreground text-sm font-medium">
            {total} premium item{total !== 1 ? "s" : ""} available
          </p>
        </div>
        <Link
          href="/post-item"
          className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-pink-500/50 border border-pink-400/30"
        >
          + Sell Something
        </Link>
      </div>

      {/* PREMIUM SEARCH & FILTERS */}
      <div className="bg-card border border-pink-500/20 rounded-xl p-5 mb-8 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row gap-3 mb-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search items, brands, models..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-pink-500/20 bg-background text-sm outline-none transition-all duration-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 font-medium"
            />
          </div>

          {/* Category Select */}
          <select
            value={category}
            onChange={e => handleCategory(e.target.value)}
            className="px-4 py-3 rounded-lg border border-pink-500/20 bg-background text-sm outline-none transition-all duration-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 font-medium lg:w-52 cursor-pointer"
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>

          {/* District Dropdown */}
          <div className="relative lg:w-52">
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-lg border border-pink-500/20 bg-background text-sm cursor-pointer transition-all duration-200 hover:border-pink-500/40 font-medium"
              onClick={() => setShowLocDropdown(!showLocDropdown)}
            >
              <MapPin size={14} className="text-muted-foreground shrink-0" />
              <span className={loc ? "text-foreground" : "text-muted-foreground"}>
                {loc || "All Districts"}
              </span>
            </div>

            {showLocDropdown && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-card border border-pink-500/30 rounded-xl shadow-xl z-50 overflow-hidden backdrop-blur-sm">
                <div className="p-2.5 border-b border-border">
                  <input
                    type="text"
                    value={locSearch}
                    onChange={e => setLocSearch(e.target.value)}
                    placeholder="Search district..."
                    className="w-full px-3 py-2 rounded-lg border border-pink-500/20 bg-background text-xs outline-none focus:border-pink-500 font-medium"
                    autoFocus
                  />
                </div>
                <div className="max-h-56 overflow-y-auto">
                  <button
                    onClick={() => handleLoc("")}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-pink-500/10 transition-all text-muted-foreground hover:text-pink-500 font-medium"
                  >
                    All Districts
                  </button>
                  {filteredCities.map(c => (
                    <button
                      key={c}
                      onClick={() => handleLoc(c)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-pink-500/10 transition-all font-medium ${
                        loc === c 
                          ? "text-pink-500 font-bold border-l-2 border-pink-500 pl-3" 
                          : "text-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {(loc || category !== "All Categories" || search) && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground font-semibold">Filters:</span>
            
            {search && (
              <div className="inline-flex items-center gap-2 bg-pink-500/10 text-pink-600 text-xs px-3 py-1.5 rounded-full border border-pink-500/30 font-medium">
                <span>"{search}"</span>
                <button 
                  onClick={() => handleSearch("")} 
                  className="hover:text-pink-700 ml-1"
                >
                  ×
                </button>
              </div>
            )}

            {category !== "All Categories" && (
              <div className="inline-flex items-center gap-2 bg-pink-500/10 text-pink-600 text-xs px-3 py-1.5 rounded-full border border-pink-500/30 font-medium">
                <span>{category}</span>
                <button 
                  onClick={() => handleCategory("All Categories")} 
                  className="hover:text-pink-700 ml-1"
                >
                  ×
                </button>
              </div>
            )}

            {loc && (
              <div className="inline-flex items-center gap-2 bg-pink-500/10 text-pink-600 text-xs px-3 py-1.5 rounded-full border border-pink-500/30 font-medium">
                <MapPin size={10} />
                <span>{loc}</span>
                <button 
                  onClick={() => handleLoc("")} 
                  className="hover:text-pink-700 ml-1"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* PRODUCTS GRID */}
      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={32} className="text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-foreground">No items found</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-6">
            Try adjusting your search or filters. Browse all items by clearing the filters.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setCategory("All Categories");
              setLoc("");
              setPage(1);
            }}
            className="inline-flex items-center gap-2 bg-pink-500/10 text-pink-600 hover:bg-pink-500/20 px-4 py-2.5 rounded-lg text-sm font-bold transition-all border border-pink-500/30"
          >
            <X size={14} />
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Results Count */}
          <p className="text-xs text-muted-foreground font-semibold mb-4">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} items
          </p>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
            {items.map((item, i) => (
              <Link key={item.id} href={`/marketplace/${item.id}`}>
                <div 
                  className="bg-card border border-pink-500/20 hover:border-pink-500/50 rounded-xl overflow-hidden card-hover cursor-pointer group relative"
                  style={{ animationDelay: `${(i % 6) * 30}ms` }}
                >
                  {/* Image Container */}
                  <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden relative">
                    {item.images?.[0] ? (
                      <>
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                      </>
                    ) : (
                      <ShoppingBag size={24} className="text-muted-foreground opacity-30" />
                    )}

                    {/* Featured Badge */}
                    {item.is_featured && (
                      <div className="absolute top-2 right-2 badge-featured text-xs">
                        ⭐ Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    <h3 className="text-xs font-bold line-clamp-2 mb-2 group-hover:text-pink-500 transition-colors">
                      {item.title}
                    </h3>
                    <div className="text-sm font-black text-pink-500 mb-1.5">
                      {formatMK(item.price)}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                      <MapPin size={10} />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-5 py-2.5 rounded-lg border border-pink-500/20 text-sm font-bold hover:border-pink-500 hover:text-pink-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = page === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-bold text-sm transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white border border-pink-500"
                          : "border border-border text-foreground hover:border-pink-500 hover:text-pink-500"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= totalPages}
                className="px-5 py-2.5 rounded-lg border border-pink-500/20 text-sm font-bold hover:border-pink-500 hover:text-pink-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {showLocDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowLocDropdown(false)} 
        />
      )}
    </div>
  );
}
