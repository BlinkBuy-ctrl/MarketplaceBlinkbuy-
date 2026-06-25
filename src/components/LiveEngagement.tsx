import { Eye, Zap, AlertCircle, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface LiveEngagementProps {
  viewCount?: number;
  savesCount?: number;
  stockLevel?: number;
  dailyViews?: number;
  isHotDeal?: boolean;
}

export default function LiveEngagement({
  viewCount = Math.floor(Math.random() * 150) + 5,
  savesCount = Math.floor(Math.random() * 50) + 2,
  stockLevel = Math.floor(Math.random() * 10) + 1,
  dailyViews = Math.floor(Math.random() * 500) + 50,
  isHotDeal = false,
}: LiveEngagementProps) {
  const [animatedViews, setAnimatedViews] = useState(viewCount - 10);
  const [pulse, setPulse] = useState(true);

  // Animate view count going up
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedViews((v) => (v < viewCount ? v + Math.floor(Math.random() * 3) + 1 : v));
    }, 3000);
    return () => clearInterval(interval);
  }, [viewCount]);

  // Pulse animation for hot deals
  useEffect(() => {
    const interval = setInterval(() => setPulse((p) => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  const stockStatus =
    stockLevel === 0
      ? { label: "Out of Stock", color: "text-red-600", bg: "bg-red-500/20", border: "border-red-500/30" }
      : stockLevel === 1
        ? { label: "Last one left!", color: "text-orange-600", bg: "bg-orange-500/20", border: "border-orange-500/30" }
        : stockLevel <= 3
          ? { label: `Only ${stockLevel} left!`, color: "text-amber-600", bg: "bg-amber-500/20", border: "border-amber-500/30" }
          : { label: "In Stock", color: "text-green-600", bg: "bg-green-500/20", border: "border-green-500/30" };

  return (
    <div className="space-y-3">
      {/* Hot Deal Badge */}
      {isHotDeal && (
        <div
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/40 transition-all duration-500 ${
            pulse ? "shadow-lg shadow-orange-500/30" : "shadow-none"
          }`}
        >
          <Zap size={16} className="text-orange-500 animate-pulse" />
          <span className="font-bold text-sm text-orange-600 dark:text-orange-400">🔥 HOT DEAL - Selling Fast!</span>
        </div>
      )}

      {/* Real-time Engagement Stats */}
      <div className="grid grid-cols-2 gap-3">
        {/* People Viewing Now */}
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">Viewing Now</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-blue-600 dark:text-blue-400">{animatedViews}</span>
            <span className="text-[10px] text-blue-600/70 dark:text-blue-400/70">people</span>
          </div>
        </div>

        {/* Saves/Wishlist */}
        <div className="bg-gradient-to-br from-pink-500/10 to-pink-600/10 border border-pink-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-lg">❤️</span>
            <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400 uppercase">Saved</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-pink-600 dark:text-pink-400">{savesCount}</span>
            <span className="text-[10px] text-pink-600/70 dark:text-pink-400/70">times</span>
          </div>
        </div>
      </div>

      {/* Stock Status */}
      <div className={`${stockStatus.bg} border ${stockStatus.border} rounded-lg p-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <AlertCircle size={16} className={stockStatus.color} />
          <span className={`text-sm font-bold ${stockStatus.color}`}>{stockStatus.label}</span>
        </div>
        {stockLevel > 0 && stockLevel <= 3 && <Zap size={14} className="text-orange-500 animate-pulse" />}
      </div>

      {/* Daily Views Trend */}
      <div className="bg-card border border-pink-500/20 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-green-500" />
            <span className="text-xs font-bold text-foreground">Today</span>
          </div>
          <span className="text-sm font-black text-green-600">{dailyViews}</span>
        </div>
        <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((dailyViews / 500) * 100, 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5">Total views today</p>
      </div>

      {/* CTA - Buy Now Before Gone */}
      {(isHotDeal || stockLevel <= 3) && (
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-3.5 text-center">
          <p className="text-white font-bold text-sm">⚡ Don't miss out - Limited availability!</p>
          <p className="text-white/80 text-xs mt-1">Items like this sell out fast</p>
        </div>
      )}
    </div>
  );
}
