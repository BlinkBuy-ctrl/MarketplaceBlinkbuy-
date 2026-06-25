import { Circle, Clock, Award, TrendingUp } from "lucide-react";

interface SellerLiveStatusProps {
  sellerName: string;
  isOnline: boolean;
  responseTimeMinutes?: number;
  totalSales?: number;
  joinedDate?: string;
  successRate?: number;
}

export default function SellerLiveStatus({
  sellerName,
  isOnline = true,
  responseTimeMinutes = 45,
  totalSales = 287,
  joinedDate = "January 2024",
  successRate = 98.5,
}: SellerLiveStatusProps) {
  const getResponseTimeLabel = (minutes: number): string => {
    if (minutes < 5) return "Ultra-fast";
    if (minutes < 30) return "Very fast";
    if (minutes < 120) return "Fast";
    return "Slow";
  };

  const getResponseColor = (minutes: number): string => {
    if (minutes < 5) return "text-green-600 dark:text-green-400";
    if (minutes < 30) return "text-green-600 dark:text-green-400";
    if (minutes < 120) return "text-blue-600 dark:text-blue-400";
    return "text-orange-600 dark:text-orange-400";
  };

  return (
    <div className="space-y-4">
      {/* Online Status Card */}
      <div
        className={`relative overflow-hidden rounded-xl border-2 p-4 ${
          isOnline
            ? "border-green-500/40 bg-gradient-to-br from-green-500/10 to-emerald-500/10"
            : "border-gray-500/40 bg-gradient-to-br from-gray-500/10 to-slate-500/10"
        }`}
      >
        {/* Animated background */}
        {isOnline && (
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 via-green-500/10 to-green-500/0 animate-pulse" />
          </div>
        )}

        <div className="relative space-y-3">
          {/* Status Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`relative ${isOnline ? "animate-pulse" : ""}`}>
                <Circle
                  size={12}
                  className={isOnline ? "fill-green-500 text-green-500" : "fill-gray-500 text-gray-500"}
                />
                {isOnline && (
                  <Circle
                    size={16}
                    className="absolute inset-0 -m-2 text-green-500 opacity-30 animate-ping"
                  />
                )}
              </div>
              <span className={`font-bold text-sm ${isOnline ? "text-green-600 dark:text-green-400" : "text-gray-600"}`}>
                {isOnline ? "Online Now" : "Offline"}
              </span>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm font-semibold">
              {sellerName}
            </span>
          </div>

          {/* Response Time */}
          <div className="flex items-center gap-2 text-sm">
            <Clock size={14} className={getResponseColor(responseTimeMinutes)} />
            <span className="text-foreground font-semibold">
              {responseTimeMinutes < 60
                ? `${responseTimeMinutes}m response time`
                : `${Math.floor(responseTimeMinutes / 60)}h response time`}
            </span>
            <span className={`text-xs font-bold ${getResponseColor(responseTimeMinutes)}`}>
              ({getResponseTimeLabel(responseTimeMinutes)})
            </span>
          </div>

          {/* Last Seen */}
          {!isOnline && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Last seen 2 hours ago • Usually responds within 45 minutes
            </p>
          )}
        </div>
      </div>

      {/* Seller Stats Grid */}
      <div className="grid grid-cols-3 gap-2">
        {/* Total Sales */}
        <div className="bg-card border border-pink-500/20 rounded-lg p-3 text-center">
          <TrendingUp size={16} className="text-pink-500 mx-auto mb-1.5" />
          <div className="text-xl font-black text-foreground">{totalSales}+</div>
          <p className="text-[10px] text-muted-foreground font-semibold">Sales</p>
        </div>

        {/* Success Rate */}
        <div className="bg-card border border-pink-500/20 rounded-lg p-3 text-center">
          <Award size={16} className="text-yellow-500 mx-auto mb-1.5" />
          <div className="text-xl font-black text-foreground">{successRate}%</div>
          <p className="text-[10px] text-muted-foreground font-semibold">Success</p>
        </div>

        {/* Member Since */}
        <div className="bg-card border border-pink-500/20 rounded-lg p-3 text-center">
          <Circle size={16} className="text-blue-500 mx-auto mb-1.5" />
          <div className="text-sm font-black text-foreground">Member</div>
          <p className="text-[10px] text-muted-foreground font-semibold">Since {joinedDate.split(" ")[0]}</p>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-3 space-y-2">
        <p className="text-xs font-bold text-blue-700 dark:text-blue-400">✓ Trust Indicators</p>
        <div className="space-y-1.5 text-[11px] text-blue-600 dark:text-blue-300 font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Verified seller identity
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            {successRate}% positive feedback
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            {responseTimeMinutes < 120 ? "Fast response times" : "Reliable responder"}
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-3 text-center">
        <p className="text-sm font-bold text-green-700 dark:text-green-400">
          {isOnline ? "💬 Seller is online now - message for instant reply!" : "Message seller now for quick response"}
        </p>
      </div>
    </div>
  );
}
