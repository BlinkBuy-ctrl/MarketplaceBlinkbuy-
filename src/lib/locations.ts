// Approximate boma/town-centre coordinates for Malawi's 28 districts.
// These are for VISUALIZATION / relative-distance purposes inside the app
// (showing roughly where a buyer and a seller are relative to each other,
// and a rough straight-line distance). They are not survey-grade GPS data.

export interface DistrictCoord {
  lat: number;
  lng: number;
}

export const DISTRICT_COORDS: Record<string, DistrictCoord> = {
  "Balaka":      { lat: -14.9831, lng: 34.9573 },
  "Blantyre":    { lat: -15.7861, lng: 35.0058 },
  "Chikwawa":    { lat: -16.0333, lng: 34.8000 },
  "Chiradzulu":  { lat: -15.7000, lng: 35.1500 },
  "Chitipa":     { lat: -9.7027,  lng: 33.2696 },
  "Dedza":       { lat: -14.3667, lng: 34.3333 },
  "Dowa":        { lat: -13.6500, lng: 33.9333 },
  "Karonga":     { lat: -9.9333,  lng: 33.9333 },
  "Kasungu":     { lat: -13.0333, lng: 33.4833 },
  "Likoma":      { lat: -12.0667, lng: 34.7333 },
  "Lilongwe":    { lat: -13.9626, lng: 33.7741 },
  "Machinga":    { lat: -15.1864, lng: 35.3225 },
  "Mangochi":    { lat: -14.4781, lng: 35.2645 },
  "Mchinji":     { lat: -13.8000, lng: 32.8833 },
  "Mulanje":     { lat: -16.0167, lng: 35.5167 },
  "Mwanza":      { lat: -15.6000, lng: 34.5167 },
  "Mzimba":      { lat: -11.9000, lng: 33.6033 },
  "Mzuzu":       { lat: -11.4581, lng: 34.0153 },
  "Neno":        { lat: -15.4000, lng: 34.6500 },
  "Nkhata Bay":  { lat: -11.6086, lng: 34.2967 },
  "Nkhotakota":  { lat: -12.9264, lng: 34.2967 },
  "Nsanje":      { lat: -16.9167, lng: 35.2667 },
  "Ntcheu":      { lat: -14.8167, lng: 34.6333 },
  "Ntchisi":     { lat: -13.3756, lng: 34.0019 },
  "Phalombe":    { lat: -15.8000, lng: 35.6500 },
  "Rumphi":      { lat: -11.0167, lng: 33.8500 },
  "Salima":      { lat: -13.7833, lng: 34.4500 },
  "Thyolo":      { lat: -16.0667, lng: 35.1333 },
  "Zomba":       { lat: -15.3833, lng: 35.3333 },
};

// Bounding box used to project lat/lng onto the SVG map canvas.
export const MALAWI_BOUNDS = {
  minLat: -17.2,
  maxLat: -9.3,
  minLng: 32.5,
  maxLng: 36.0,
};

/**
 * Pull the district name out of a free-text location string like
 * "Area 25, Lilongwe" or "Nyambadwe, Blantyre" by matching against
 * the known district list. Falls back to "Lilongwe" if nothing matches.
 */
export function resolveDistrict(locationText: string): string {
  if (!locationText) return "Lilongwe";
  const lower = locationText.toLowerCase();
  const match = Object.keys(DISTRICT_COORDS).find(d =>
    lower.includes(d.toLowerCase())
  );
  return match ?? "Lilongwe";
}

export function getCoords(districtOrText: string): DistrictCoord {
  const district = DISTRICT_COORDS[districtOrText]
    ? districtOrText
    : resolveDistrict(districtOrText);
  return DISTRICT_COORDS[district] ?? DISTRICT_COORDS["Lilongwe"];
}

/** Project a lat/lng pair onto an SVG canvas of the given width/height. */
export function project(
  coord: DistrictCoord,
  width: number,
  height: number,
  padding = 24
): { x: number; y: number } {
  const { minLat, maxLat, minLng, maxLng } = MALAWI_BOUNDS;
  const usableW = width - padding * 2;
  const usableH = height - padding * 2;
  const x = padding + ((coord.lng - minLng) / (maxLng - minLng)) * usableW;
  const y = padding + ((maxLat - coord.lat) / (maxLat - minLat)) * usableH;
  return { x, y };
}

/** Straight-line ("as the crow flies") distance in km between two coords. */
export function haversineKm(a: DistrictCoord, b: DistrictCoord): number {
  const R = 6371; // Earth radius in km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

/** Rough driving-time estimate, assuming ~50km/h average on Malawi's road network. */
export function estimateDrivingMinutes(km: number): number {
  return Math.round((km / 50) * 60);
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(km < 10 ? 1 : 0)} km`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/**
 * Resolve the best-known GPS coordinate for a seller:
 * 1. Explicit lat/lng captured when they posted the listing (most accurate).
 * 2. Otherwise fall back to the district centroid parsed from their location text.
 */
export function resolveSellerCoord(seller: {
  lat?: number | null;
  lng?: number | null;
  location?: string;
}, fallbackLocationText?: string): DistrictCoord {
  if (typeof seller.lat === "number" && typeof seller.lng === "number") {
    return { lat: seller.lat, lng: seller.lng };
  }
  return getCoords(seller.location || fallbackLocationText || "Lilongwe");
}

/** Build a "Navigate with Google Maps" deep link between two coordinates. */
export function googleMapsDirectionsUrl(
  origin: DistrictCoord,
  destination: DistrictCoord
): string {
  const o = `${origin.lat},${origin.lng}`;
  const d = `${destination.lat},${destination.lng}`;
  return `https://www.google.com/maps/dir/?api=1&origin=${o}&destination=${d}&travelmode=driving`;
}

