import { MessageCircle, Send, ExternalLink, Phone } from "lucide-react";
import { useState } from "react";

interface WhatsAppMessagingProps {
  sellerName: string;
  sellerPhone: string;
  itemTitle: string;
  itemPrice: number;
  sellerRating?: number;
  responseTime?: string;
}

export default function WhatsAppMessaging({
  sellerName,
  sellerPhone,
  itemTitle,
  itemPrice,
  sellerRating = 4.8,
  responseTime = "2 hours"
}: WhatsAppMessagingProps) {
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState("");

  // WhatsApp message format
  const defaultMessage = `Hi ${sellerName}, I'm interested in "${itemTitle}" listed at ${itemPrice.toLocaleString()} MK. Can you tell me more about this item?`;
  
  const whatsappUrl = `https://wa.me/${sellerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(defaultMessage)}`;

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Send via WhatsApp
    const customMessage = message || defaultMessage;
    window.open(`https://wa.me/${sellerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(customMessage)}`, "_blank");
    setMessage("");
    setShowChat(false);
  };

  return (
    <div className="space-y-3">
      {/* Quick Contact Card */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-bold text-green-700 dark:text-green-400 mb-1">Contact Seller</h3>
            <p className="text-xs text-green-600 dark:text-green-300">Avg response: {responseTime}</p>
          </div>
          {sellerRating && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-400/20">
              <span className="text-xl">⭐</span>
              <span className="text-xs font-bold">{sellerRating}</span>
            </div>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex gap-2">
          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 shadow-lg hover:shadow-green-500/50 border border-green-400/30"
          >
            <MessageCircle size={16} strokeWidth={2.5} />
            WhatsApp
          </a>

          {/* Phone Call Button */}
          <a
            href={`tel:${sellerPhone}`}
            className="flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 border border-blue-500/30 hover:border-blue-500/50"
          >
            <Phone size={16} strokeWidth={2.5} />
            Call
          </a>
        </div>
      </div>

      {/* Chat Interface Toggle */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 px-4 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 border border-red-500/30"
        >
          <MessageCircle size={14} />
          Type a Custom Message
        </button>
      )}

      {/* Chat Input */}
      {showChat && (
        <div className="bg-card border border-red-500/20 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm">Send Message via WhatsApp</h4>
            <button
              onClick={() => setShowChat(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <form onSubmit={sendMessage} className="space-y-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={defaultMessage}
              className="w-full px-3 py-2.5 rounded-lg border border-red-500/20 bg-background text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 resize-none font-medium"
              rows={3}
            />

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 shadow-lg hover:shadow-green-500/50 border border-green-400/30"
            >
              <Send size={14} strokeWidth={2.5} />
              Send via WhatsApp
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center">
            💡 This will open WhatsApp Web/App to send your message
          </p>
        </div>
      )}

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-2.5 flex gap-2">
        <span className="text-lg shrink-0">📱</span>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <span className="font-bold">Secure & Direct:</span> Chat directly on WhatsApp, not on our platform. Keep your conversations safe.
        </p>
      </div>
    </div>
  );
}
