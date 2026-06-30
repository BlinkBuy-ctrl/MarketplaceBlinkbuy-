import React, { useState, useRef, useEffect } from 'react';
import { Search, Trending2, Clock, MapPin, Tag, Store } from 'lucide-react';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'brand' | 'location' | 'recent' | 'trending';
  icon?: React.ReactNode;
}

export const SmartSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock Data
  const products = ['iPhone 12', 'Laptop Dell', 'Samsung A12', 'Dining Table', 'Sofa Set'];
  const categories = ['Electronics', 'Furniture', 'Fashion', 'Home & Garden', 'Sports'];
  const brands = ['Samsung', 'Apple', 'Dell', 'LG', 'Sony'];
  const malawaiLocations = ['Lilongwe', 'Blantyre', 'Mzuzu', 'Zomba', 'Kasungu', 'Nkhata Bay', 'Dedza'];
  const recentSearches = ['iPhone X', 'Bedroom Set', 'Used Laptop'];
  const trendingSearches = ['Gaming PC', 'Wedding Dresses', 'Kitchen Appliances'];

  // Generate Suggestions
  useEffect(() => {
    if (!query.trim()) {
      // Show recent + trending when empty
      const allSuggestions: SearchSuggestion[] = [];
      
      recentSearches.slice(0, 2).forEach(search => {
        allSuggestions.push({
          id: `recent-${search}`,
          text: search,
          type: 'recent',
          icon: <Clock size={16} className="text-[#B5B5B5]" />
        });
      });

      trendingSearches.slice(0, 2).forEach(search => {
        allSuggestions.push({
          id: `trending-${search}`,
          text: search,
          type: 'trending',
          icon: <Trending2 size={16} className="text-[#FF2D8D]" />
        });
      });

      setSuggestions(allSuggestions);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const newSuggestions: SearchSuggestion[] = [];

    // Products
    products
      .filter(p => p.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .forEach(product => {
        newSuggestions.push({
          id: `product-${product}`,
          text: product,
          type: 'product',
          icon: <Tag size={16} className="text-[#FF6FAE]" />
        });
      });

    // Categories
    categories
      .filter(c => c.toLowerCase().includes(lowerQuery))
      .slice(0, 2)
      .forEach(category => {
        newSuggestions.push({
          id: `category-${category}`,
          text: category,
          type: 'category',
          icon: <Tag size={16} className="text-[#FF2D8D]" />
        });
      });

    // Brands
    brands
      .filter(b => b.toLowerCase().includes(lowerQuery))
      .slice(0, 2)
      .forEach(brand => {
        newSuggestions.push({
          id: `brand-${brand}`,
          text: brand,
          type: 'brand',
          icon: <Store size={16} className="text-[#B5B5B5]" />
        });
      });

    // Malawi Locations
    malawaiLocations
      .filter(loc => loc.toLowerCase().includes(lowerQuery))
      .slice(0, 3)
      .forEach(location => {
        newSuggestions.push({
          id: `location-${location}`,
          text: location,
          type: 'location',
          icon: <MapPin size={16} className="text-[#FF6FAE]" />
        });
      });

    setSuggestions(newSuggestions);
    setSelectedIndex(-1);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const suggestion = suggestions[selectedIndex];
          setQuery(suggestion.text);
          handleSearch(suggestion.text);
        } else if (query.trim()) {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  const handleSearch = (searchQuery: string) => {
    console.log('Search for:', searchQuery);
    setIsOpen(false);
    // Integrate with actual search functionality
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="text-[#FF2D8D]" size={20} />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search products, categories, or locations..."
          className="w-full bg-[#1C1C1C] border-2 border-[#FF2D8D]/30 rounded-lg pl-12 pr-4 py-3 text-white placeholder-[#B5B5B5] focus:outline-none focus:border-[#FF2D8D] transition-colors"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSuggestions([]);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#B5B5B5] hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1C1C1C] border border-[#FF2D8D]/30 rounded-lg shadow-2xl shadow-[#FF2D8D]/20 z-50 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-colors border-b border-[#FF2D8D]/10 last:border-0 ${
                  index === selectedIndex
                    ? 'bg-[#FF2D8D]/20 text-white'
                    : 'hover:bg-[#0F0F0F] text-[#B5B5B5] hover:text-white'
                }`}
              >
                {suggestion.icon}
                <span className="flex-1">{suggestion.text}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  suggestion.type === 'product' ? 'bg-[#FF6FAE]/20 text-[#FF6FAE]' :
                  suggestion.type === 'category' ? 'bg-[#FF2D8D]/20 text-[#FF2D8D]' :
                  suggestion.type === 'location' ? 'bg-blue-500/20 text-blue-400' :
                  suggestion.type === 'trending' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-[#B5B5B5]/20 text-[#B5B5B5]'
                }`}>
                  {suggestion.type === 'product' ? '🛍️' :
                   suggestion.type === 'category' ? '📁' :
                   suggestion.type === 'location' ? '📍' :
                   suggestion.type === 'trending' ? '🔥' :
                   suggestion.type === 'brand' ? '🏪' : '🕐'}
                </span>
              </button>
            ))}
          </div>

          {/* Did You Mean */}
          {query && suggestions.length > 0 && (
            <div className="px-4 py-3 bg-[#0F0F0F] border-t border-[#FF2D8D]/10">
              <p className="text-xs text-[#B5B5B5] mb-2">💡 Quick Tips:</p>
              <div className="space-y-1 text-xs text-[#B5B5B5]">
                <p>• Search by product name or brand</p>
                <p>• Filter by Malawi districts (Lilongwe, Blantyre, etc.)</p>
                <p>• Browse categories like Electronics or Furniture</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {isOpen && suggestions.length === 0 && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1C1C1C] border border-[#FF2D8D]/30 rounded-lg p-6 z-50 text-center">
          <p className="text-[#B5B5B5]">No suggestions found for "{query}"</p>
          <p className="text-xs text-[#B5B5B5] mt-2">Try searching for popular items or locations in Malawi</p>
        </div>
      )}
    </div>
  );
};
