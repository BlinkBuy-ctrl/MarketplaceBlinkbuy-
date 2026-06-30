import { Zap, Clock, TrendingUp } from "lucide-react";
import { Link } from "wouter";

interface DealItem {
  id: string;
  title: string;
  originalPrice: number;
  dealPrice: number;
  discount: number;
  image: string;
  endsIn: string;
  category: string;
  location: string;
}

interface FeaturedDealsProps {
  deals?: DealItem[];
}

export default function FeaturedDeals({ deals = [] }: FeaturedDealsProps) {
  if (deals.length === 0) {
    deals = [
      {
        id: "deal-1",
        title: "Samsung Galaxy A53 - Like New",
        originalPrice: 180000,
        dealPrice: 145000,
        discount: 19,
        image: "https://via.placeholder.com/200?text=Phone",
        endsIn: "3 hours",
        category: "Phones",
        location: "Lilongwe",
      },
      {
        id: "deal-2",
        title: "MacBook Pro 2022 - Sealed Box",
        originalPrice: 2500000,
        dealPrice: 2100000,
        discount: 16,
        image: "https://via.placeholder.com/200?text=Laptop",
        endsIn: "5 hours",
        category: "Electronics",
        location: "Blantyre",
      },
      {
        id: "deal-3",
        title: "Designer Shoes - Original",
        originalPrice: 45000,
        dealPrice: 32000,
        discount: 29,
        image: "https://via.placeholder.com/200?text=Shoes",
        endsIn: "2 hours",
        category: "Clothing",
        location: "Mzuzu",
      },
    ];
  }

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={20} className="text-orange-500" fill="currentColor" />
            <h2 className="font-black text-xl">Flash Deals</h2>
          </div>
          <p className="text-xs text-muted-foreground font-medium">Limited time offers - Grab them before they're gone!</p>
        </div>
        <Link href="/marketplace" className="text-xs text-red-500 hover:text-red-600 font-bold flex items-center gap-1">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {deals.map((deal, i) => (
          <Link key={deal.id} href={`/marketplace/${deal.id}`}>
            <div
              className="bg-card border-2 border-orange-500/40 rounded-xl overflow-hidden hover:border-orange-500 transition-all duration-300 group cursor-pointer relative"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Deal Badge */}
              <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-orange-500 to-red-600 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold">
                <TrendingUp size={12} />
                -{deal.discount}%
              </div>

              {/* Image */}
              <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 overflow-hidden relative">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                {/* Timer */}
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                  <Clock size={12} className="text-orange-400" />
                  <span className="text-[10px] font-bold text-white">{deal.endsIn}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="text-xs font-bold line-clamp-2 mb-2 group-hover:text-red-500 transition-colors">
                  {deal.title}
                </h3>

                {/* Price Section */}
                <div className="mb-2">
                  <div className="text-sm font-black text-red-500">
                    {(deal.dealPrice / 1000).toFixed(0)}k MK
                  </div>
                  <div className="text-[10px] text-muted-foreground line-through">
                    {(deal.originalPrice / 1000).toFixed(0)}k MK
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 font-semibold">
                    {deal.category}
                  </span>
                  <span className="text-muted-foreground font-medium">{deal.location}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
