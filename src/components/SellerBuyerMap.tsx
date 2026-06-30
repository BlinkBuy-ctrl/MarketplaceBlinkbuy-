import { useMemo, useState } from "react";
import { MapPin, Navigation, LocateFixed, Truck } from "lucide-react";
import {
  DISTRICT_COORDS,
  getCoords,
  project,
  haversineKm,
  estimateDrivingMinutes,
  formatDistance,
  formatDuration,
} from "@/lib/locations";
import { CITIES } from "@/lib/mockData";

const VB_W = 300;
const VB_H = 540;

// Decorative, simplified outline of Lake Malawi for visual context only.
// Not survey-accurate — purely to make the schematic map readable at a glance.
const LAKE_PATH =
  "M126,58 C150,70 165,100 158,140 C172,165 195,180 188,205 " +
  "C200,230 200,260 162,265 C175,290 195,300 178,330 " +
  "C200,345 215,355 226,362 C210,375 185,372 178,355 " +
  "C160,330 150,300 158,270 C140,250 132,220 145,200 " +
  "C128,175 118,150 130,120 C118,100 115,75 126,58 Z";

interface SellerPin {
  /** District name (must exist in DISTRICT_COORDS) */
  district: string;
  /** Number of listings / sellers based in this district */
  count: number;
}

interface SellerBuyerMapProps {
  /** "route" = one seller <-> one buyer. "network" = many sellers <-> one buyer. */
  mode: "route" | "network";
  /** Required for route mode: the seller's free-text or district location. */
  sellerLocation?: string;
  /** Required for network mode: aggregated seller districts + counts. */
  sellers?: SellerPin[];
  /** Initial buyer district. Defaults to Lilongwe. */
  defaultBuyerCity?: string;
  /** Optional heading shown above the map. */
  title?: string;
  /** Compact = smaller height, used inline on listing pages. */
  compact?: boolean;
}

export default function SellerBuyerMap({
  mode,
  sellerLocation,
  sellers = [],
  defaultBuyerCity = "Lilongwe",
  title,
  compact = false,
}: SellerBuyerMapProps) {
  const [buyerCity, setBuyerCity] = useState(defaultBuyerCity);
  const [locating, setLocating] = useState(false);

  const buyerCoord = useMemo(() => getCoords(buyerCity), [buyerCity]);
  const buyerXY = useMemo(() => project(buyerCoord, VB_W, VB_H), [buyerCoord]);

  const sellerDistricts: SellerPin[] = useMemo(() => {
    if (mode === "route") {
      const d = sellerLocation
        ? Object.keys(DISTRICT_COORDS).find(k =>
            sellerLocation.toLowerCase().includes(k.toLowerCase())
          ) ?? "Lilongwe"
        : "Lilongwe";
      return [{ district: d, count: 1 }];
    }
    return sellers;
  }, [mode, sellerLocation, sellers]);

  const routes = useMemo(() => {
    return sellerDistricts.map(s => {
      const coord = getCoords(s.district);
      const xy = project(coord, VB_W, VB_H);
      const km = haversineKm(buyerCoord, coord);
      const mins = estimateDrivingMinutes(km);
      return { ...s, coord, xy, km, mins };
    }).sort((a, b) => a.km - b.km);
  }, [sellerDistricts, buyerCoord]);

  // Always-shown reference corridor between the two biggest hubs.
  const blantyreXY = useMemo(() => project(getCoords("Blantyre"), VB_W, VB_H), []);
  const lilongweXY = useMemo(() => project(getCoords("Lilongwe"), VB_W, VB_H), []);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const me = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        let nearest = "Lilongwe";
        let best = Infinity;
        for (const [name, coord] of Object.entries(DISTRICT_COORDS)) {
          const d = haversineKm(me, coord);
          if (d < best) { best = d; nearest = name; }
        }
        setBuyerCity(nearest);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  };

  return (
    <div className="bg-card border border-red-500/20 rounded-2xl p-4">
      {title && (
        <div className="flex items-center gap-2 mb-3">
          <Truck size={15} className="text-red-500" />
          <p className="text-sm font-bold">{title}</p>
        </div>
      )}

      {/* Buyer location controls */}
      <div className="flex items-center gap-2 mb-3">
        <label className="text-xs font-semibold text-muted-foreground shrink-0">
          Your location:
        </label>
        <select
          value={buyerCity}
          onChange={e => setBuyerCity(e.target.value)}
          className="flex-1 min-w-0 text-xs font-semibold bg-background border border-red-500/20 rounded-lg px-2 py-1.5"
        >
          {CITIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button
          onClick={handleDetectLocation}
          disabled={locating}
          title="Detect my location"
          className="shrink-0 p-1.5 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
        >
          <LocateFixed size={14} className={locating ? "animate-pulse" : ""} />
        </button>
      </div>

      {/* Map */}
      <div className={`relative w-full ${compact ? "max-h-[260px]" : "max-h-[420px]"} overflow-hidden rounded-xl bg-[#0f0f0f]`}>
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full h-auto block">
          {/* Lake Malawi (decorative) */}
          <path d={LAKE_PATH} className="fill-blue-500/15 stroke-blue-400/30" strokeWidth={1} />
          <text x={205} y={130} className="fill-blue-300/50 text-[7px] font-semibold">Lake Malawi</text>

          {/* Faint dots for all districts, for context */}
          {Object.entries(DISTRICT_COORDS).map(([name, coord]) => {
            const xy = project(coord, VB_W, VB_H);
            return (
              <circle key={name} cx={xy.x} cy={xy.y} r={1.4} className="fill-white/15" />
            );
          })}

          {/* Reference corridor: Blantyre <-> Lilongwe (M1) */}
          <line
            x1={lilongweXY.x} y1={lilongweXY.y}
            x2={blantyreXY.x} y2={blantyreXY.y}
            className="stroke-amber-400/40"
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
          <text
            x={(lilongweXY.x + blantyreXY.x) / 2 + 6}
            y={(lilongweXY.y + blantyreXY.y) / 2}
            className="fill-amber-300/60 text-[6.5px] font-bold"
          >
            M1 · LL–BT
          </text>

          {/* Routes: buyer -> each seller district */}
          {routes.map(r => (
            <line
              key={r.district}
              x1={buyerXY.x} y1={buyerXY.y}
              x2={r.xy.x} y2={r.xy.y}
              className="stroke-red-500/60"
              strokeWidth={1.6}
              strokeDasharray="5 4"
            />
          ))}

          {/* Seller pins */}
          {routes.map(r => (
            <g key={r.district}>
              <circle cx={r.xy.x} cy={r.xy.y} r={r.count > 1 ? 7 : 5.5} className="fill-red-500 stroke-white" strokeWidth={1} />
              {r.count > 1 && (
                <text x={r.xy.x} y={r.xy.y + 2.5} textAnchor="middle" className="fill-white text-[6.5px] font-bold">
                  {r.count}
                </text>
              )}
              <text x={r.xy.x} y={r.xy.y - 10} textAnchor="middle" className="fill-white text-[7px] font-bold">
                {r.district}
              </text>
            </g>
          ))}

          {/* Buyer pin */}
          <circle cx={buyerXY.x} cy={buyerXY.y} r={6.5} className="fill-blue-500 stroke-white" strokeWidth={1.5} />
          <text x={buyerXY.x} y={buyerXY.y - 11} textAnchor="middle" className="fill-blue-300 text-[7px] font-bold">
            You
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Buyer (you)</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Seller</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400/60 inline-block" /> M1 corridor</span>
      </div>
      <p className="text-[9px] text-muted-foreground/60 mt-1">Simplified schematic map — distances are straight-line estimates, not road distances.</p>

      {/* Distance list */}
      <div className="mt-3 space-y-2">
        {routes.map(r => (
          <div key={r.district} className="flex items-center justify-between p-2.5 rounded-lg bg-red-500/5 border border-red-500/10">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin size={13} className="text-red-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold truncate">{r.district}</p>
                {mode === "network" && (
                  <p className="text-[10px] text-muted-foreground">{r.count} listing{r.count !== 1 ? "s" : ""}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-red-500 shrink-0">
              <Navigation size={11} />
              {formatDistance(r.km)} · ~{formatDuration(r.mins)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
