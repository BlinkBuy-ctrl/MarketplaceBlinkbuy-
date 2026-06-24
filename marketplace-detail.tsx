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
                placeholder="Hi, I'm interested in this item. Is it still available?"
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
