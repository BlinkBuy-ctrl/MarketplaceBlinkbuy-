// Seller star ratings, stored locally in the browser for the same reason
// as src/lib/reports.ts — no backend yet, but the flow works end-to-end.

export interface SellerRating {
  id: string;
  sellerId: string;
  sellerName: string;
  itemId: string;
  stars: number; // 1–5
  comment?: string;
  createdAt: string;
}

const KEY = "mhm_ratings";

function read(): SellerRating[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SellerRating[]) : [];
  } catch {
    return [];
  }
}

function write(ratings: SellerRating[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ratings));
  } catch {
    // ignore (private browsing / storage disabled)
  }
}

export function getRatings(sellerId?: string): SellerRating[] {
  const all = read();
  return sellerId ? all.filter(r => r.sellerId === sellerId) : all;
}

export function addRating(rating: Omit<SellerRating, "id" | "createdAt">): SellerRating {
  const full: SellerRating = {
    ...rating,
    id: `rt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  write([full, ...read()]);
  return full;
}

/** Average + count for a seller, falling back to sensible demo defaults if nobody has rated them yet. */
export function getSellerRatingSummary(
  sellerId: string,
  fallback: { avg: number; count: number } = { avg: 4.8, count: 0 }
): { avg: number; count: number } {
  const ratings = getRatings(sellerId);
  if (ratings.length === 0) return fallback;
  const avg = ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length;
  return { avg: Math.round(avg * 10) / 10, count: ratings.length };
}
