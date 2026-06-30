import { Heart, Share2, MessageCircle, Flag, Copy, Check } from "lucide-react";
import { useState } from "react";

interface QuickActionsProps {
  itemId: string;
  itemTitle: string;
  itemUrl?: string;
  isSaved?: boolean;
  onSave?: (id: string) => void;
  onMessage?: () => void;
}

export default function QuickActions({
  itemId,
  itemTitle,
  itemUrl = window.location.href,
  isSaved = false,
  onSave,
  onMessage,
}: QuickActionsProps) {
  const [saved, setSaved] = useState(isSaved);
  const [copied, setCopied] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  const handleSave = () => {
    setSaved(!saved);
    onSave?.(itemId);
  };

  const handleShare = (platform: string) => {
    const text = `Check out this amazing item: ${itemTitle}`;
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + itemUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${itemUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${itemUrl}`,
      copy: "",
    };

    if (platform === "copy") {
      navigator.clipboard.writeText(itemUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setShareMenuOpen(false);
      return;
    }

    window.open(urls[platform], "_blank", "width=500,height=500");
    setShareMenuOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Main Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        {/* Message Button */}
        <button
          onClick={onMessage}
          className="flex flex-col items-center gap-2 p-3 rounded-xl border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-200 group"
        >
          <MessageCircle size={18} className="text-red-500 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-bold text-foreground">Message</span>
        </button>

        {/* Save/Wishlist Button */}
        <button
          onClick={handleSave}
          className="flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 group"
          style={{
            borderColor: saved ? "rgb(244, 63, 94)" : "rgb(229, 231, 235)",
            backgroundColor: saved ? "rgba(244, 63, 94, 0.1)" : "transparent",
          }}
        >
          <Heart
            size={18}
            className={saved ? "fill-red-500 text-red-500" : "text-foreground group-hover:text-red-500"}
            strokeWidth={saved ? 0 : 2}
          />
          <span className="text-[10px] font-bold" style={{ color: saved ? "rgb(244, 63, 94)" : "currentColor" }}>
            {saved ? "Saved" : "Save"}
          </span>
        </button>

        {/* Share Button */}
        <div className="relative">
          <button
            onClick={() => setShareMenuOpen(!shareMenuOpen)}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-200 group w-full"
          >
            <Share2 size={18} className="text-red-500 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-foreground">Share</span>
          </button>

          {/* Share Menu */}
          {shareMenuOpen && (
            <div className="absolute top-full mt-2 right-0 bg-card border border-red-500/20 rounded-xl shadow-xl z-50 min-w-[180px] overflow-hidden">
              <button
                onClick={() => handleShare("whatsapp")}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors text-sm font-semibold text-foreground border-b border-border"
              >
                <span className="text-lg">💬</span>
                WhatsApp
              </button>
              <button
                onClick={() => handleShare("facebook")}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors text-sm font-semibold text-foreground border-b border-border"
              >
                <span className="text-lg">👍</span>
                Facebook
              </button>
              <button
                onClick={() => handleShare("twitter")}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors text-sm font-semibold text-foreground border-b border-border"
              >
                <span className="text-lg">𝕏</span>
                Twitter
              </button>
              <button
                onClick={() => handleShare("copy")}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 transition-colors text-sm font-semibold text-foreground"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Report Button */}
      <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-500/20 hover:border-red-500/50 hover:bg-red-500/5 text-red-600 dark:text-red-400 font-semibold text-sm transition-all duration-200">
        <Flag size={14} />
        Report This Item
      </button>

      {/* Click outside to close share menu */}
      {shareMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShareMenuOpen(false)}
        />
      )}
    </div>
  );
}
