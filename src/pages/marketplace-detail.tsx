import { useState } from "react";
import { Link, useParams } from "wouter";
import { MapPin, Phone, ArrowLeft, Tag, CheckCircle, Share2, Heart, MessageCircle, Star, Shield } from "lucide-react";
import { MOCK_ITEMS } from "@/lib/mockData";
import { formatMK } from "@/lib/utils";

export default function MarketplaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [copied, setCopied] = useState(false);
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem("wishlist") || "[]")); }
    catch { return new Set(); }
  });

  const item = MOCK_ITEMS.find(i => i.id === id);

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center page-enter">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
          <Tag size={28} className="text-muted-foreground opacity-50" />
        </div>
        <h2 className="text-xl font-bold mb-2">Item not found</h2>
        <p className="text-muted-foreground text-sm mb-6">This listing may have been removed.</p>
        <Link href="/marketplace" className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold">
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

  const whatsappMsg = encodeURIComponent(`Hi, I saw your listing on Market Hub Malawi: "${item.title}" for ${formatMK(item.price)}. Is it still available?`);
  const whatsappUrl = `https://wa.me/265${seller.whatsapp.replace(/^0/, "")}?text=${whatsappMsg}`;

  const related = MOCK_ITEMS.filter(i => i.id !== item.id && i.category === item.category).slice(0, 4);

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
                <Heart size={16} className={inWishlist ? "text-red-400 fill-red-400" : "text-white"} strokeWidth={2} />
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
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImage ? "border-red-500 shadow-md shadow-red-500/30" : "border-border opacity-70 hover:opacity-100"}`}
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
          <div className="bg-card border border-red-500/20 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h1 className="text-xl font-black leading-tight flex-1">{item.title}</h1>
            </div>

            <div className="text-3xl font-black text-red-500 mb-4">{formatMK(item.price)}</div>

            <div className="flex items-center gap-3 flex-wrap mb-4">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin size={12} className="text-red-400" />
                <span className="font-semibold">{item.location}</span>
              </div>
              {item.category && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Tag size={12} className="text-red-400" />
                  <span className="font-semibold">{item.category}</span>
                </div>
              )}
              {item.condition && (
                <div className="inline-flex items-center gap-1 bg-red-500/10 text-red-600 text-xs px-2.5 py-1 rounded-full border border-red-500/20 font-semibold">
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
            <div className="bg-card border border-red-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-red-700/20 border border-red-500/30 flex items-center justify-center text-lg font-black text-red-500 shrink-0">
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
                {/* WhatsApp - Primary CTA */}
                {seller.whatsapp && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-green-500/30"
                  >
                    <MessageCircle size={17} strokeWidth={2.5} />
                    WhatsApp Seller
                  </a>
                )}

                {/* Call */}
                {seller.phone && (
                  <a
                    href={`tel:${seller.phone}`}
                    className="w-full flex items-center justify-center gap-2.5 border-2 border-red-500/30 text-red-500 hover:bg-red-500/10 py-3 rounded-xl text-sm font-bold transition-all"
                  >
                    <Phone size={15} strokeWidth={2.5} />
                    Call: {seller.phone}
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
            className="w-full flex items-center justify-center gap-2 border border-border py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:border-red-500/30 transition-all font-medium"
          >
            <Share2 size={14} />
            {copied ? "Link copied! ✓" : "Share this listing"}
          </button>
        </div>
      </div>

      {/* Related Items */}
      {related.length > 0 && (
        <div>
          <h3 className="font-black text-lg mb-4">More in {item.category}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map(rel => (
              <Link key={rel.id} href={`/marketplace/${rel.id}`}>
                <div className="bg-card border border-red-500/20 hover:border-red-500/50 rounded-xl overflow-hidden card-hover cursor-pointer group">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={rel.images[0]}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-xs font-bold line-clamp-2 mb-1 group-hover:text-red-500 transition-colors">{rel.title}</h4>
                    <div className="text-sm font-black text-red-500">{formatMK(rel.price)}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
