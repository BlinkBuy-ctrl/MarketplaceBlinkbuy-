import { useEffect, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { getLikeCount, hasLiked, toggleLike } from "@/lib/likes";

interface LikeButtonProps {
  itemId: string;
  size?: number;
  /** Extra classes on the button (use to reposition/restyle per context). */
  className?: string;
  /** Show the numeric count next to the icon. Default true. */
  showCount?: boolean;
}

export default function LikeButton({ itemId, size = 13, className = "", showCount = true }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setLiked(hasLiked(itemId));
    setCount(getLikeCount(itemId));
  }, [itemId]);

  const handleClick = (e: React.MouseEvent) => {
    // Listing cards are wrapped in a <Link>; stop the click from also
    // triggering navigation to the listing page.
    e.preventDefault();
    e.stopPropagation();
    const result = toggleLike(itemId);
    setLiked(result.liked);
    setCount(result.count);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={liked}
      className={`inline-flex items-center gap-1 font-semibold transition-colors ${
        liked ? "text-red-500" : "text-muted-foreground hover:text-red-400"
      } ${className}`}
    >
      <ThumbsUp size={size} className={liked ? "fill-red-500" : ""} strokeWidth={2} />
      {showCount && <span className="text-[11px]">{count}</span>}
    </button>
  );
}
