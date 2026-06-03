import { Link } from "wouter";
import { ShoppingBag, ArrowRight, Tag, MapPin, Zap } from "lucide-react";
import { MOCK_ITEMS } from "@/lib/mockData";
import { formatMK } from "@/lib/utils";

export default function HomePage() {
  const featured = MOCK_ITEMS.filter(i => i.is_featured).slice(0, 4);
  const recent = MOCK_ITEMS.slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 page-enter">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[hsl(215,55%,18%)] to-[hsl(210,100%,25%)] rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
            <ShoppingBag size={16} />
          </div>
          <span className="text-xs font-bold text-white/60 uppercase tracking-wider">BlinkBuy Marketplace</span>
        </div>
        <h1 className="text-2xl font-black mb-2">Buy & Sell Across Malawi</h1>
        <p className="text-white/65 text-sm mb-5">
          Phones, furniture, vehicles, farm produce and more — from sellers in all 28 districts.
        </p>
        <div className="flex gap-3">
          <Link
            href="/marketplace"
            className="flex items-center gap-2 bg-white text-[hsl(215,55%,18%)] px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all"
          >
            Browse All <ArrowRight size={14} />
          </Link>
          <Link
            href="/post-item"
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            + Sell Item
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "Active Listings", value: "1,200+", icon: Tag },
          { label: "Districts", value: "28", icon: MapPin },
          { label: "Fast Deals", value: "Daily", icon: Zap },
        ].map(s => (
          <div key={s.label} className="bg-card border border-card-border rounded-xl p-4 text-center">
            <s.icon size={18} className="text-primary mx-auto mb-1" />
            <div className="text-lg font-black">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Featured */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-lg">⭐ Featured Listings</h2>
          <Link href="/marketplace" className="text-xs text-primary hover:underline">See all</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {featured.map(item => (
            <Link key={item.id} href={`/marketplace/${item.id}`}>
              <div className="bg-card border border-card-border rounded-xl overflow-hidden card-hover cursor-pointer">
                <div className="aspect-square bg-muted overflow-hidden">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-bold line-clamp-2 mb-1">{item.title}</h3>
                  <div className="text-sm font-black text-primary">{formatMK(item.price)}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <MapPin size={9} />{item.location}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-lg">🆕 Recently Listed</h2>
          <Link href="/marketplace" className="text-xs text-primary hover:underline">See all</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {recent.map(item => (
            <Link key={item.id} href={`/marketplace/${item.id}`}>
              <div className="bg-card border border-card-border rounded-xl overflow-hidden card-hover cursor-pointer">
                <div className="aspect-square bg-muted overflow-hidden">
                  {item.images[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag size={24} className="text-muted-foreground opacity-30" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-xs font-bold line-clamp-2 mb-1">{item.title}</h3>
                  <div className="text-sm font-black text-primary">{formatMK(item.price)}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <MapPin size={9} />{item.location}
                  </div>
                  {item.is_featured && (
                    <span className="inline-block bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full mt-1">⭐ Featured</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
