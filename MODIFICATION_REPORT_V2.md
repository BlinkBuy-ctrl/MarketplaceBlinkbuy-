# MarketplaceBlinkbuy Modification Report V2

## Overview
This report details the removal of fake data and the implementation of an in-app messaging system within the MarketplaceBlinkbuy application.

---

## 1. Mock Data Removal and Dynamic Data Structures
All hardcoded mock data for marketplace listings has been removed. The application now uses `localStorage` for persistent storage of listings, allowing users to create and manage their own items dynamically.

---

## 2. Messaging System Implementation
A basic in-app messaging system has been implemented to allow buyers to contact sellers directly. This includes:

*   **`Messages` Page**: A new page (`/messages`) has been added to display conversations and individual messages.
*   **`Message Seller` Button**: A button has been added to the item detail page (`marketplace-detail.tsx`) to initiate a conversation with the seller.
*   **`localStorage` for Messages**: Conversations and messages are stored in `localStorage` to maintain state across sessions without a backend.
*   **Navigation Integration**: The main navigation (`Layout.tsx`) has been updated to include a link to the new `Messages` page.

---

## 3. Modified Files Summary

| File Name | Folder Location / Path | Description of Changes Made |
| :--- | :--- | :--- |
| `mockData.ts` | `/src/lib/` | Removed all hardcoded `MOCK_ITEMS`. Implemented `getListings`, `saveListings`, `addListing`, `getListingById`, and `deleteListing` functions using `localStorage` for dynamic item management. |
| `messages.ts` | `/src/lib/` | **New File:** Implemented data structures and functions for managing conversations and messages using `localStorage`. |
| `home.tsx` | `/src/pages/` | Updated to fetch listings dynamically using `getListings()` instead of `MOCK_ITEMS`. |
| `marketplace-detail.tsx` | `/src/pages/` | Updated to fetch item details dynamically using `getListingById()`. Replaced WhatsApp/phone contact with an in-app "Message Seller" button and a message modal. Integrated `startConversation` and `sendMessage` functions. |
| `messages.tsx` | `/src/pages/` | **New File:** Implemented the UI and logic for displaying conversations and messages, including sending new messages. |
| `App.tsx` | `/src/` | Added a new route for the `/messages` page. |
| `Layout.tsx` | `/src/components/` | Added a "Messages" link to both desktop and mobile navigation menus. |

---

## 4. Updated Code Blocks

### 1. `/src/lib/mockData.ts`

```typescript
export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
  location: string;
  condition: string;
  images: string[];
  is_featured: boolean;
  created_at: string;
  seller: {
    id: string;
    name: string;
    location: string;
    phone: string;
    email: string;
  };
}

export const CATEGORIES = [
  "All Categories","Electronics","Phones","Clothing","Food",
  "Furniture","Tools","Vehicles","Farm Produce","Books","Other",
];

export const CITIES = [
  "Balaka","Blantyre","Chikwawa","Chiradzulu","Chitipa","Dedza","Dowa",
  "Karonga","Kasungu","Likoma","Lilongwe","Machinga","Mangochi","Mchinji",
  "Mulanje","Mwanza","Mzimba","Mzuzu","Neno","Nkhata Bay","Nkhotakota",
  "Nsanje","Ntcheu","Ntchisi","Phalombe","Rumphi","Salima","Thyolo","Zomba",
];

export const CONDITIONS = ["New","Like New","Good","Fair","For Parts"];

// Initialize listings from localStorage or empty array
export function getListings(): MarketplaceItem[] {
  try {
    const stored = localStorage.getItem("marketplace_listings");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save listings to localStorage
export function saveListings(listings: MarketplaceItem[]): void {
  try {
    localStorage.setItem("marketplace_listings", JSON.stringify(listings));
  } catch (e) {
    console.error("Failed to save listings:", e);
  }
}

// Add a new listing
export function addListing(item: Omit<MarketplaceItem, "id" | "created_at">): MarketplaceItem {
  const newItem: MarketplaceItem = {
    ...item,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
  };
  const listings = getListings();
  listings.unshift(newItem);
  saveListings(listings);
  return newItem;
}

// Get a single listing by ID
export function getListingById(id: string): MarketplaceItem | undefined {
  return getListings().find(item => item.id === id);
}

// Delete a listing
export function deleteListing(id: string): void {
  const listings = getListings();
  const filtered = listings.filter(item => item.id !== id);
  saveListings(filtered);
}

// Get MOCK_ITEMS for backward compatibility (empty array, can be populated by users)
export const MOCK_ITEMS: MarketplaceItem[] = [];
```

### 2. `/src/lib/messages.ts`

```typescript
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  itemId: string;
  itemTitle: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  itemId: string;
  itemTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

// Get all conversations for a user
export function getConversations(userId: string): Conversation[] {
  try {
    const stored = localStorage.getItem("marketplace_conversations");
    const conversations: Conversation[] = stored ? JSON.parse(stored) : [];
    return conversations.filter(c => c.buyerId === userId || c.sellerId === userId);
  } catch {
    return [];
  }
}

// Save conversations to localStorage
function saveConversations(conversations: Conversation[]): void {
  try {
    localStorage.setItem("marketplace_conversations", JSON.stringify(conversations));
  } catch (e) {
    console.error("Failed to save conversations:", e);
  }
}

// Get messages for a conversation
export function getMessages(conversationId: string): Message[] {
  try {
    const stored = localStorage.getItem("marketplace_messages");
    const messages: Message[] = stored ? JSON.parse(stored) : [];
    return messages.filter(m => m.conversationId === conversationId).sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  } catch {
    return [];
  }
}

// Save messages to localStorage
function saveMessages(messages: Message[]): void {
  try {
    localStorage.setItem("marketplace_messages", JSON.stringify(messages));
  } catch (e) {
    console.error("Failed to save messages:", e);
  }
}

// Send a message
export function sendMessage(
  conversationId: string,
  senderId: string,
  senderName: string,
  recipientId: string,
  recipientName: string,
  itemId: string,
  itemTitle: string,
  text: string
): Message {
  const message: Message = {
    id: Date.now().toString(),
    conversationId,
    senderId,
    senderName,
    recipientId,
    recipientName,
    itemId,
    itemTitle,
    text,
    timestamp: new Date().toISOString(),
    read: false,
  };

  const messages = getMessages(conversationId);
  messages.push(message);
  saveMessages(messages);

  // Update conversation
  const conversations = JSON.parse(localStorage.getItem("marketplace_conversations") || "[]");
  const convIndex = conversations.findIndex((c: Conversation) => c.id === conversationId);
  if (convIndex !== -1) {
    conversations[convIndex].lastMessage = text;
    conversations[convIndex].lastMessageTime = message.timestamp;
    if (recipientId !== senderId) {
      conversations[convIndex].unreadCount = (conversations[convIndex].unreadCount || 0) + 1;
    }
  }
  saveConversations(conversations);

  return message;
}

// Start or get a conversation
export function startConversation(
  buyerId: string,
  buyerName: string,
  sellerId: string,
  sellerName: string,
  itemId: string,
  itemTitle: string
): string {
  const conversations: Conversation[] = JSON.parse(localStorage.getItem("marketplace_conversations") || "[]");
  
  // Check if conversation already exists
  const existing = conversations.find(
    c => c.buyerId === buyerId && c.sellerId === sellerId && c.itemId === itemId
  );
  
  if (existing) {
    return existing.id;
  }

  // Create new conversation
  const newConversation: Conversation = {
    id: Date.now().toString(),
    buyerId,
    buyerName,
    sellerId,
    sellerName,
    itemId,
    itemTitle,
    lastMessage: "",
    lastMessageTime: new Date().toISOString(),
    unreadCount: 0,
  };

  conversations.push(newConversation);
  saveConversations(conversations);

  return newConversation.id;
}

// Mark messages as read
export function markAsRead(conversationId: string, userId: string): void {
  const messages = JSON.parse(localStorage.getItem("marketplace_messages") || "[]");
  messages.forEach((m: Message) => {
    if (m.conversationId === conversationId && m.recipientId === userId) {
      m.read = true;
    }
  });
  saveMessages(messages);

  // Update conversation unread count
  const conversations: Conversation[] = JSON.parse(localStorage.getItem("marketplace_conversations") || "[]");
  const convIndex = conversations.findIndex(c => c.id === conversationId);
  if (convIndex !== -1) {
    conversations[convIndex].unreadCount = 0;
  }
  saveConversations(conversations);
}
```

### 3. `/src/pages/home.tsx`

```typescript
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, ArrowRight, Tag, MapPin, Zap, Sparkles, TrendingUp, Heart, Search, ChevronRight } from "lucide-react";
import { CATEGORIES, getListings } from "@/lib/mockData";
import { formatMK } from "@/lib/utils";
import type { MarketplaceItem } from "@/lib/mockData";

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
  const [listings, setListings] = useState<MarketplaceItem[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wishlist") || "[]")); }
    catch { return new Set(); }
  });
  const [searchQ, setSearchQ] = useState("");

  useEffect(() => {
    setListings(getListings());
  }, []);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem("wishlist", JSON.stringify([...next]));
      return next;
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQ.trim()) navigate(`/marketplace?q=${encodeURIComponent(searchQ.trim())}`);
    else navigate("/marketplace");
  };

  const featured = listings.filter(i => i.is_featured).slice(0, 4);
  const recent = listings.slice(0, 8);
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

          <p className="text-white/65 text-sm md:text-base mb-7 max-w-xl font-light">
            Discover thousands of items from trusted local sellers. Fast, safe, and exclusively for Malawi.
          </p>

          {/* Search Bar in Hero */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mb-6">
            <div className="flex-1 relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
              <input
                type="text"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search items, phones, clothes..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm outline-none focus:bg-white/15 focus:border-pink-400/60 transition-all font-medium backdrop-blur-sm"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-pink-500/40 border border-pink-400/20 whitespace-nowrap"
            >
              <Search size={15} strokeWidth={2.5} />
              Search
            </button>
          </form>

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
          { label: "Active Listings", value: listings.length.toString(), icon: Tag },
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
      {featured.length > 0 && (
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
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
                    )}
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
      )}

      {/* RECENTLY LISTED */}
      {recent.length > 0 && (
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
                    {item.images && item.images.length > 0 ? (
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
      )}

      {/* Empty State */}
      {listings.length === 0 && (
        <div className="text-center py-16">
          <ShoppingBag size={48} className="text-muted-foreground opacity-30 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">No listings yet</h3>
          <p className="text-muted-foreground text-sm mb-6">Be the first to post an item!</p>
          <Link
            href="/post-item"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-xl text-sm font-bold"
          >
            <Zap size={16} />
            Post Your First Item
          </Link>
        </div>
      )}

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
```

### 4. `/src/pages/marketplace-detail.tsx`

```typescript
import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "wouter";
import { MapPin, ArrowLeft, Tag, CheckCircle, Share2, Heart, MessageCircle, Star, Shield, X } from "lucide-react";
import { getListingById, CATEGORIES } from "@/lib/mockData";
import { startConversation } from "@/lib/messages";
import { formatMK } from "@/lib/utils";
import type { MarketplaceItem } from "@/lib/mockData";

export default function MarketplaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [currentUserId] = useState("user_" + Math.random().toString(36).substr(2, 9));
  const [currentUserName, setCurrentUserName] = useState("");
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wishlist") || "[]")); }
    catch { return new Set(); }
  });

  useEffect(() => {
    if (id) {
      const listing = getListingById(id);
      setItem(listing || null);
    }
  }, [id]);

  useEffect(() => {
    const stored = localStorage.getItem("currentUserName");
    if (stored) {
      setCurrentUserName(stored);
    }
  }, []);

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center page-enter">
        <div className="w-16 h-16 rounded-full bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mx-auto mb-4">
          <Tag size={28} className="text-muted-foreground opacity-50" />
        </div>
        <h2 className="text-xl font-bold mb-2">Item not found</h2>
        <p className="text-muted-foreground text-sm mb-6">This listing may have been removed.</p>
        <Link href="/marketplace" className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold">
          <ArrowLeft size={14} /> Browse Marketplace
        </Link>
      </div>
    );
  }

  const seller = item.seller;
  const images = item.images || [];
  const inWishlist = wishlist.has(item.id);

  const toggleWishlist = () => {
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(item.id) ? next.delete(item.id) : next.add(item.id);
      localStorage.setItem("wishlist", JSON.stringify([...next]));
      return next;
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: item.title, text: `Check this out: ${item.title} — ${formatMK(item.price)}`, url: window.location.href });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const conversationId = startConversation(
      currentUserId,
      currentUserName || "Buyer",
      seller.id,
      seller.name,
      item.id,
      item.title
    );

    // Send the initial message
    const { sendMessage } = require("@/lib/messages");
    sendMessage(
      conversationId,
      currentUserId,
      currentUserName || "Buyer",
      seller.id,
      seller.name,
      item.id,
      item.title,
      messageText
    );

    setMessageText("");
    setShowMessageModal(false);
    navigate("/messages");
  };

  const related = getListingById(item.id) ? [] : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 page-enter">
      {/* Back */}
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-all group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Images */}
        <div>
          <div className="aspect-square bg-muted rounded-2xl overflow-hidden mb-3 relative group">
            {images.length > 0 ? (
              <img
                src={images[selectedImage]}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/fallback${item.id}/600/600`; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image available</div>
            )}
            {item.is_featured && (
              <div className="absolute top-3 left-3 badge-featured">⭐ Featured</div>
            )}
            {/* Share & Wishlist overlay */}
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                onClick={toggleWishlist}
                className="w-9 h-9 rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all"
              >
                <Heart size={16} className={inWishlist ? "text-pink-400 fill-pink-400" : "text-white"} strokeWidth={2} />
              </button>
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all"
              >
                <Share2 size={15} className={copied ? "text-green-400" : "text-white"} />
              </button>
            </div>
          </div>
          {images.length > 1 && (
            <div className="flex gap-2.5">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImage ? "border-pink-500 shadow-md shadow-pink-500/30" : "border-border opacity-70 hover:opacity-100"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4">
          {/* Item Info Card */}
          <div className="bg-card border border-pink-500/20 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h1 className="text-xl font-black leading-tight flex-1">{item.title}</h1>
            </div>

            <div className="text-3xl font-black text-pink-500 mb-4">{formatMK(item.price)}</div>

            <div className="flex items-center gap-3 flex-wrap mb-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin size={12} className="text-pink-400" />
                <span className="font-semibold">{item.location}</span>
              </div>
              {item.category && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Tag size={12} className="text-pink-400" />
                  <span className="font-semibold">{item.category}</span>
                </div>
              )}
              {item.condition && (
                <div className="inline-flex items-center gap-1 bg-pink-500/10 text-pink-600 text-xs px-2.5 py-1 rounded-full border border-pink-500/20 font-semibold">
                  <CheckCircle size={10} /> {item.condition}
                </div>
              )}
            </div>

            {/* Ratings display */}
            <div className="flex items-center gap-1.5 mb-4 pb-4 border-b border-border">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={14} className={s <= 4 ? "text-amber-400 fill-amber-400" : "text-muted-foreground"} />
              ))}
              <span className="text-xs text-muted-foreground font-medium ml-1">4.0 · Trusted Seller</span>
              <Shield size={12} className="text-green-500 ml-auto" />
              <span className="text-xs text-green-600 font-semibold">Verified</span>
            </div>

            {item.description && (
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Description</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            )}
          </div>

          {/* Contact Seller */}
          {seller && (
            <div className="bg-card border border-pink-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-700/20 border border-pink-500/30 flex items-center justify-center text-lg font-black text-pink-500 shrink-0">
                  {seller.name?.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-sm">{seller.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin size={10} />{seller.location}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {/* Message Seller - Primary CTA */}
                <button
                  onClick={() => setShowMessageModal(true)}
                  className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-pink-500/30"
                >
                  <MessageCircle size={17} strokeWidth={2.5} />
                  Message Seller
                </button>

                {/* Email Contact */}
                {seller.email && (
                  <a
                    href={`mailto:${seller.email}`}
                    className="w-full flex items-center justify-center gap-2.5 border-2 border-pink-500/30 text-pink-500 hover:bg-pink-500/10 py-3 rounded-xl text-sm font-bold transition-all"
                  >
                    Email: {seller.email}
                  </a>
                )}
              </div>

              {/* Safety tip */}
              <div className="flex items-start gap-2 mt-3 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20">
                <Shield size={13} className="text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium leading-relaxed">
                  Safety tip: Always meet in a public place and inspect items before paying.
                </p>
              </div>
            </div>
          )}

          {/* Share */}
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 border border-border py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:border-pink-500/30 transition-all font-medium"
          >
            <Share2 size={14} />
            {copied ? "Link copied! ✓" : "Share this listing"}
          </button>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-pink-500/20 rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Message {seller.name}</h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={e => { e.preventDefault(); handleSendMessage(); }} className="space-y-4">
              <textarea
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                placeholder="Hi, I\'m interested in this item. Is it still available?"
                className="w-full px-4 py-3 rounded-xl bg-background border border-pink-500/20 text-sm outline-none focus:border-pink-500 transition-all resize-none h-24"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold hover:from-pink-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 5. `/src/pages/messages.tsx`

```typescript
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { MessageCircle, ArrowLeft, Send, Clock } from "lucide-react";
import { getConversations, getMessages, sendMessage, markAsRead } from "@/lib/messages";
import type { Conversation, Message } from "@/lib/messages";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [currentUserId] = useState("user_" + Math.random().toString(36).substr(2, 9));
  const [currentUserName] = useState("You");

  // Load conversations on mount
  useEffect(() => {
    const convs = getConversations(currentUserId);
    setConversations(convs);
    if (convs.length > 0 && !selectedConvId) {
      setSelectedConvId(convs[0].id);
    }
  }, [currentUserId, selectedConvId]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConvId) {
      const msgs = getMessages(selectedConvId);
      setMessages(msgs);
      markAsRead(selectedConvId, currentUserId);
    }
  }, [selectedConvId, currentUserId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConvId) return;

    const conv = conversations.find(c => c.id === selectedConvId);
    if (!conv) return;

    const recipientId = conv.buyerId === currentUserId ? conv.sellerId : conv.buyerId;
    const recipientName = conv.buyerId === currentUserId ? conv.sellerName : conv.buyerName;

    sendMessage(
      selectedConvId,
      currentUserId,
      currentUserName,
      recipientId,
      recipientName,
      conv.itemId,
      conv.itemTitle,
      messageText
    );

    setMessageText("");
    const updatedMessages = getMessages(selectedConvId);
    setMessages(updatedMessages);

    // Refresh conversations
    const updatedConvs = getConversations(currentUserId);
    setConversations(updatedConvs);
  };

  const selectedConversation = conversations.find(c => c.id === selectedConvId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 page-enter h-[calc(100vh-120px)] flex gap-4">
      {/* Conversations List */}
      <div className="w-full md:w-80 bg-card border border-pink-500/20 rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-pink-500/10">
          <h2 className="font-black text-lg flex items-center gap-2">
            <MessageCircle size={20} className="text-pink-500" />
            Messages
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <MessageCircle size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-2">Message a seller to get started</p>
            </div>
          ) : (
            conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`w-full p-4 border-b border-pink-500/10 text-left transition-all hover:bg-pink-500/5 ${
                  selectedConvId === conv.id ? "bg-pink-500/10 border-l-2 border-l-pink-500" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="font-semibold text-sm truncate">
                    {conv.buyerId === currentUserId ? conv.sellerName : conv.buyerName}
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="bg-pink-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1 truncate">{conv.itemTitle}</p>
                <p className="text-xs text-muted-foreground truncate">{conv.lastMessage || "No messages yet"}</p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-1">
                  <Clock size={10} />
                  {new Date(conv.lastMessageTime).toLocaleDateString()}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="hidden md:flex flex-1 bg-card border border-pink-500/20 rounded-2xl overflow-hidden flex-col">
        {selectedConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-pink-500/10 flex items-center justify-between">
              <div>
                <h3 className="font-bold">
                  {selectedConversation.buyerId === currentUserId
                    ? selectedConversation.sellerName
                    : selectedConversation.buyerName}
                </h3>
                <p className="text-xs text-muted-foreground">{selectedConversation.itemTitle}</p>
              </div>
              <Link
                href={`/marketplace/${selectedConversation.itemId}`}
                className="text-xs text-pink-500 hover:text-pink-600 font-semibold"
              >
                View Item
              </Link>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <MessageCircle size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2.5 rounded-xl ${
                        msg.senderId === currentUserId
                          ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm break-words">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.senderId === currentUserId ? "text-pink-100" : "text-muted-foreground"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-pink-500/10 flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-pink-500/20 text-sm outline-none focus:border-pink-500 transition-all"
              />
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold text-sm flex items-center gap-2 hover:from-pink-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 6. `/src/App.tsx`

```typescript
import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import Layout from "@/components/Layout";

const HomePage          = lazy(() => import("@/pages/home"));
const MarketplacePage   = lazy(() => import("@/pages/marketplace"));
const MarketplaceDetail = lazy(() => import("@/pages/marketplace-detail"));
const PostItemPage      = lazy(() => import("@/pages/post-item"));
const SettingsPage      = lazy(() => import("@/pages/settings"));
const MessagesPage      = lazy(() => import("@/pages/messages"));
const NotFound          = lazy(() => import("@/pages/not-found"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center animate-pulse shadow-lg shadow-pink-500/30">
          <span className="text-white font-black text-lg">M</span>
        </div>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <WouterRouter base="">
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Switch>
            <Route path="/"                   component={HomePage} />
            <Route path="/marketplace"        component={MarketplacePage} />
            <Route path="/marketplace/:id"    component={MarketplaceDetail} />
            <Route path="/post-item"          component={PostItemPage} />
            <Route path="/messages"           component={MessagesPage} />
            <Route path="/settings"           component={SettingsPage} />
            <Route                            component={NotFound} />
          </Switch>
        </Suspense>
      </Layout>
    </WouterRouter>
  );
}
```

### 7. `/src/components/Layout.tsx`

```typescript
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/useTheme";
import {
  ShoppingBag, Home, Search, Settings, Sun, Moon, Plus, Store,
  Menu, X, Download, MessageCircle,
} from "lucide-react";

const NAV = [
  { label: "Home",        href: "/",            icon: Home },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag },
  { label: "Messages",    href: "/messages",    icon: MessageCircle },
  { label: "Settings",    href: "/settings",    icon: Settings },
];

const BOTTOM_NAV = [
  { label: "Home",      href: "/",            icon: Home },
  { label: "Search",    href: "/marketplace", icon: Search },
  { label: "Sell",      href: "/post-item",   icon: Plus,   isAction: true },
  { label: "Messages",  href: "/messages",    icon: MessageCircle },
];

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const [loc] = useLocation();
  const [open, setOpen] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    setPageVisible(false);
    const t = setTimeout(() => setPageVisible(true), 80);
    setOpen(false);
    return () => clearTimeout(t);
  }, [loc]);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") setShowInstallBanner(false);
  };

  const isActive = (href: string) =>
    href === "/" ? loc === "/" : loc === href || loc.startsWith(href);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div className="sticky top-0 z-[60] bg-gradient-to-r from-pink-600 to-pink-500 text-white px-4 py-2.5 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5">
            <Download size={15} strokeWidth={2.5} />
            <span className="text-xs font-bold">Install Marketplace on your phone</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstall}
              className="bg-white text-pink-600 px-3 py-1 rounded-lg text-xs font-black hover:bg-pink-50 transition-all"
            >
              Install
            </button>
            <button onClick={() => setShowInstallBanner(false)} className="text-white/70 hover:text-white">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* HEADER - Deep Space Theme */}
      <header className="sticky top-0 z-50 bg-gradient-to-b from-[#0a0e27]/95 to-[#0f1a35]/95 dark:from-[#0a0e27]/95 dark:to-[#0f1a35]/95 text-white shadow-2xl border-b border-pink-500/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center shadow-lg shadow-pink-500/40 group-hover:shadow-pink-500/60 transition-all duration-300 transform group-hover:scale-110">
                <Store size={18} className="text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-lg tracking-tight text-white group-hover:text-pink-300 transition-colors">Marketplace</span>
                <span className="text-[10px] font-bold text-pink-400 tracking-wider">MALAWI</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV.map(n => {
                const active = isActive(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
                      active
                        ? "text-pink-300 bg-pink-500/20 border border-pink-500/40 shadow-lg shadow-pink-500/20"
                        : "text-white/70 hover:text-white hover:bg-white/10 border border-white/10 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/10"
                    }`}
                  >
                    <n.icon size={14} strokeWidth={2} />
                    {n.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 text-white/60 hover:text-pink-300 hover:bg-pink-500/15 rounded-lg transition-all duration-300 border border-white/10 hover:border-pink-500/40 transform hover:-translate-y-1 shadow-lg shadow-transparent hover:shadow-pink-500/20"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Sell Button - Floating Effect */}
              <Link
                href="/post-item"
                className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition-all duration-300 shadow-lg shadow-pink-500/40 hover:shadow-pink-500/60 border border-pink-400/30 transform hover:-translate-y-1 active:translate-y-0"
              >
                <Plus size={14} strokeWidth={3} />
                <span>Sell Item</span>
              </Link>

              {/* Mobile Menu */}
              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden p-2.5 text-white/60 hover:text-pink-300 hover:bg-pink-500/15 rounded-lg transition-all border border-white/10 hover:border-pink-500/40 transform hover:-translate-y-1 shadow-lg shadow-transparent hover:shadow-pink-500/20"
              >
                {open ? <X size={18} strokeWidth={2.5} /> : <Menu size={18} strokeWidth={2} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {open && (
          <div className="lg:hidden border-t border-pink-500/20 bg-gradient-to-b from-black/80 to-black/60 backdrop-blur-sm">
            <div className="px-4 py-4 flex flex-col gap-1">
              {NAV.map(n => {
                const active = isActive(n.href);
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
                      active
                        ? "text-pink-300 bg-pink-500/25 border border-pink-500/50 shadow-lg shadow-pink-500/20"
                        : "text-white/70 hover:text-white hover:bg-white/10 border border-white/10 hover:border-pink-500/30 hover:shadow-lg hover:shadow-pink-500/10"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <n.icon size={16} strokeWidth={2} />
                    {n.label}
                  </Link>
                );
              })}
              <Link
                href="/post-item"
                className="flex items-center gap-2.5 p-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 transition-all mt-2 shadow-lg shadow-pink-500/40 transform hover:-translate-y-1 active:translate-y-0"
                onClick={() => setOpen(false)}
              >
                <Plus size={16} strokeWidth={3} />
                Sell an Item
              </Link>
              {installPrompt && (
                <button
                  onClick={() => { handleInstall(); setOpen(false); }}
                  className="flex items-center gap-2.5 p-3 rounded-xl text-sm font-semibold text-pink-300 bg-pink-500/15 border border-pink-500/40 transition-all mt-1 transform hover:-translate-y-1 shadow-lg shadow-pink-500/10"
                >
                  <Download size={16} />
                  Install App
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* PAGE CONTENT */}
      <main
        className="flex-1 pb-20 lg:pb-0"
        style={{ opacity: pageVisible ? 1 : 0, transition: "opacity 120ms ease" }}
      >
        {children}
      </main>

      {/* MOBILE BOTTOM NAVIGATION - Deep Space Theme */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-gradient-to-t from-[#0a0e27]/95 to-[#0f1a35]/95 dark:from-[#0a0e27]/95 dark:to-[#0f1a35]/95 border-t border-pink-500/20 backdrop-blur-md">
        <div className="flex items-center justify-around h-16 px-2" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          {BOTTOM_NAV.map(n => {
            const active = isActive(n.href) && !n.isAction;
            if (n.isAction) {
              return (
                <Link
                  key={n.label}
                  href={n.href}
                  className="flex flex-col items-center justify-center -mt-6 transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center shadow-xl shadow-pink-500/50 border-4 border-[#0a0e27] hover:shadow-pink-500/70 transition-all duration-300 transform hover:scale-110">
                    <n.icon size={22} strokeWidth={2.5} className="text-white" />
                  </div>
                  <span className="text-[9px] font-bold text-pink-400 mt-1">Sell</span>
                </Link>
              );
            }
            return (
              <Link
                key={n.label}
                href={n.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300 flex-1 transform hover:-translate-y-1 ${
                  active ? "text-pink-400 shadow-lg shadow-pink-500/20" : "text-white/40 hover:text-white/70 hover:shadow-lg hover:shadow-pink-500/10"
                }`}
              >
                <n.icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[9px] font-semibold whitespace-nowrap leading-none">{n.label}</span>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* DESKTOP FOOTER - Deep Space Theme */}
      <footer className="hidden lg:block bg-gradient-to-b from-[#0f1a35]/80 to-[#0a0e27]/95 dark:from-[#0f1a35]/80 dark:to-[#0a0e27]/95 text-white/70 border-t border-pink-500/20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <Store size={16} className="text-white" />
                </div>
                <div>
                  <span className="font-black text-lg tracking-tight text-white">Marketplace</span>
                  <span className="text-xs text-pink-400 font-bold">MALAWI</span>
                </div>
              </div>
              <p className="text-xs text-white/45 leading-relaxed">
                Malawi\'s premium local marketplace. Buy and sell goods across all 28 districts with confidence.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">Marketplace</h4>
              <div className="space-y-2.5 text-xs">
                {[["Browse All", "/marketplace"], ["Sell an Item", "/post-item"]].map(([l, h]) => (
                  <Link key={h} href={h} className="block text-white/50 hover:text-pink-400 transition-colors font-medium">{l}</Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">Support</h4>
              <div className="space-y-2.5 text-xs">
                {[["Help Center", "/settings"], ["Safety Tips", "/settings"]].map(([l, h]) => (
                  <Link key={l} href={h} className="block text-white/50 hover:text-pink-400 transition-colors font-medium">{l}</Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">Payment</h4>
              <div className="text-xs text-white/50 space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-400 shrink-0" />
                  <span>Airtel Money accepted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-pink-400 shrink-0" />
                  <span>TNM Mpamba accepted</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-pink-500/10 pt-6 flex items-center justify-between">
            <p className="text-xs text-white/30">Marketplace Malawi · Connecting buyers & sellers</p>
            <p className="text-xs text-white/20">© 2026 Marketplace Malawi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
```
