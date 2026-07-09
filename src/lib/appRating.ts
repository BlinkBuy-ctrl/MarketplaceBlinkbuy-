// App-wide "Rate the App" feature, backed by Supabase.
// Each device gets a stable, anonymous device_id stored in localStorage.
// Re-rating from the same device updates the existing row instead of
// creating a duplicate (upsert on device_id).

import { supabase } from "./supabaseClient";

const DEVICE_ID_KEY = "otechy_device_id";
const TABLE = "app_ratings";

export function getDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = `dev_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    // Private browsing / storage disabled — fall back to a session-only id.
    return `dev_session_${Math.random().toString(36).slice(2, 10)}`;
  }
}

export interface RatingSummary {
  average: number;
  count: number;
}

/** Submit or update this device's star rating (1–5) for the app. */
export async function submitAppRating(stars: number): Promise<void> {
  const device_id = getDeviceId();
  const { error } = await supabase
    .from(TABLE)
    .upsert({ device_id, stars }, { onConflict: "device_id" });
  if (error) throw error;
}

/** This device's previously submitted rating, if any. */
export async function getMyAppRating(): Promise<number | null> {
  const device_id = getDeviceId();
  const { data, error } = await supabase
    .from(TABLE)
    .select("stars")
    .eq("device_id", device_id)
    .maybeSingle();
  if (error || !data) return null;
  return data.stars as number;
}

/** Average rating + total number of ratings across all devices. */
export async function getAppRatingSummary(): Promise<RatingSummary> {
  const { data, error } = await supabase.from(TABLE).select("stars");
  if (error || !data || data.length === 0) return { average: 0, count: 0 };
  const sum = data.reduce((acc, r) => acc + (r.stars as number), 0);
  return { average: Math.round((sum / data.length) * 10) / 10, count: data.length };
}
