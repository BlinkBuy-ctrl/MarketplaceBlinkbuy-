import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Star } from "lucide-react";
import { getAppRatingSummary } from "@/lib/appRating";

// Small "X.X ★ (N ratings)" pill for the home page hero.
// Fetches the live community average from Supabase on mount.
// Tapping it sends the user to Settings, where they can rate the app.
export default function AppRatingBadge() {
  const [summary, setSummary] = useState<{ average: number; count: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAppRatingSummary()
      .then(s => { if (!cancelled) setSummary(s); })
      .catch(() => { /* silently hide the badge if this fails — non-critical UI */ });
    return () => { cancelled = true; };
  }, []);

  // Nothing to show yet, or nobody has rated the app — don't clutter the hero.
  if (!summary || summary.count === 0) return null;

  return (
    <Link
      href="/settings"
      className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-amber-400/40 rounded-full px-3 py-1.5 text-xs font-bold text-white transition-all backdrop-blur-sm mb-4"
    >
      <Star size={13} className="fill-amber-400 text-amber-400 shrink-0" />
      {summary.average.toFixed(1)}
      <span className="text-white/60 font-medium">
        · {summary.count} {summary.count === 1 ? "rating" : "ratings"}
      </span>
    </Link>
  );
}
