import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation, LocateFixed, Truck, ExternalLink } from "lucide-react";
import {
  DISTRICT_COORDS,
  getCoords,
  haversineKm,
  estimateDrivingMinutes,
  formatDistance,
  formatDuration,
  googleMapsDirectionsUrl,
  type DistrictCoord,
} from "@/lib/locations";
import { fetchRoadRoute } from "@/lib/routing";
import { CITIES } from "@/lib/mockData";

// Simple colored-dot markers (no external icon image files needed — avoids
// the classic "broken Leaflet marker" bundler issue).
function dotIcon(color: string, label?: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${color};
      width:${label ? 26 : 18}px;height:${label ? 26 : 18}px;
      border-radius:9999px;border:2px solid white;
      box-shadow:0 1px 4px rgba(0,0,0,.4);
      display:flex;align-items:center;justify-content:center;
      color:white;font:700 11px sans-serif;
    ">${label ?? ""}</div>`,
    iconSize: label ? [26, 26] : [18, 18],
    iconAnchor: label ? [13, 13] : [9, 9],
  });
}

/** Keeps the map's viewport fitted to whatever pins are currently shown. */
function FitBounds({ points }: { points: DistrictCoord[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 12);
      return;
    }
    const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [32, 32] });
  }, [JSON.stringify(points), map]);
  return null;
}

interface SellerPin {
  district: string;
  count: number;
  lat?: number;
  lng?: number;
}

interface SellerBuyerMapProps {
  mode: "route" | "network";
  /** Route mode: free-text seller location, used if no precise lat/lng given. */
  sellerLocation?: string;
  /** Route mode: precise GPS pin captured when the seller posted the listing. */
  sellerLat?: number;
  sellerLng?: number;
  /** Network mode: aggregated seller districts (+ optional precise coords). */
  sellers?: SellerPin[];
  defaultBuyerCity?: string;
  title?: string;
  compact?: boolean;
}

export default function SellerBuyerMap({
  mode,
  sellerLocation,
  sellerLat,
  sellerLng,
  sellers = [],
  defaultBuyerCity = "Lilongwe",
  title,
  compact = false,
}: SellerBuyerMapProps) {
  const [buyerCity, setBuyerCity] = useState(defaultBuyerCity);
  const [buyerPin, setBuyerPin] = useState<DistrictCoord | null>(null);
  const [locating, setLocating] = useState(false);
  const [roadRoutes, setRoadRoutes] = useState<Record<string, { coords: [number, number][]; km: number; mins: number }>>({});

  const buyerCoord: DistrictCoord = buyerPin ?? getCoords(buyerCity);

  const sellerPins: SellerPin[] = useMemo(() => {
    if (mode === "route") {
      const district = sellerLocation
        ? Object.keys(DISTRICT_COORDS).find(k => sellerLocation.toLowerCase().includes(k.toLowerCase())) ?? "Lilongwe"
        : "Lilongwe";
      return [{ district, count: 1, lat: sellerLat, lng: sellerLng }];
    }
    return sellers;
  }, [mode, sellerLocation, sellerLat, sellerLng, sellers]);

  const routes = useMemo(() => {
    return sellerPins
      .map(s => {
        const coord: DistrictCoord =
          typeof s.lat === "number" && typeof s.lng === "number"
            ? { lat: s.lat, lng: s.lng }
            : getCoords(s.district);
        const straightKm = haversineKm(buyerCoord, coord);
        return { ...s, coord, straightKm, straightMins: estimateDrivingMinutes(straightKm) };
      })
      .sort((a, b) => a.straightKm - b.straightKm);
  }, [sellerPins, buyerCoord]);

  // Fetch real road routes (OSRM, free, no key) for the closest few pins.
  // Falls back silently to the straight-line estimate if the request fails.
  useEffect(() => {
    let cancelled = false;
    const targets = routes.slice(0, mode === "route" ? 1 : 6);
    targets.forEach(async r => {
      const key = r.district + r.coord.lat + r.coord.lng;
      const road = await fetchRoadRoute(buyerCoord, r.coord);
      if (cancelled || !road) return;
      setRoadRoutes(prev => ({
        ...prev,
        [key]: { coords: road.coordinates, km: road.distanceKm, mins: road.durationMin },
      }));
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(routes.map(r => r.district)), buyerCoord.lat, buyerCoord.lng]);

  const blantyreCoord = getCoords("Blantyre");
  const lilongweCoord = getCoords("Lilongwe");

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setBuyerPin({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        let nearest = "Lilongwe", best = Infinity;
        for (const [name, coord] of Object.entries(DISTRICT_COORDS)) {
          const d = haversineKm({ lat: pos.coords.latitude, lng: pos.coords.longitude }, coord);
          if (d < best) { best = d; nearest = name; }
        }
        setBuyerCity(nearest);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  };

  const allPoints = [buyerCoord, ...routes.map(r => r.coord)];

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
        <label className="text-xs font-semibold text-muted-foreground shrink-0">Your location:</label>
        <select
          value={buyerCity}
          onChange={e => { setBuyerCity(e.target.value); setBuyerPin(null); }}
          className="flex-1 min-w-0 text-xs font-semibold bg-background border border-red-500/20 rounded-lg px-2 py-1.5"
        >
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
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

      {/* Real OpenStreetMap */}
      <div className={`relative w-full ${compact ? "h-[260px]" : "h-[400px]"} overflow-hidden rounded-xl`}>
        <MapContainer center={[buyerCoord.lat, buyerCoord.lng]} zoom={7} scrollWheelZoom={false} style={{ width: "100%", height: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds points={allPoints} />

          {/* Reference corridor: Blantyre <-> Lilongwe */}
          <Polyline
            positions={[[lilongweCoord.lat, lilongweCoord.lng], [blantyreCoord.lat, blantyreCoord.lng]]}
            pathOptions={{ color: "#f59e0b", weight: 2, dashArray: "4 6", opacity: 0.6 }}
          />

          {/* Routes: real road geometry where we have it, straight dashed line otherwise */}
          {routes.map(r => {
            const key = r.district + r.coord.lat + r.coord.lng;
            const road = roadRoutes[key];
            return road ? (
              <Polyline key={key} positions={road.coords} pathOptions={{ color: "#ef4444", weight: 3, opacity: 0.85 }} />
            ) : (
              <Polyline
                key={key}
                positions={[[buyerCoord.lat, buyerCoord.lng], [r.coord.lat, r.coord.lng]]}
                pathOptions={{ color: "#ef4444", weight: 2, dashArray: "5 5", opacity: 0.6 }}
              />
            );
          })}

          {/* Seller markers */}
          {routes.map(r => {
            const key = r.district + r.coord.lat + r.coord.lng;
            const road = roadRoutes[key];
            return (
              <Marker key={key} position={[r.coord.lat, r.coord.lng]} icon={dotIcon("#ef4444", r.count > 1 ? String(r.count) : undefined)}>
                <Popup>
                  <div className="text-xs font-semibold">{r.district}</div>
                  <div className="text-[11px] text-gray-500">
                    {road ? `${formatDistance(road.km)} by road · ~${formatDuration(road.mins)}` : `${formatDistance(r.straightKm)} (straight-line)`}
                  </div>
                  <a
                    href={googleMapsDirectionsUrl(buyerCoord, r.coord)}
                    target="_blank" rel="noopener noreferrer"
                    className="text-[11px] text-blue-600 font-semibold inline-flex items-center gap-1 mt-1"
                  >
                    Navigate with Google Maps <ExternalLink size={10} />
                  </a>
                </Popup>
              </Marker>
            );
          })}

          {/* Buyer marker */}
          <Marker position={[buyerCoord.lat, buyerCoord.lng]} icon={dotIcon("#3b82f6")}>
            <Popup>You (buyer)</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Buyer (you)</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Seller</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400/60 inline-block" /> M1 corridor</span>
      </div>
      <p className="text-[9px] text-muted-foreground/60 mt-1">Map data &copy; OpenStreetMap contributors. Road routes via OSRM.</p>

      {/* Distance list */}
      <div className="mt-3 space-y-2">
        {routes.map(r => {
          const key = r.district + r.coord.lat + r.coord.lng;
          const road = roadRoutes[key];
          return (
            <div key={key} className="flex items-center justify-between p-2.5 rounded-lg bg-red-500/5 border border-red-500/10">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin size={13} className="text-red-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-bold truncate">{r.district}</p>
                  {mode === "network" && (
                    <p className="text-[10px] text-muted-foreground">{r.count} listing{r.count !== 1 ? "s" : ""}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-red-500">
                  <Navigation size={11} />
                  {road ? `${formatDistance(road.km)} · ~${formatDuration(road.mins)}` : `~${formatDistance(r.straightKm)}`}
                </div>
                <a
                  href={googleMapsDirectionsUrl(buyerCoord, r.coord)}
                  target="_blank" rel="noopener noreferrer"
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  title="Open turn-by-turn navigation in Google Maps"
                >
                  Navigate <ExternalLink size={10} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
