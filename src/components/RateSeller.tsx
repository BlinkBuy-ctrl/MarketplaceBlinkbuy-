import { useState } from "react";
import { Star, CheckCircle } from "lucide-react";
import { addRating, getSellerRatingSummary } from "@/lib/ratings";

interface RateSellerProps {
  sellerId: string;
  sellerName: string;
  itemId: string;
}

export default function RateSeller({ sellerId, sellerName, itemId }: RateSellerProps) {
  const [hovered, setHovered] = useState(0);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const summary = getSellerRatingSummary(sellerId);

  const handleSubmit = () => {
    if (stars === 0) return;
    addRating({ sellerId, sellerName, itemId, stars, comment: comment.trim() || undefined });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-green-500/8 border border-green-500/20 rounded-2xl p-4 flex items-start gap-3">
        <CheckCircle size={18} className="text-green-600 shrink-0 mt-0.5" />
        <p className="text-sm font-bold text-green-700 dark:text-green-400">
          Thanks! Your {stars}-star rating for {sellerName} has been recorded.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-red-500/20 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold">Rate {sellerName}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-foreground">{summary.avg}</span>
          <span>({summary.count} rating{summary.count !== 1 ? "s" : ""})</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setStars(n)}
            className="p-0.5"
          >
            <Star
              size={26}
              className={(hovered || stars) >= n ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}
            />
          </button>
        ))}
      </div>

      {stars > 0 && (
        <>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Optional: how was your experience with this seller?"
            rows={2}
            className="w-full px-3 py-2.5 rounded-xl border border-red-500/20 bg-background text-sm outline-none focus:border-red-500 resize-none mb-3"
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            Submit Rating
          </button>
        </>
      )}
    </div>
  );
}
