import { useState } from "react";
import { Link, useParams } from "wouter";
import {
  MapPin, Phone, MessageCircle, ArrowLeft, Tag,
  CheckCircle, Share2, ShieldCheck,
} from "lucide-react";
import { MOCK_ITEMS } from "@/lib/mockData";
import { formatMK } from "@/lib/utils";

const CONDITION_COLOR: Record<string, string> = {
  "New":       "#26d97a",
  "Like New":  "#6babff",
  "Good":      "#a78bfa",
  "Fair":      "#f59e0b",
  "For Parts": "#CE1126",
};

export default function MarketplaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [msgSent, setMsgSent] = useState(false);

  const item = MOCK_ITEMS.find(i => i.id === id);

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center page-enter">
        <div className="text-6xl font-black mb-4" style={{ color: "rgba(255,255,255,0.08)" }}>404</div>
        <h2 className="text-xl font-bold text-white mb-2">Item not found</h2>
        <Link href="/marketplace" className="text-sm font-semibold" style={{ color: "#6babff" }}>
          ← Browse marketplace
        </Link>
      </div>
    );
  }

  const seller = item.seller;
  const images = item.images || [];
  const condColor = CONDITION_COLOR[item.condition] ?? "rgba(255,255,255,0.45)";

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

      {/* Back link */}
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1.5 text-sm font-medium mb-5 transition-all"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        <ArrowLeft size={14} /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Images ─────────────────────────────────────────── */}
        <div>
          <div
            className="aspect-square rounded-2xl overflow-hidden mb-3"
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--card-border))",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {images.length > 0 ? (
              <img
                src={images[selectedImage]}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={e => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/fallback${item.id}/600/600`;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>No image available</span>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className="w-14 h-14 rounded-xl overflow-hidden transition-all"
                  style={{
                    border: i === selectedImage
                      ? "2px solid #0047AB"
                      : "2px solid hsl(var(--border))",
                    boxShadow: i === selectedImage ? "0 0 0 2px rgba(0,71,171,0.30)" : "none",
                  }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Details ────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Main info card */}
          <div
            className="rounded-2xl p-5"
            style={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--card-border))",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {item.is_featured && (
              <span className="inline-block badge-amber text-xs font-bold px-2 py-0.5 rounded-full mb-3">
                ★ Featured Listing
              </span>
            )}

            <h1 className="text-xl font-black text-white mb-2 leading-tight">{item.title}</h1>

            <div className="text-3xl font-black mb-3" style={{ color: "#6babff" }}>
              {formatMK(item.price)}
            </div>

            <div className="flex items-center gap-3 flex-wrap mb-4">
              <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "rgba(255,255,255,0.50)" }}>
                <MapPin size={12} /> {item.location}
              </div>
              {item.category && (
                <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "rgba(255,255,255,0.50)" }}>
                  <Tag size={12} /> {item.category}
                </div>
              )}
              {item.condition && (
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${condColor}18`,
                    color: condColor,
                    border: `1px solid ${condColor}35`,
                  }}
                >
                  <CheckCircle size={10} /> {item.condition}
                </span>
              )}
            </div>

            {item.description && (
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
                {item.description}
              </p>
            )}
          </div>

          {/* Seller / Contact card */}
          {seller && (
            <div
              className="rounded-2xl p-5"
              style={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--card-border))",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck size={14} style={{ color: "#26d97a" }} />
                <h3 className="text-sm font-bold text-white">Contact Seller</h3>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #0047AB 0%, #007A33 100%)",
                    color: "#fff",
                  }}
                >
                  {seller.name?.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{seller.name}</div>
                  <div className="text-xs flex items-center gap-1" style={{ color: "rgba(255,255,255,0.40)" }}>
                    <MapPin size={10} />{seller.location}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={handleMessage}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold btn-primary"
                >
                  <MessageCircle size={15} />
                  {msgSent ? "Message sent! ✓" : "Message Seller"}
                </button>

                {seller.whatsapp && (
                  <a
                    href={`https://wa.me/265${seller.whatsapp.replace(/^0/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold btn-green"
                  >
                    <MessageCircle size={15} /> WhatsApp Seller
                  </a>
                )}

                {seller.phone && (
                  <a
                    href={`tel:${seller.phone}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      border: "1px solid hsl(var(--border))",
                      color: "rgba(255,255,255,0.70)",
                      backgroundColor: "hsl(var(--muted))",
                    }}
                  >
                    <Phone size={15} /> Call Seller
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Share */}
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              border: "1px solid hsl(var(--border))",
              color: "rgba(255,255,255,0.45)",
              backgroundColor: "transparent",
            }}
          >
            <Share2 size={14} /> Share this listing
          </button>
        </div>
      </div>
    </div>
  );
}
