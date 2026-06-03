import { useState } from "react";
import { Link, useParams } from "wouter";
import { MapPin, Phone, MessageCircle, ArrowLeft, Tag, CheckCircle, Share2 } from "lucide-react";
import { MOCK_ITEMS } from "@/lib/mockData";
import { formatMK } from "@/lib/utils";

export default function MarketplaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [msgSent, setMsgSent] = useState(false);

  const item = MOCK_ITEMS.find(i => i.id === id);

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center page-enter">
        <h2 className="text-xl font-bold mb-2">Item not found</h2>
        <Link href="/marketplace" className="text-primary hover:underline">Browse marketplace</Link>
      </div>
    );
  }

  const seller = item.seller;
  const images = item.images || [];

  const handleMessage = () => {
    setMsgSent(true);
    setTimeout(() => setMsgSent(false), 2500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: item.title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 page-enter">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-all"
      >
        <ArrowLeft size={14} /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Images */}
        <div>
          <div className="aspect-square bg-muted rounded-xl overflow-hidden mb-2">
            {images.length > 0 ? (
              <img
                src={images[selectedImage]}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/fallback${item.id}/600/600`; }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                No image available
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage ? "border-primary" : "border-border"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="bg-card border border-card-border rounded-xl p-5">
            {item.is_featured && (
              <span className="inline-block bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full mb-3">
                ⭐ Featured
              </span>
            )}
            <h1 className="text-xl font-black mb-2">{item.title}</h1>
            <div className="text-2xl font-black text-primary mb-3">{formatMK(item.price)}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <MapPin size={12} />
              {item.location}
              {item.category && (
                <>
                  <span>•</span>
                  <Tag size={12} />
                  {item.category}
                </>
              )}
            </div>
            {item.condition && (
              <div className="inline-flex items-center gap-1 bg-muted text-xs px-2 py-1 rounded-full mb-3">
                <CheckCircle size={11} /> {item.condition}
              </div>
            )}
            {item.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            )}
          </div>

          {/* Seller */}
          {seller && (
            <div className="bg-card border border-card-border rounded-xl p-4">
              <h3 className="text-sm font-bold mb-3">Contact Seller</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {seller.name?.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-sm">{seller.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin size={10} />{seller.location}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleMessage}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all"
                >
                  <MessageCircle size={15} />
                  {msgSent ? "Message sent! ✓" : "Message Seller"}
                </button>
                {seller.whatsapp && (
                  <a
                    href={`https://wa.me/265${seller.whatsapp.replace(/^0/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-green-600 transition-all"
                  >
                    <MessageCircle size={15} /> WhatsApp Seller
                  </a>
                )}
                {seller.phone && (
                  <a
                    href={`tel:${seller.phone}`}
                    className="w-full flex items-center justify-center gap-2 border border-border py-2.5 rounded-xl text-sm hover:bg-muted transition-all"
                  >
                    <Phone size={15} /> Call Seller
                  </a>
                )}
              </div>
            </div>
          )}

          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 border border-border py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted transition-all"
          >
            <Share2 size={14} /> Share this listing
          </button>
        </div>
      </div>
    </div>
  );
}
