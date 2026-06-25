import { useState } from "react";
import { Link } from "wouter";
import { ShoppingBag, ArrowRight, Tag, MapPin, Zap, Sparkles, TrendingUp, Heart, ChevronRight } from "lucide-react";
import { MOCK_ITEMS, CATEGORIES } from "@/lib/mockData";
import { formatMK } from "@/lib/utils";
import FeaturedDeals from "@/components/FeaturedDeals";

const CATEGORY_ICONS: Record<string, string> = {
  "Electronics": "💻",
  "Phones": "📱",
  "Clothing": "👗",
  "Food": "🥑",
  "Furniture": "🛋️",
  "Tools": "🔧",
  "Vehicles": "🚗",
  "Farm Produce": "🌽",
  "Books": "📚",
  "Other": "📦",
};

export default function HomePage() {
  const [, navigate] = useLocation();
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wishlist") || "[]")); }
    catch { return new Set(); }
  });

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("wishlist", JSON.stringify([...next]));
      return next;
    });
  };

  const featured = MOCK_ITEMS.filter(i => i.is_featured).slice(0, 4);
  const recent = MOCK_ITEMS.slice(0, 8);
  const categories = CATEGORIES.filter(c => c !== "All Categories");

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 page-enter">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-2xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2a0a2a] to-[#1a1a1a]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-700/20 rounded-full blur-3xl opacity-30" />

        <div className="relative px-6 md:px-10 py-10 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={14} className="text-pink-400" />
            <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">Premium Marketplace</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight">
            Buy &amp; Sell Across<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600">
              All 28 Districts
            </span>
          </h1>

          <p className="text-white/65 text-sm md:text-base mb-9 max-w-xl font-light">
            Discover thousands of items from trusted local sellers. Fast, safe, and exclusively for Malawi.
          </p>

          <div className="flex gap-3 flex-wrap">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-white/20 hover:border-pink-500/40 backdrop-blur-sm"
            >
              <ShoppingBag size={15} strokeWidth={2.5} />
              Browse All
              <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
            <Link
              href="/post-item"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/80 to-pink-600/80 hover:from-pink-500 hover:to-pink-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-pink-400/20"
            >
              <Zap size={15} strokeWidth={2.5} />
              Start Selling
            </Link>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {[
          { label: "Active Listings", value: "1,200+", icon: Tag },
          { label: "Districts", value: "28", icon: MapPin },
          { label: "Daily Deals", value: "Fast", icon: TrendingUp },
        ].map(s => (
          <div
            key={s.label}
            className="group bg-card border border-pink-500/20 hover:border-pink-500/40 rounded-xl p-4 text-center transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <s.icon size={18} className="text-pink-500 mx-auto mb-1.5 group-hover:scale-110 transition-transform" />
              <div className="text-xl font-black text-foreground">{s.value}</div>
              <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* FLASH DEALS */}
      <FeaturedDeals />

      {/* CATEGORIES */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-black text-xl mb-0.5">Browse Categories</h2>
            <p className="text-xs text-muted-foreground font-medium">Find exactly what you need</p>
          </div>
          <Link href="/marketplace" className="text-xs text-pink-500 hover:text-pink-600 font-bold flex items-center gap-1">
            All <ChevronRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
          {categories.map(cat => (
            <Link
              key={cat}
              href={`/marketplace?cat=${encodeURIComponent(cat)}`}
              className="group flex flex-col items-center gap-2 p-3 bg-card border border-pink-500/15 hover:border-pink-500/50 rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-pink-500/10 cursor-pointer"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                {CATEGORY_ICONS[cat] || "📦"}
              </span>
              <span className="text-[10px] font-bold text-center text-muted-foreground group-hover:text-pink-500 transition-colors leading-tight line-clamp-1">
                {cat}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* FEATURED */}
      <div className="mb-10 slide-up">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-black text-xl mb-0.5">⭐ Featured Listings</h2>
            <p className="text-xs text-muted-foreground font-medium">Premium items handpicked for you</p>
          </div>
          <Link href="/marketplace" className="text-xs text-pink-500 hover:text-pink-600 font-bold flex items-center gap-1">
            View All <ChevronRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((item, i) => (
            <Link key={item.id} href={`/marketplace/${item.id}`}>
              <div
                className="bg-card border border-pink-500/20 hover:border-pink-500/50 rounded-xl overflow-hidden card-hover cursor-pointer group relative"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 overflow-hidden relative">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  <div className="absolute top-2 left-2 badge-featured text-[10px] px-2 py-0.5">⭐ Featured</div>
                  <button
                    onClick={e => toggleWishlist(item.id, e)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-all"
                  >
                    <Heart
                      size={13}
                      className={wishlist.has(item.id) ? "text-pink-400 fill-pink-400" : "text-white"}
                      strokeWidth={2}
                    />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-bold line-clamp-2 mb-1.5 group-hover:text-pink-500 transition-colors">{item.title}</h3>
                  <div className="text-base font-black text-pink-500 mb-1">{formatMK(item.price)}</div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                    <MapPin size={10} />{item.location}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* RECENTLY LISTED */}
      <div className="slide-up">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-black text-xl mb-0.5">🆕 Recently Listed</h2>
            <p className="text-xs text-muted-foreground font-medium">Latest items added today</p>
          </div>
          <Link href="/marketplace" className="text-xs text-pink-500 hover:text-pink-600 font-bold flex items-center gap-1">
            See More <ChevronRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {recent.map((item, i) => (
            <Link key={item.id} href={`/marketplace/${item.id}`}>
              <div
                className="bg-card border border-pink-500/20 hover:border-pink-500/50 rounded-xl overflow-hidden card-hover cursor-pointer group"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden relative">
                  {item.images[0] ? (
                    <>
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                    </>
                  ) : (
                    <ShoppingBag size={28} className="text-muted-foreground opacity-30" />
                  )}
                  <button
                    onClick={e => toggleWishlist(item.id, e)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-all"
                  >
                    <Heart
                      size={13}
                      className={wishlist.has(item.id) ? "text-pink-400 fill-pink-400" : "text-white"}
                      strokeWidth={2}
                    />
                  </button>
                  <div className="absolute top-2 left-2 badge-new text-[10px] px-2 py-0.5">NEW</div>
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-bold line-clamp-2 mb-1.5 group-hover:text-pink-500 transition-colors">{item.title}</h3>
                  <div className="text-base font-black text-pink-500 mb-1">{formatMK(item.price)}</div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                    <MapPin size={10} />{item.location}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-14 relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] to-[#2a0a2a]" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl opacity-20" />
        <div className="relative px-6 md:px-10 py-12 text-center">
          <h3 className="text-2xl md:text-3xl font-black mb-2 text-white">Ready to Sell?</h3>
          <p className="text-white/60 mb-6 max-w-xl mx-auto text-sm">
            List your items and reach buyers across all 28 districts of Malawi today.
          </p>
          <Link
            href="/post-item"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-pink-500/50 border border-pink-400/30"
          >
            <Zap size={16} strokeWidth={3} />
            Start Selling Now
            <ArrowRight size={16} strokeWidth={3} />
          </Link>
        </div>
      </div>
    </div>
  );
}
