import { Link } from "wouter";
import { ShoppingBag, Heart, MapPin, TrendingUp } from "lucide-react";
import { useState } from "react";

interface SimilarItem {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  location: string;
  rating?: number;
  discount?: number;
  isSale?: boolean;
}

interface SmartRecommendationsProps {
  currentItemId: string;
  items?: SimilarItem[];
  title?: string;
}

export default function SmartRecommendations({
  currentItemId,
  items = [],
  title = "Similar Items You Might Like",
}: SmartRecommendationsProps) {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Generate mock similar items if not provided
  const mockItems: SimilarItem[] = [
    {
      id: "sim-1",
      title: "Samsung Galaxy A54 - Mint Condition",
      price: 165000,
      image: "https://via.placeholder.com/150?text=Phone",
      category: "Phones",
      location: "Lilongwe",
      rating: 4.7,
      discount: 8,
      isSale: true,
    },
    {
      id: "sim-2",
      title: "iPhone 12 Pro - Space Gray",
      price: 420000,
      image: "https://via.placeholder.com/150?text=iPhone",
      category: "Phones",
      location: "Blantyre",
      rating: 4.9,
    },
    {
      id: "sim-3",
      title: "OnePlus 11 - Original Box",
      price: 185000,
      image: "https://via.placeholder.com/150?text=OnePlus",
      category: "Phones",
      location: "Mzuzu",
      rating: 4.6,
      discount: 12,
      isSale: true,
    },
    {
      id: "sim-4",
      title: "Xiaomi 13 Pro - Sealed",
      price: 195000,
      image: "https://via.placeholder.com/150?text=Xiaomi",
      category: "Phones",
      location: "Zomba",
      rating: 4.5,
    },
  ];

  const displayItems = items.length > 0 ? items : mockItems;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={18} className="text-pink-500" />
            <h3 className="font-black text-lg">{title}</h3>
          </div>
          <p className="text-xs text-muted-foreground">Based on your viewing history</p>
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {displayItems
          .filter((item) => item.id !== currentItemId)
          .slice(0, 4)
          .map((item, i) => (
            <Link key={item.id} href={`/marketplace/${item.id}`}>
              <div
                className="bg-card border border-pink-500/20 hover:border-pink-500/50 rounded-xl overflow-hidden card-hover cursor-pointer group relative"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {/* Sale Badge */}
                {item.isSale && item.discount && (
                  <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-orange-500 to-red-600 text-white px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                    <span>🔥</span>
                    -{item.discount}%
                  </div>
                )}

                {/* Image */}
                <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => toggleWishlist(item.id, e)}
                    className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Heart
                      size={13}
                      className={wishlist.has(item.id) ? "text-pink-400 fill-pink-400" : "text-white"}
                      strokeWidth={2}
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-3">
                  <h4 className="text-xs font-bold line-clamp-2 mb-1.5 group-hover:text-pink-500 transition-colors">
                    {item.title}
                  </h4>

                  {/* Price Section */}
                  <div className="mb-2">
                    <div className="text-sm font-black text-pink-500">
                      {(item.price / 1000).toFixed(0)}k MK
                    </div>
                    {item.discount && (
                      <div className="text-[10px] text-muted-foreground line-through">
                        {((item.price / (1 - item.discount / 100)) / 1000).toFixed(0)}k MK
                      </div>
                    )}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-1.5 py-0.5 rounded-full bg-pink-500/10 text-pink-600 font-semibold">
                      {item.category}
                    </span>
                    {item.rating && (
                      <div className="flex items-center gap-0.5">
                        <span className="text-yellow-400">⭐</span>
                        <span className="font-bold">{item.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1.5 pt-1.5 border-t border-border">
                    <MapPin size={8} />
                    <span className="line-clamp-1">{item.location}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>

      {/* Browse More CTA */}
      <Link href="/marketplace" className="block">
        <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 hover:border-pink-500/40 rounded-lg p-4 text-center transition-all duration-200 cursor-pointer group">
          <p className="font-bold text-foreground group-hover:text-pink-500 transition-colors">
            Browse all similar items →
          </p>
        </div>
      </Link>
    </div>
  );
}
