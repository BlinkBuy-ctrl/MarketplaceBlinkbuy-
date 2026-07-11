import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, MapPin, Truck } from "lucide-react";
import SellerBuyerMap from "@/components/SellerBuyerMap";
import type { MarketplaceItem } from "@/lib/mockData";
import { fetchActiveListings } from "@/lib/listings";
import { resolveDistrict } from "@/lib/locations";

export default function MapPage() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);

  useEffect(() => {
    fetchActiveListings().then(setItems);
  }, []);

  // Aggregate every listing's seller into a count-per-district list (with an
  // averaged GPS pin when sellers provided precise coordinates), so producers
  // show up on the map even if several of them share a town.
  const sellerDistricts = useMemo(() => {
    const groups = new Map<string, { count: number; latSum: number; lngSum: number; gpsCount: number }>();
    for (const item of items) {
      const district = resolveDistrict(item.seller?.location || item.location);
      const g = groups.get(district) ?? { count: 0, latSum: 0, lngSum: 0, gpsCount: 0 };
      g.count += 1;
      if (typeof item.seller?.lat === "number" && typeof item.seller?.lng === "number") {
        g.latSum += item.seller.lat;
        g.lngSum += item.seller.lng;
        g.gpsCount += 1;
      }
      groups.set(district, g);
    }
    return Array.from(groups.entries()).map(([district, g]) => ({
      district,
      count: g.count,
      lat: g.gpsCount > 0 ? g.latSum / g.gpsCount : undefined,
      lng: g.gpsCount > 0 ? g.lngSum / g.gpsCount : undefined,
    }));
  }, [items]);

  const totalSellers = sellerDistricts.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-5">
      {/* Header */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-red-500 transition-colors mb-4">
        <ArrowLeft size={14} /> Back
      </Link>

      <div className="flex items-center gap-2 mb-1">
        <Truck size={20} className="text-red-500" />
        <h1 className="text-xl font-black">Buyer–Seller Coverage Map</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        See where listings are coming from relative to your location — from the
        Blantyre–Lilongwe corridor out to every district — so producers know how
        far they are from buyers and can plan delivery or meet-up logistics accordingly.
      </p>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-500">
          <MapPin size={12} /> {sellerDistricts.length} districts active
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-500">
          {totalSellers} listings mapped
        </div>
      </div>

      <SellerBuyerMap
        mode="network"
        sellers={sellerDistricts}
        title="All sellers vs. your location"
      />

      <div className="mt-5 bg-amber-500/8 border border-amber-500/20 rounded-2xl p-4">
        <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1.5">Why this helps</p>
        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
          Knowing roughly how far a buyer is lets a seller quote accurate delivery
          times, decide whether to offer drop-off vs. pickup-only, and prioritise
          orders along busy routes like the Blantyre–Lilongwe corridor.
        </p>
      </div>
    </div>
  );
}
