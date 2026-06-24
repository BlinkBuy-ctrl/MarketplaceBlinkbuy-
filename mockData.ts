export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
  location: string;
  condition: string;
  images: string[];
  is_featured: boolean;
  created_at: string;
  seller: {
    id: string;
    name: string;
    location: string;
    phone: string;
    email: string;
  };
}

export const CATEGORIES = [
  "All Categories","Electronics","Phones","Clothing","Food",
  "Furniture","Tools","Vehicles","Farm Produce","Books","Other",
];

export const CITIES = [
  "Balaka","Blantyre","Chikwawa","Chiradzulu","Chitipa","Dedza","Dowa",
  "Karonga","Kasungu","Likoma","Lilongwe","Machinga","Mangochi","Mchinji",
  "Mulanje","Mwanza","Mzimba","Mzuzu","Neno","Nkhata Bay","Nkhotakota",
  "Nsanje","Ntcheu","Ntchisi","Phalombe","Rumphi","Salima","Thyolo","Zomba",
];

export const CONDITIONS = ["New","Like New","Good","Fair","For Parts"];

// Initialize listings from localStorage or empty array
export function getListings(): MarketplaceItem[] {
  try {
    const stored = localStorage.getItem("marketplace_listings");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save listings to localStorage
export function saveListings(listings: MarketplaceItem[]): void {
  try {
    localStorage.setItem("marketplace_listings", JSON.stringify(listings));
  } catch (e) {
    console.error("Failed to save listings:", e);
  }
}

// Add a new listing
export function addListing(item: Omit<MarketplaceItem, "id" | "created_at">): MarketplaceItem {
  const newItem: MarketplaceItem = {
    ...item,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
  };
  const listings = getListings();
  listings.unshift(newItem);
  saveListings(listings);
  return newItem;
}

// Get a single listing by ID
export function getListingById(id: string): MarketplaceItem | undefined {
  return getListings().find(item => item.id === id);
}

// Delete a listing
export function deleteListing(id: string): void {
  const listings = getListings();
  const filtered = listings.filter(item => item.id !== id);
  saveListings(filtered);
}

// Get MOCK_ITEMS for backward compatibility (empty array, can be populated by users)
export const MOCK_ITEMS: MarketplaceItem[] = [];
