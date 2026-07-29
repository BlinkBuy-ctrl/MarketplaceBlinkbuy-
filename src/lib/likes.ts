// Listing "likes", stored locally in the browser for the same reason as
// src/lib/ratings.ts and src/lib/reports.ts — no backend yet, but the flow
// works end-to-end. Each device gets a stable id (shared with app ratings)
// so a device can only like a given listing once, and can unlike it.

import { getDeviceId } from "./appRating";

const KEY = "mhm_likes";

// Map of itemId -> array of device_ids that liked it.
type LikesMap = Record<string, string[]>;

function read(): LikesMap {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LikesMap) : {};
  } catch {
    return {};
  }
}

function write(map: LikesMap) {
  try {
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    // ignore (private browsing / storage disabled)
  }
}

/** Total number of likes for a listing. */
export function getLikeCount(itemId: string): number {
  const map = read();
  return (map[itemId] || []).length;
}

/** Whether this device has already liked the listing. */
export function hasLiked(itemId: string): boolean {
  const map = read();
  const device = getDeviceId();
  return (map[itemId] || []).includes(device);
}

/** Toggle this device's like on a listing. Returns the new state + count. */
export function toggleLike(itemId: string): { liked: boolean; count: number } {
  const map = read();
  const device = getDeviceId();
  const list = map[itemId] ? [...map[itemId]] : [];
  const idx = list.indexOf(device);

  if (idx >= 0) {
    list.splice(idx, 1);
  } else {
    list.push(device);
  }

  map[itemId] = list;
  write(map);
  return { liked: idx < 0, count: list.length };
}
