// Real listings, backed by Supabase (public.listings + the listing-images
// storage bucket). Uses the same anonymous device_id trust model as
// app_ratings — no auth required, the poster's device_id identifies them.

import { supabase } from "./supabaseClient";
import { getDeviceId } from "./appRating";
import type { MarketplaceItem } from "./mockData";

const TABLE = "listings";
const BUCKET = "listing-images";

export interface ListingRow {
  id: string;
  device_id: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
  location: string;
  condition: string;
  images: string[];
  is_featured: boolean;
  status: "active" | "sold" | "removed";
  seller_name: string;
  seller_phone: string;
  seller_whatsapp: string | null;
  seller_location: string | null;
  seller_lat: number | null;
  seller_lng: number | null;
  created_at: string;
  updated_at: string;
}

export interface NewListingInput {
  title: string;
  description: string;
  category: string;
  price: number | null;
  location: string;
  condition: string;
  sellerName: string;
  sellerPhone: string;
  negotiable: boolean;
  lat: number | null;
  lng: number | null;
}

/** Map a DB row onto the MarketplaceItem shape the existing pages/components expect. */
function mapRowToItem(row: ListingRow): MarketplaceItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    price: row.price,
    location: row.location,
    condition: row.condition,
    images: row.images ?? [],
    is_featured: row.is_featured,
    created_at: row.created_at,
    status: row.status,
    seller: {
      id: row.device_id,
      name: row.seller_name,
      location: row.seller_location || row.location,
      phone: row.seller_phone,
      whatsapp: row.seller_whatsapp || row.seller_phone,
      lat: row.seller_lat ?? undefined,
      lng: row.seller_lng ?? undefined,
    },
  };
}

/** All active (non-removed, non-sold) listings, newest first. */
export async function fetchActiveListings(): Promise<MarketplaceItem[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as ListingRow[]).map(mapRowToItem);
}

/** A single listing by id, or null if missing/not active. */
export async function fetchListingById(id: string): Promise<MarketplaceItem | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return mapRowToItem(data as ListingRow);
}

/** Upload images to the listing-images bucket under a folder per listing, returning their public URLs. */
export async function uploadListingImages(files: File[], listingId: string): Promise<string[]> {
  if (!supabase || files.length === 0) return [];
  const urls: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${listingId}/${i}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

/**
 * ADMIN — every listing regardless of status (active/sold/removed), newest
 * first. Only meant to be used from the admin dashboard.
 */
export async function fetchAllListingsAdmin(): Promise<MarketplaceItem[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return (data as ListingRow[]).map(mapRowToItem);
}

/** ADMIN — set a listing's status (active / sold / removed). */
export async function setListingStatus(id: string, status: "active" | "sold" | "removed"): Promise<void> {
  if (!supabase) throw new Error("Listings are not configured yet.");
  const { error } = await supabase.from(TABLE).update({ status }).eq("id", id);
  if (error) throw error;
}

/** ADMIN — toggle whether a listing is featured. */
export async function setListingFeatured(id: string, is_featured: boolean): Promise<void> {
  if (!supabase) throw new Error("Listings are not configured yet.");
  const { error } = await supabase.from(TABLE).update({ is_featured }).eq("id", id);
  if (error) throw error;
}
/**
 * Create a new listing: uploads any photos to storage first (keyed under a
 * client-generated id), then inserts the row with the resulting image URLs.
 * Returns the new listing's id.
 */
export async function createListing(input: NewListingInput, files: File[]): Promise<string> {
  if (!supabase) throw new Error("Listings are not configured yet.");
  const device_id = getDeviceId();
  const id = crypto.randomUUID();

  const images = await uploadListingImages(files, id);

  const description = input.negotiable
    ? `${input.description}\n\n(Price negotiable)`
    : input.description;

  const { error } = await supabase.from(TABLE).insert({
    id,
    device_id,
    title: input.title,
    description,
    category: input.category,
    price: input.price,
    location: input.location,
    condition: input.condition,
    images,
    seller_name: input.sellerName,
    seller_phone: input.sellerPhone,
    seller_whatsapp: input.sellerPhone,
    seller_location: input.location,
    seller_lat: input.lat,
    seller_lng: input.lng,
  });

  if (error) throw error;
  return id;
}
