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
    /** GPS coordinates captured when the seller posted the listing (optional — falls back to district centroid if absent). */
    lat?: number;
    lng?: number;
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

export const BRANDS = [
  "Samsung","Apple","Tecno","Infinix","Itel","Huawei","Toyota","Nissan",
  "Honda","Sony","LG","Dell","HP","Lenovo","Nike","Adidas","Bata",
];

export const TRENDING_SEARCHES = [
  "iPhone 13", "Toyota Vitz", "Sofa set", "Maize bags", "Smart TV",
  "Laptop", "Land for sale", "Plot in Lilongwe", "Generator", "Solar panel",
];


export const MOCK_ITEMS: MarketplaceItem[] = [
  {
    id: "1",
    title: "iPhone 13 Pro Max 256GB",
    description: "Clean, no scratches, comes with original box and charger. Battery health 91%.",
    category: "Phones",
    price: 850000,
    location: "Lilongwe",
    condition: "Like New",
    images: ["https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=600"],
    is_featured: true,
    created_at: "2026-06-25T10:00:00Z",
    seller: { id: "s1", name: "Chisomo Banda", location: "Area 25, Lilongwe", phone: "+265991234567", whatsapp: "+265991234567", lat: -13.974, lng: 33.789 },
  },
  {
    id: "2",
    title: "3-Seater Sofa Set",
    description: "Comfortable fabric sofa, barely used. Selling because we're relocating.",
    category: "Furniture",
    price: 320000,
    location: "Blantyre",
    condition: "Good",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"],
    is_featured: true,
    created_at: "2026-06-24T08:30:00Z",
    seller: { id: "s2", name: "Grace Phiri", location: "Nyambadwe, Blantyre", phone: "+265888112233", whatsapp: "+265888112233", lat: -15.795, lng: 35.02 },
  },
  {
    id: "3",
    title: "Toyota Vitz 2014",
    description: "Well maintained, new tyres, recently serviced. Petrol, automatic.",
    category: "Vehicles",
    price: 9500000,
    location: "Mzuzu",
    condition: "Good",
    images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600"],
    is_featured: true,
    created_at: "2026-06-23T14:00:00Z",
    seller: { id: "s3", name: "Daniel Mwale", location: "Mzuzu City Centre", phone: "+265995566778", whatsapp: "+265995566778", lat: -11.451, lng: 34.021 },
  },
  {
    id: "4",
    title: "Samsung 43\" Smart TV",
    description: "Full HD, comes with remote and wall mount bracket.",
    category: "Electronics",
    price: 280000,
    location: "Zomba",
    condition: "New",
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600"],
    is_featured: true,
    created_at: "2026-06-22T09:15:00Z",
    seller: { id: "s4", name: "Esther Kumwenda", location: "Zomba Town", phone: "+265992233445", whatsapp: "+265992233445", lat: -15.386, lng: 35.33 },
  },
  {
    id: "5",
    title: "Men's Leather Jacket (L)",
    description: "Genuine leather, barely worn, size Large.",
    category: "Clothing",
    price: 45000,
    location: "Lilongwe",
    condition: "Like New",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600"],
    is_featured: false,
    created_at: "2026-06-21T16:45:00Z",
    seller: { id: "s5", name: "Patrick Nyirenda", location: "Area 47, Lilongwe", phone: "+265998877665", whatsapp: "+265998877665", lat: -13.95, lng: 33.76 },
  },
  {
    id: "6",
    title: "Bag of Maize (50kg)",
    description: "Fresh harvest, dry and well-stored. Bulk discounts available.",
    category: "Farm Produce",
    price: 35000,
    location: "Kasungu",
    condition: "New",
    images: ["https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600"],
    is_featured: false,
    created_at: "2026-06-20T07:00:00Z",
    seller: { id: "s6", name: "Joseph Tembo", location: "Kasungu Boma", phone: "+265993344556", whatsapp: "+265993344556", lat: -13.03, lng: 33.48 },
  },
  {
    id: "7",
    title: "Cordless Drill Set",
    description: "18V drill with two batteries, charger, and carry case.",
    category: "Tools",
    price: 65000,
    location: "Blantyre",
    condition: "Good",
    images: ["https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=600"],
    is_featured: false,
    created_at: "2026-06-19T11:30:00Z",
    seller: { id: "s7", name: "Mphatso Chirwa", location: "Limbe, Blantyre", phone: "+265996655443", whatsapp: "+265996655443", lat: -15.8, lng: 35.05 },
  },
  {
    id: "8",
    title: "Study Desk with Chair",
    description: "Sturdy wooden desk, great for students. Pickup only.",
    category: "Furniture",
    price: null,
    location: "Mangochi",
    condition: "Fair",
    images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600"],
    is_featured: false,
    created_at: "2026-06-18T13:20:00Z",
    seller: { id: "s8", name: "Linda Gondwe", location: "Mangochi Town", phone: "+265994433221", whatsapp: "+265994433221", lat: -14.48, lng: 35.26 },
  },
];
