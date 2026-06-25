import { Star, Shield, Award, TrendingUp, MessageCircle, AlertCircle } from "lucide-react";

interface SellerInfo {
  name: string;
  rating: number;
  reviews: number;
  verified: boolean;
  joinedDate?: string;
  responseTime?: string;
}

interface TrustSafetyProps {
  sellerInfo?: SellerInfo;
  variant?: "compact" | "full";
}

export default function TrustSafety({ 
  sellerInfo = {
    name: "Local Seller",
    rating: 4.8,
    reviews: 127,
    verified: true,
    joinedDate: "Jan 2024",
    responseTime: "2 hours",
  },
  variant = "compact"
}: TrustSafetyProps) {
  return (
    <div className="space-y-4">
      {variant === "full" && (
        <>
          {/* Seller Info Card */}
          <div className="bg-card border border-pink-500/20 rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-foreground">{sellerInfo.name}</h3>
                  {sellerInfo.verified && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/30">
                      <Shield size={12} className="text-green-600" />
                      <span className="text-[10px] font-bold text-green-600">Verified</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(sellerInfo.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold">{sellerInfo.rating}</span>
                  <span className="text-xs text-muted-foreground">({sellerInfo.reviews} reviews)</span>
                </div>
              </div>
              <Award size={20} className="text-pink-500" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-background rounded-lg p-2">
                <p className="text-muted-foreground font-semibold mb-0.5">Joined</p>
                <p className="font-bold">{sellerInfo.joinedDate}</p>
              </div>
              <div className="bg-background rounded-lg p-2">
                <p className="text-muted-foreground font-semibold mb-0.5">Response Time</p>
                <p className="font-bold">{sellerInfo.responseTime}</p>
              </div>
            </div>
          </div>

          {/* Buyer Protection */}
          <div className="bg-card border border-pink-500/20 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-pink-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm mb-2">Buyer Protection Guaranteed</h4>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 font-bold mt-0.5">✓</span>
                    <span>Secure payment escrow system</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 font-bold mt-0.5">✓</span>
                    <span>Dispute resolution within 7 days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 font-bold mt-0.5">✓</span>
                    <span>Full refund if item not received</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500 font-bold mt-0.5">✓</span>
                    <span>Verified seller identity</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {variant === "compact" && (
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-pink-500/10 border border-pink-500/20">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold">{sellerInfo.rating} ({sellerInfo.reviews})</span>
          </div>
          {sellerInfo.verified && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-green-500/10 border border-green-500/20">
              <Shield size={14} className="text-green-600" />
              <span className="text-xs font-bold text-green-700">Verified Seller</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-500/10 border border-blue-500/20">
            <TrendingUp size={14} className="text-blue-600" />
            <span className="text-xs font-bold text-blue-700">Fast Responses</span>
          </div>
        </div>
      )}

      {/* Report Section */}
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg px-4 py-3 flex gap-3">
        <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-red-700 dark:text-red-300 mb-1">Something wrong?</p>
          <p className="text-xs text-red-600 dark:text-red-400">
            Report this listing or contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
