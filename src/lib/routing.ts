import type { DistrictCoord } from "@/lib/locations";

export interface RoadRoute {
  /** [lat, lng] points along the actual road path, for drawing a polyline. */
  coordinates: [number, number][];
  distanceKm: number;
  durationMin: number;
}

// Public demo OSRM server — free, no API key. Fine for low-traffic / demo use.
// For production scale, swap this URL for a self-hosted OSRM instance or
// another free routing provider (e.g. OpenRouteService with a free key).
const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving";

/**
 * Fetch a real road route between two points via OSRM.
 * Returns null on any failure so callers can fall back to a straight line.
 */
export async function fetchRoadRoute(
  origin: DistrictCoord,
  destination: DistrictCoord
): Promise<RoadRoute | null> {
  try {
    const url = `${OSRM_BASE}/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const route = data?.routes?.[0];
    if (!route) return null;
    const coordinates: [number, number][] = route.geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng]
    );
    return {
      coordinates,
      distanceKm: route.distance / 1000,
      durationMin: Math.round(route.duration / 60),
    };
  } catch {
    return null;
  }
}
