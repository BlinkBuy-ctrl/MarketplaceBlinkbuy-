import React, { useState } from 'react';
import { SmartSearch } from './SmartSearch';
import { Heart, Share2, MessageCircle, MapPin, Star, TrendingUp, Zap, Fire, Clock } from 'lucide-react';

export const EnhancedHomePage: React.FC = () => {
  const [savedItems, setSavedItems] = useState<string[]>([]);

  // Mock Data - Hot Deals
  const hotDeals = [
    { id: '1', name: 'Samsung Galaxy A12', price: 'K 89,999', original: 'K 125,000', image: '📱', seller: 'Chipo Electronics', district: 'Lilongwe', rating: 4.8 },
    { id: '2', name: 'Dining Table Set', price: 'K 245,000', original: 'K 350,000', image: '🪑', seller: 'Home Comfort Store', district: 'Blantyre', rating: 4.6 },
    { id: '3', name: 'Laptop Bag (New)', price: 'K 12,500', original: 'K 18,999', image: '🎒', seller: 'Tech Accessories Hub', district: 'Lilongwe', rating: 4.9 },
    { id: '4', name: 'Office Chair', price: 'K 78,900', original: 'K 125,000', image: '💺', seller: 'Furniture World', district: 'Mzuzu', rating: 4.7 },
  ];

  // Trending Items
  const trendingItems = [
    { id: '5', name: 'Gaming PC', price: 'K 899,999', image: '💻', views: '12.5K', seller: 'TechPro Store', condition: 'New', rating: 4.9 },
    { id: '6', name: 'Wedding Dress', price: 'K 450,000', image: '👗', views: '8.2K', seller: 'Fashion Hub', condition: 'New', rating: 4.8 },
    { id: '7', name: 'Smart TV 55"', price: 'K 589,999', image: '📺', views: '6.8K', seller: 'Electronics Plus', condition: 'New', rating: 4.7 },
    { id: '8', name: 'Sofa Set', price: 'K 645,000', image: '🛋️', views: '5.4K', seller: 'Home Decor', condition: 'New', rating: 4.6 },
  ];

  // Featured Sellers
  const featuredSellers = [
    { id: '1', name: 'Chipo Electronics', badge: '⭐ Verified', products: 145, image: '🏪', rating: 4.8, district: 'Lilongwe' },
    { id: '2', name: 'Home Comfort Store', badge: '⭐ Verified', products: 89, image: '🏠', rating: 4.6, district: 'Blantyre' },
    { id: '3', name: 'Fashion Hub Malawi', badge: '⭐ Verified', products: 234, image: '👔', rating: 4.7, district: 'Lilongwe' },
    { id: '4', name: 'TechPro Store', badge: '⭐ Verified', products: 167, image: '🔧', rating: 4.9, district: 'Mzuzu' },
  ];

  // Categories
  const categories = [
    { name: 'Electronics', emoji: '📱', count: 450 },
    { name: 'Furniture', emoji: '🪑', count: 320 },
    { name: 'Fashion', emoji: '👗', count: 680 },
    { name: 'Home & Garden', emoji: '🏠', count: 290 },
    { name: 'Sports', emoji: '⚽', count: 145 },
    { name: 'Books', emoji: '📚', count: 210 },
  ];

  // Malawi Districts
  const districts = [
    'Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 
    'Kasungu', 'Nkhata Bay', 'Dedza', 'Mangochi'
  ];

  // Recent Listings (New)
  const recentListings = [
    { id: '9', name: 'iPhone 11 Pro', price: 'K 459,999', image: '📱', postedAt: '2 hours ago', seller: 'John Tech', district: 'Lilongwe' },
    { id: '10', name: 'Kitchen Sink', price: 'K 25,000', image: '🚰', postedAt: '4 hours ago', seller: 'Hardware Store', district: 'Blantyre' },
    { id: '11', name: 'Running Shoes', price: 'K 15,999', image: '👟', postedAt: '1 day ago', seller: 'SportZone', district: 'Mzuzu' },
    { id: '12', name: 'Coffee Maker', price: 'K 35,500', image: '☕', postedAt: '1 day ago', seller: 'Kitchen Plus', district: 'Zomba' },
  ];

  const toggleSave = (itemId: string) => {
    setSavedItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0F0F0F] via-[#1C1C1C] to-[#0F0F0F] pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
              Market Hub <span className="text-[#FF2D8D]">Malawi</span>
            </h1>
            <p className="text-[#B5B5B5] text-lg">Buy & Sell Local • Fast • Secure • Trusted</p>
          </div>

          {/* Smart Search */}
          <div className="mb-8">
            <SmartSearch />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-[#FF2D8D]">1,240+</p>
              <p className="text-sm text-[#B5B5B5]">Active Listings</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#FF2D8D]">324</p>
              <p className="text-sm text-[#B5B5B5]">Verified Sellers</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#FF2D8D]">12.5K</p>
              <p className="text-sm text-[#B5B5B5]">Happy Users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">

        {/* Hot Deals Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Fire className="text-[#FF2D8D]" size={28} />
            <h2 className="text-3xl font-black text-white">Hot Deals Today</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotDeals.map(item => (
              <ProductCard key={item.id} item={item} saved={savedItems.includes(item.id)} onSave={toggleSave} isFeatured />
            ))}
          </div>
        </section>

        {/* Featured Sellers Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Star className="text-[#FF6FAE]" size={28} />
            <h2 className="text-3xl font-black text-white">Featured Sellers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredSellers.map(seller => (
              <div key={seller.id} className="bg-[#1C1C1C] rounded-xl p-6 border border-[#FF2D8D]/20 hover:border-[#FF2D8D] transition-all group cursor-pointer">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{seller.image}</div>
                <h3 className="font-bold text-white text-lg mb-1">{seller.name}</h3>
                <p className="text-[#FF2D8D] text-sm mb-3">{seller.badge}</p>
                <div className="space-y-2 text-sm text-[#B5B5B5] mb-4">
                  <p>{seller.products} Products</p>
                  <p className="flex items-center gap-1">⭐ {seller.rating} • {seller.district}</p>
                </div>
                <button className="w-full bg-gradient-to-r from-[#FF2D8D] to-[#FF6FAE] text-white font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-[#FF2D8D]/50 transition-all text-sm">
                  Visit Store
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Trending Items Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-[#FF2D8D]" size={28} />
            <h2 className="text-3xl font-black text-white">Trending This Week</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingItems.map(item => (
              <ProductCard key={item.id} item={item} saved={savedItems.includes(item.id)} onSave={toggleSave} />
            ))}
          </div>
        </section>

        {/* Browse by Category Section */}
        <section>
          <h2 className="text-3xl font-black text-white mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, idx) => (
              <div
                key={idx}
                className="bg-[#1C1C1C] rounded-lg p-4 border border-[#FF2D8D]/20 hover:border-[#FF2D8D] hover:bg-[#FF2D8D]/10 transition-all cursor-pointer text-center group"
              >
                <div className="text-4xl mb-3 group-hover:scale-125 transition-transform">{category.emoji}</div>
                <p className="font-semibold text-white text-sm mb-1">{category.name}</p>
                <p className="text-xs text-[#B5B5B5]">{category.count} listings</p>
              </div>
            ))}
          </div>
        </section>

        {/* Browse by District Section */}
        <section>
          <h2 className="text-3xl font-black text-white mb-6">Shop by District</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {districts.map((district, idx) => (
              <button
                key={idx}
                className="bg-[#1C1C1C] border border-[#FF2D8D]/20 hover:border-[#FF2D8D] hover:bg-[#FF2D8D]/10 rounded-lg p-4 text-white font-semibold flex items-center gap-2 transition-all group"
              >
                <MapPin className="text-[#FF2D8D] group-hover:scale-110 transition-transform" size={20} />
                <span>{district}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Listings Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Clock className="text-[#FF6FAE]" size={28} />
            <h2 className="text-3xl font-black text-white">Latest Listings</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentListings.map(item => (
              <div key={item.id} className="bg-[#1C1C1C] rounded-xl overflow-hidden border border-[#FF2D8D]/20 hover:border-[#FF2D8D] transition-all group">
                <div className="relative aspect-square bg-[#0F0F0F] flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                  {item.image}
                </div>
                <div className="p-4">
                  <p className="text-xs text-[#B5B5B5] mb-1">{item.postedAt}</p>
                  <h3 className="font-semibold text-white mb-2 line-clamp-2">{item.name}</h3>
                  <p className="text-[#FF2D8D] font-bold mb-2">{item.price}</p>
                  <p className="text-xs text-[#B5B5B5] mb-3">{item.seller} • {item.district}</p>
                  <button className="w-full bg-[#FF2D8D]/20 hover:bg-[#FF2D8D] text-[#FF2D8D] hover:text-white font-semibold py-2 rounded transition-colors text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sponsored Section */}
        <section className="bg-gradient-to-r from-[#FF2D8D]/10 to-[#FF6FAE]/10 rounded-xl p-8 border border-[#FF2D8D]/30">
          <h2 className="text-2xl font-black text-white mb-4">Sponsored Marketplace Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(idx => (
              <div key={idx} className="bg-[#1C1C1C] rounded-lg p-6 border border-[#FF2D8D]/20 text-center">
                <div className="text-5xl mb-4">🏪</div>
                <p className="font-semibold text-white mb-2">Featured Partner {idx}</p>
                <p className="text-sm text-[#B5B5B5] mb-4">Premium seller with exclusive deals</p>
                <button className="text-[#FF2D8D] font-semibold hover:text-[#FF6FAE] transition-colors">
                  Explore →
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[#1C1C1C] border-t border-[#FF2D8D]/20 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-[#B5B5B5]">
          <p className="mb-2">© 2024 Market Hub Malawi • Your trusted local marketplace</p>
          <p className="text-sm">🇲🇼 Proudly serving Lilongwe, Blantyre, Mzuzu, and all of Malawi</p>
        </div>
      </footer>
    </div>
  );
};

interface ProductCardProps {
  item: any;
  saved: boolean;
  onSave: (id: string) => void;
  isFeatured?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ item, saved, onSave, isFeatured }) => {
  const discount = isFeatured ? Math.round(((parseInt(item.original?.replace('K ', '')) - parseInt(item.price.replace('K ', ''))) / parseInt(item.original?.replace('K ', ''))) * 100) : null;

  return (
    <div className="bg-[#1C1C1C] rounded-xl overflow-hidden border border-[#FF2D8D]/20 hover:border-[#FF2D8D] transition-all group">
      {/* Image Section */}
      <div className="relative aspect-square bg-[#0F0F0F] flex items-center justify-center text-6xl group-hover:scale-105 transition-transform overflow-hidden">
        {item.image}
        {discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
            -{discount}%
          </div>
        )}
        {item.condition && (
          <div className="absolute top-3 left-3 bg-[#FF2D8D] text-white px-3 py-1 rounded-full font-semibold text-xs">
            {item.condition}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 line-clamp-2">{item.name}</h3>
        
        {/* Price */}
        <div className="mb-2">
          <p className="text-[#FF2D8D] font-bold text-lg">{item.price}</p>
          {item.original && <p className="text-xs text-[#B5B5B5] line-through">{item.original}</p>}
        </div>

        {/* Seller Info */}
        <div className="flex items-center justify-between text-xs text-[#B5B5B5] mb-3">
          <span>{item.seller}</span>
          <span className="flex items-center gap-1">📍 {item.district}</span>
        </div>

        {/* Rating & Views */}
        <div className="flex items-center justify-between text-xs mb-3">
          <span className="text-[#FF2D8D]">⭐ {item.rating || item.views}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-gradient-to-r from-[#FF2D8D] to-[#FF6FAE] text-white font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-[#FF2D8D]/50 transition-all text-sm">
            View
          </button>
          <button
            onClick={() => onSave(item.id)}
            className={`p-2 rounded-lg transition-all ${
              saved
                ? 'bg-[#FF2D8D] text-white'
                : 'bg-[#0F0F0F] text-[#B5B5B5] hover:text-[#FF2D8D]'
            }`}
          >
            <Heart size={18} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
};
