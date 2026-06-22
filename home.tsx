import { Link } from "wouter";
import { ShoppingBag, ArrowRight, Tag, MapPin, Zap, TrendingUp } from "lucide-react";
import { MOCK_ITEMS } from "@/lib/mockData";
import { formatMK } from "@/lib/utils";

export default function HomePage() {
  const featured = MOCK_ITEMS.filter(i => i.is_featured).slice(0, 4);
  const recent = MOCK_ITEMS.slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 page-enter">

      {/* ── Hero Banner ───────────────────────────────────────── */}
      <div
        className="relative rounded-2xl overflow-hidden p-6 mb-8"
        style={{
          background: "linear-gradient(135deg, #0a0a0a 0%, #0d1f3c 60%, #0a1a0e 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 4px 40px rgba(0,0,0,0.60)",
        }}
      >
        {/* Decorative accent lines */}
        <div className="absolute inset-y-0 left-0 w-1 flex flex-col">
          <div className="flex-1" style={{ backgroundColor: "#121212" }} />
          <div className="flex-1" style={{ backgroundColor: "#CE1126" }} />
          <div className="flex-1" style={{ backgroundColor: "#007A33" }} />
        </div>

        <div className="ml-4">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(0,71,171,0.25)", border: "1px solid rgba(0,71,171,0.40)" }}
            >
              <ShoppingBag size={15} style={{ color: "#6babff" }} />
            </div>
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#007A33" }}>
              BlinkBuy Marketplace
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black mb-2 text-white leading-tight">
            Buy &amp; Sell<br className="sm:hidden" /> Across Malawi 🇲🇼
          </h1>
          <p className="text-sm mb-6 max-w-md" style={{ color: "rgba(255,255,255,0.55)" }}>
            Phones, furniture, vehicles, farm produce and more — from verified sellers in all 28 districts.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/marketplace"
              className="flex items-center gap-2 btn-primary px-5 py-2.5 rounded-xl text-sm"
            >
              Browse All <ArrowRight size={14} />
            </Link>
            <Link
              href="/post-item"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ backgroundColor: "rgba(0,122,51,0.25)", border: "1px solid rgba(0,122,51,0.45)" }}
            >
              + Sell Item
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats Bar ─────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "Active Listings", value: "1,200+", icon: Tag,        color: "#0047AB", bg: "rgba(0,71,171,0.15)"  },
          { label: "Districts",       value: "28",     icon: MapPin,      color: "#007A33", bg: "rgba(0,122,51,0.15)" },
          { label: "Fast Deals",      value: "Daily",  icon: Zap,         color: "#CE1126", bg: "rgba(206,17,38,0.15)"},
        ].map(s => (
          <div
            key={s.label}
            className="rounded-xl p-4 text-center"
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--card-border))",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div
              className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center"
              style={{ backgroundColor: s.bg }}
            >
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div className="text-lg font-black text-white">{s.value}</div>
            <div className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Featured Listings ─────────────────────────────────── */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} style={{ color: "#CE1126" }} />
            <h2 className="font-black text-lg text-white">Featured Listings</h2>
          </div>
          <Link href="/marketplace" className="text-xs font-semibold transition-colors" style={{ color: "#6babff" }}>
            See all →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {featured.map(item => (
            <Link key={item.id} href={`/marketplace/${item.id}`}>
              <div
                className="rounded-xl overflow-hidden card-hover cursor-pointer"
                style={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--card-border))",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div className="aspect-square overflow-hidden" style={{ backgroundColor: "hsl(var(--muted))" }}>
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h3 className="text-xs font-semibold line-clamp-2 text-white leading-tight">{item.title}</h3>
                  </div>
                  <div className="text-sm font-black mb-1" style={{ color: "#6babff" }}>{formatMK(item.price)}</div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
                    <MapPin size={9} />{item.location}
                  </div>
                  <span className="inline-block mt-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full badge-amber">
                    ★ Featured
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recently Listed ───────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap size={16} style={{ color: "#007A33" }} />
            <h2 className="font-black text-lg text-white">Recently Listed</h2>
          </div>
          <Link href="/marketplace" className="text-xs font-semibold transition-colors" style={{ color: "#6babff" }}>
            See all →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {recent.map(item => (
            <Link key={item.id} href={`/marketplace/${item.id}`}>
              <div
                className="rounded-xl overflow-hidden card-hover cursor-pointer"
                style={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--card-border))",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div className="aspect-square overflow-hidden" style={{ backgroundColor: "hsl(var(--muted))" }}>
                  {item.images[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag size={24} style={{ color: "rgba(255,255,255,0.20)" }} />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-semibold line-clamp-2 mb-1 text-white leading-tight">{item.title}</h3>
                  <div className="text-sm font-black mb-1" style={{ color: "#6babff" }}>{formatMK(item.price)}</div>
                  <div className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
                    <MapPin size={9} />{item.location}
                  </div>
                  {item.is_featured && (
                    <span className="inline-block mt-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full badge-amber">
                      ★ Featured
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
