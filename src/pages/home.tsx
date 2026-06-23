import { Link } from "wouter";
import { ShoppingBag, ArrowRight, Tag, MapPin, Zap, Sparkles, TrendingUp } from "lucide-react";
import { MOCK_ITEMS } from "@/lib/mockData";
import { formatMK } from "@/lib/utils";

export default function HomePage() {
  const featured = MOCK_ITEMS.filter(i => i.is_featured).slice(0, 4);
  const recent = MOCK_ITEMS.slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 page-enter">
      {/* PREMIUM HERO SECTION */}
      <div className="relative overflow-hidden rounded-2xl mb-10">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2a0a2a] to-[#1a1a1a]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl opacity-20" />

        <div className="relative px-6 md:px-10 py-12 text-white">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center border border-pink-500/40">
              <Sparkles size={18} className="text-pink-400" />
            </div>
            <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">✨ EXCLUSIVE MARKETPLACE</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">
            Buy & Sell Across<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600">
              Malawi Premium
            </span>
          </h1>

          <p className="text-white/70 text-base md:text-lg mb-8 max-w-2xl font-light">
            Discover thousands of premium items from trusted sellers in all 28 districts. Fast, secure, and exclusive marketplace experience.
          </p>

          <div className="flex gap-3 flex-wrap">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-pink-500/50 border border-pink-400/30"
            >
              <ShoppingBag size={16} strokeWidth={2.5} />
              Explore Marketplace
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>

            <Link
              href="/post-item"
              className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/15 text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 border border-white/20 hover:border-pink-500/40 backdrop-blur-sm"
            >
              <Zap size={16} strokeWidth={2.5} />
              Start Selling
            </Link>
          </div>
        </div>
      </div>

      {/* STATS BAR - Premium Cards */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        {[
          { label: "Active Listings", value: "1,200+", icon: Tag, color: "pink" },
          { label: "Districts", value: "28", icon: MapPin, color: "purple" },
          { label: "Fast Deals", value: "Daily", icon: TrendingUp, color: "red" },
        ].map((s, i) => (
          <div 
            key={s.label}
            className="group relative bg-card border border-pink-500/20 hover:border-pink-500/40 rounded-xl p-5 text-center transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <s.icon size={20} className="text-pink-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-black text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground font-semibold mt-1">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* FEATURED SECTION */}
      <div className="mb-12 slide-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-black text-2xl mb-1">⭐ Featured Listings</h2>
            <p className="text-xs text-muted-foreground font-medium">Premium items handpicked for you</p>
          </div>
          <Link 
            href="/marketplace" 
            className="text-sm text-pink-500 hover:text-pink-600 font-bold transition-colors underline underline-offset-2"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {featured.map((item, i) => (
            <Link key={item.id} href={`/marketplace/${item.id}`}>
              <div 
                className="bg-card border border-pink-500/20 hover:border-pink-500/50 rounded-xl overflow-hidden card-hover cursor-pointer group"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Image Container */}
                <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 overflow-hidden relative">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  {/* Overlay Badge */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  {item.is_featured && (
                    <div className="absolute top-2 right-2 badge-featured">
                      ⭐ Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-bold line-clamp-2 mb-2 group-hover:text-pink-500 transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-lg font-black text-pink-500 mb-2">
                    {formatMK(item.price)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                    <MapPin size={12} />
                    {item.location}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* RECENTLY LISTED SECTION */}
      <div className="slide-up">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-black text-2xl mb-1">🆕 Recently Listed</h2>
            <p className="text-xs text-muted-foreground font-medium">Latest items added to marketplace</p>
          </div>
          <Link 
            href="/marketplace" 
            className="text-sm text-pink-500 hover:text-pink-600 font-bold transition-colors underline underline-offset-2"
          >
            See More →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {recent.map((item, i) => (
            <Link key={item.id} href={`/marketplace/${item.id}`}>
              <div 
                className="bg-card border border-pink-500/20 hover:border-pink-500/50 rounded-xl overflow-hidden card-hover cursor-pointer group"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Image Container */}
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
                  
                  {/* New Badge */}
                  <div className="absolute top-2 right-2 badge-new">
                    NEW
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-bold line-clamp-2 mb-2 group-hover:text-pink-500 transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-lg font-black text-pink-500 mb-2">
                    {formatMK(item.price)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                    <MapPin size={12} />
                    {item.location}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="mt-16 relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-pink-600/10" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl opacity-20" />
        
        <div className="relative px-6 md:px-10 py-12 text-center">
          <h3 className="text-2xl md:text-3xl font-black mb-2 text-foreground">Ready to Sell?</h3>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join thousands of sellers on BlinkBuy Malawi's premium marketplace. List your items today and reach buyers across all 28 districts.
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
