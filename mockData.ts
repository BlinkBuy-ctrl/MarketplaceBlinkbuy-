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

const IMG = (seed: string, w = 400, h = 400) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const MOCK_ITEMS: MarketplaceItem[] = [
  {
    id: "1",
    title: "Samsung Galaxy A53 — Excellent Condition",
    description: "Used for 6 months. No scratches, original charger and box included. Battery health 95%. Perfect for work and social media. Selling because I upgraded.",
    category: "Phones", price: 280000, location: "Lilongwe", condition: "Like New",
    images: [IMG("phone1"), IMG("phone1b")], is_featured: true,
    created_at: "2026-06-10T08:00:00Z",
    seller: { id: "s1", name: "Chisomo Banda", location: "Lilongwe", phone: "0999123456", whatsapp: "0999123456" },
  },
  {
    id: "2",
    title: "Leather Office Chair — Adjustable Height",
    description: "Comfortable leather office chair with lumbar support and adjustable armrests. Perfect for home office. Minor scuff on base. Barely used.",
    category: "Furniture", price: 95000, location: "Blantyre", condition: "Good",
    images: [IMG("chair1")], is_featured: true,
    created_at: "2026-06-09T10:30:00Z",
    seller: { id: "s2", name: "Takondwa Phiri", location: "Blantyre", phone: "0888654321", whatsapp: "0888654321" },
  },
  {
    id: "3",
    title: "LG 32\" Full HD Monitor",
    description: "LG 32FN650U monitor, 75Hz, full HD. Works perfectly. Selling as upgrading to ultrawide. Comes with original stand and HDMI cable.",
    category: "Electronics", price: 195000, location: "Lilongwe", condition: "Good",
    images: [IMG("monitor1"), IMG("monitor2")], is_featured: false,
    created_at: "2026-06-08T14:20:00Z",
    seller: { id: "s3", name: "Limbani Chirwa", location: "Lilongwe", phone: "0777345678", whatsapp: "0777345678" },
  },
  {
    id: "4",
    title: "100kg Maize — Farm Fresh",
    description: "High quality maize from Kasungu farm. Harvested this season, properly dried and cleaned. Available in 50kg or 100kg bags.",
    category: "Farm Produce", price: 45000, location: "Kasungu", condition: "New",
    images: [IMG("maize1")], is_featured: false,
    created_at: "2026-06-07T09:00:00Z",
    seller: { id: "s4", name: "Grace Nyondo", location: "Kasungu", phone: "0995567890", whatsapp: "0995567890" },
  },
  {
    id: "5",
    title: "Toyota Corolla 2008 — Low Mileage",
    description: "Toyota Corolla 2008 model. 120,000km on the clock. Full service history. New tyres, AC working perfectly. Very clean inside and out. One careful owner.",
    category: "Vehicles", price: 4800000, location: "Blantyre", condition: "Good",
    images: [IMG("car1"), IMG("car2")], is_featured: true,
    created_at: "2026-06-06T11:45:00Z",
    seller: { id: "s5", name: "Martin Gondwe", location: "Blantyre", phone: "0888901234", whatsapp: "0888901234" },
  },
  {
    id: "6",
    title: "School Uniform Set — Girls Size 10",
    description: "Complete secondary school uniform. Checked skirt, white blouse, navy sweater and tie. Worn one term only, child grew out of it. Very clean.",
    category: "Clothing", price: 18000, location: "Zomba", condition: "Like New",
    images: [IMG("uniform1")], is_featured: false,
    created_at: "2026-06-05T16:00:00Z",
    seller: { id: "s6", name: "Patricia Mwale", location: "Zomba", phone: "0999876543", whatsapp: "0999876543" },
  },
  {
    id: "7",
    title: "Electric Drill + 45-Piece Bits Set",
    description: "Bosch electric drill, 750W. Comes with a full bit set. Works perfectly. Used on two renovation projects. Perfect for home use.",
    category: "Tools", price: 65000, location: "Mzuzu", condition: "Good",
    images: [IMG("drill1")], is_featured: false,
    created_at: "2026-06-04T13:10:00Z",
    seller: { id: "s7", name: "Bright Kaunda", location: "Mzuzu", phone: "0777234567", whatsapp: "0777234567" },
  },
  {
    id: "8",
    title: "MSCE Past Papers Bundle — 2015–2024",
    description: "Complete set of MSCE past exam papers, all subjects, 2015 to 2024. Printed and bound. Great for exam preparation. Delivered anywhere in Lilongwe.",
    category: "Books", price: 12000, location: "Lilongwe", condition: "New",
    images: [IMG("books1")], is_featured: false,
    created_at: "2026-06-03T10:00:00Z",
    seller: { id: "s8", name: "Evelyn Msiska", location: "Lilongwe", phone: "0888765432", whatsapp: "0888765432" },
  },
  {
    id: "9",
    title: "Tecno Spark 10 Pro — Sealed Box",
    description: "Brand new sealed Tecno Spark 10 Pro. 128GB storage, 8GB RAM. Blue colour. Bought from shop, never opened. Original receipt available.",
    category: "Phones", price: 165000, location: "Mzuzu", condition: "New",
    images: [IMG("phone2")], is_featured: true,
    created_at: "2026-06-02T08:30:00Z",
    seller: { id: "s9", name: "Vincent Tembo", location: "Mzuzu", phone: "0999456789", whatsapp: "0999456789" },
  },
  {
    id: "10",
    title: "Gas Stove 2-Burner — Perfect Working Order",
    description: "2-burner gas cooker in excellent condition. Both burners work perfectly. Auto-ignition. Selling as kitchen is being renovated.",
    category: "Other", price: 55000, location: "Blantyre", condition: "Good",
    images: [IMG("stove1")], is_featured: false,
    created_at: "2026-06-01T15:00:00Z",
    seller: { id: "s10", name: "Agnes Dziko", location: "Blantyre", phone: "0888345678", whatsapp: "0888345678" },
  },
  {
    id: "11",
    title: "Fresh Tomatoes — 20kg Box",
    description: "Fresh tomatoes from Salima. Ready for delivery. Minimum order 20kg. Great for restaurants, vendors and households.",
    category: "Food", price: 28000, location: "Salima", condition: "New",
    images: [IMG("tomatoes1")], is_featured: false,
    created_at: "2026-05-30T07:00:00Z",
    seller: { id: "s11", name: "Joseph Mlenga", location: "Salima", phone: "0995678901", whatsapp: "0995678901" },
  },
  {
    id: "12",
    title: "HP Laptop 15\" — Core i5, 8GB RAM",
    description: "HP 15-dw3000 laptop. Intel Core i5 11th gen, 8GB RAM, 512GB SSD. Windows 11. Battery lasts 5 hours. Minor wear on chassis, screen perfect.",
    category: "Electronics", price: 520000, location: "Lilongwe", condition: "Good",
    images: [IMG("laptop1"), IMG("laptop2")], is_featured: true,
    created_at: "2026-05-29T12:00:00Z",
    seller: { id: "s12", name: "Kondwani Nkosi", location: "Lilongwe", phone: "0777901234", whatsapp: "0777901234" },
  },
  {
    id: "13",
    title: "Sofa Set 3+2+1 — Brown Leather",
    description: "Full sofa set. 3-seater, 2-seater and 1-seater. Brown faux leather. Good condition with minor wear. Moving house, need to sell quickly.",
    category: "Furniture", price: 320000, location: "Zomba", condition: "Fair",
    images: [IMG("sofa1")], is_featured: false,
    created_at: "2026-05-28T09:30:00Z",
    seller: { id: "s13", name: "Ruth Kayira", location: "Zomba", phone: "0888123456", whatsapp: "0888123456" },
  },
  {
    id: "14",
    title: "iPhone 13 — 128GB Black",
    description: "iPhone 13 128GB in black. Excellent condition. No Face ID issues. Battery at 88%. Comes with original box, cable and charger. Fully iCloud unlocked.",
    category: "Phones", price: 750000, location: "Lilongwe", condition: "Good",
    images: [IMG("iphone1"), IMG("iphone2")], is_featured: true,
    created_at: "2026-05-27T11:00:00Z",
    seller: { id: "s14", name: "David Ntara", location: "Lilongwe", phone: "0999234567", whatsapp: "0999234567" },
  },
  {
    id: "15",
    title: "50 Broiler Chickens — Ready for Market",
    description: "50 Cobb-500 broiler chickens, 6 weeks old, average 2.5kg. Vaccinated and healthy. Located at Mchinji farm. Bulk discount available.",
    category: "Farm Produce", price: null, location: "Mchinji", condition: "New",
    images: [IMG("chickens1")], is_featured: false,
    created_at: "2026-05-26T08:00:00Z",
    seller: { id: "s15", name: "Samuel Mhango", location: "Mchinji", phone: "0777567890", whatsapp: "0777567890" },
  },
  {
    id: "16",
    title: "Canon EOS 200D — Full Camera Kit",
    description: "Canon EOS 200D DSLR. 24MP. Comes with 18-55mm kit lens, 50mm f/1.8 prime, 2x batteries, bag, SD card. Used professionally for 2 years.",
    category: "Electronics", price: 680000, location: "Blantyre", condition: "Good",
    images: [IMG("camera1"), IMG("camera2")], is_featured: false,
    created_at: "2026-05-25T14:00:00Z",
    seller: { id: "s16", name: "Mercy Chigona", location: "Blantyre", phone: "0888890123", whatsapp: "0888890123" },
  },
  {
    id: "17",
    title: "Men's Nike Sneakers — Size 43",
    description: "Original Nike Air Max. Size 43. Worn twice only, like new. Black and white colourway. Comes with original box.",
    category: "Clothing", price: 85000, location: "Lilongwe", condition: "Like New",
    images: [IMG("shoes1")], is_featured: false,
    created_at: "2026-06-20T10:00:00Z",
    seller: { id: "s17", name: "Kelvin Phiri", location: "Lilongwe", phone: "0999345678", whatsapp: "0999345678" },
  },
  {
    id: "18",
    title: "Generator 5KVA — Honda",
    description: "Honda 5KVA generator. Very reliable. Starts first kick. Serviced every 3 months. Perfect for home backup power. Selling because I installed solar.",
    category: "Electronics", price: 1200000, location: "Blantyre", condition: "Good",
    images: [IMG("generator1")], is_featured: true,
    created_at: "2026-06-19T08:00:00Z",
    seller: { id: "s18", name: "Francis Kamwendo", location: "Blantyre", phone: "0888456789", whatsapp: "0888456789" },
  },
  {
    id: "19",
    title: "Fresh Honey — 5L Jerry Can",
    description: "Pure natural honey from Kasungu. No additives. Harvested this season. Great taste, very clear. Good for health. Delivery available.",
    category: "Food", price: 35000, location: "Kasungu", condition: "New",
    images: [IMG("honey1")], is_featured: false,
    created_at: "2026-06-18T07:30:00Z",
    seller: { id: "s19", name: "Alice Mkandawire", location: "Kasungu", phone: "0995789012", whatsapp: "0995789012" },
  },
  {
    id: "20",
    title: "Dining Table Set — 6 Chairs",
    description: "Solid wood dining table with 6 matching chairs. Dark mahogany finish. Very sturdy. Excellent condition. Moving out sale.",
    category: "Furniture", price: 450000, location: "Lilongwe", condition: "Good",
    images: [IMG("table1")], is_featured: false,
    created_at: "2026-06-17T11:00:00Z",
    seller: { id: "s20", name: "James Chirwa", location: "Lilongwe", phone: "0777678901", whatsapp: "0777678901" },
  },
];
