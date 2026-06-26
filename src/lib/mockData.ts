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
    whatsapp: string;
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

export const MOCK_ITEMS: MarketplaceItem[] = [];
