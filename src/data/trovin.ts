import eventRandolph from "@/assets/event-randolph.jpg";
import eventPilsen from "@/assets/event-pilsen.jpg";
import eventLogan from "@/assets/event-logan.jpg";
import eventFoodyard from "@/assets/event-foodyard.jpg";
import imgAntiques from "@/assets/vendor-antiques.jpg";
import imgFood from "@/assets/vendor-food.jpg";
import imgCraft from "@/assets/vendor-craft.jpg";
import imgVinyl from "@/assets/vendor-vinyl.jpg";
import imgFarm from "@/assets/vendor-farm.jpg";
import imgToys from "@/assets/vendor-toys.jpg";

export type Category =
  | "Antiques"
  | "Craft"
  | "Food"
  | "Collectibles"
  | "Farmers";
export type Payment = "Card" | "Cash" | "Venmo";

export type Vendor = {
  id: string;
  name: string;
  tagline: string;
  category: Category;
  event: string;
  booth: string;
  hours: string;
  payments: Payment[];
  followers: number;
  featured?: boolean;
  image: string;
  scribble?: string;
  tilt: number;
};

export type MarketEvent = {
  id: string;
  name: string;
  neighborhood: string;
  date: string;
  hours: string;
  vendorCount: number;
  followers: number;
  image: string;
  tags: string[];
  scribble?: string;
  tilt: number;
  // map coords as percentages within the SVG viewport
  x: number;
  y: number;
};

export const categories: { key: Category | "All"; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Antiques", label: "Antiques" },
  { key: "Craft", label: "Craft" },
  { key: "Food", label: "Food trucks" },
  { key: "Collectibles", label: "Collectibles" },
  { key: "Farmers", label: "Farmers" },
];

export const vendors: Vendor[] = [
  {
    id: "v1",
    name: "Maven & Moth",
    tagline: "Mid-century brass, glassware, oddities.",
    category: "Antiques",
    event: "Randolph Street Market",
    booth: "Booth 142",
    hours: "10a – 5p today",
    payments: ["Card", "Cash", "Venmo"],
    followers: 1284,
    featured: true,
    image: imgAntiques,
    scribble: "ooh, brass!",
    tilt: -1.5,
  },
  {
    id: "v2",
    name: "Smoke & Sown",
    tagline: "Wood-fired tacos, salsas, agua frescas.",
    category: "Food",
    event: "West Loop Food Yard",
    booth: "Truck #7",
    hours: "11a – 8p today",
    payments: ["Card", "Venmo"],
    followers: 3420,
    image: imgFood,
    scribble: "lunch sorted",
    tilt: 1.2,
  },
  {
    id: "v3",
    name: "Paper Crane Press",
    tagline: "Leather journals, hand-thrown mugs, brass tools.",
    category: "Craft",
    event: "Pilsen Maker Market",
    booth: "Aisle B • 14",
    hours: "9a – 4p today",
    payments: ["Card", "Cash"],
    followers: 612,
    image: imgCraft,
    scribble: "so good",
    tilt: -0.8,
  },
  {
    id: "v4",
    name: "Diamond Cuts Vinyl",
    tagline: "Soul, jazz, and rare 45s from 1962–84.",
    category: "Collectibles",
    event: "Randolph Street Market",
    booth: "Booth 071",
    hours: "10a – 5p today",
    payments: ["Cash", "Venmo"],
    followers: 945,
    image: imgVinyl,
    scribble: "dig dig dig",
    tilt: 1.6,
  },
  {
    id: "v5",
    name: "Greenline Farm",
    tagline: "Heirloom tomatoes, honey, sourdough.",
    category: "Farmers",
    event: "Logan Square Farmers Market",
    booth: "Stall 22",
    hours: "8a – 1p today",
    payments: ["Card", "Cash"],
    followers: 2110,
    image: imgFarm,
    tilt: -1.1,
  },
  {
    id: "v6",
    name: "Tin Roof Toys",
    tagline: "Vintage Star Wars, tin robots, lunchboxes.",
    category: "Collectibles",
    event: "Kane County Flea",
    booth: "Row 4 • 18",
    hours: "7a – 4p Sun",
    payments: ["Cash"],
    followers: 530,
    image: imgToys,
    scribble: "robots!!",
    tilt: 0.9,
  },
];

export const events: MarketEvent[] = [
  {
    id: "e1",
    name: "Randolph Street Market",
    neighborhood: "West Loop, Chicago",
    date: "Today • Sat May 30",
    hours: "10a – 5p",
    vendorCount: 218,
    followers: 12400,
    image: eventRandolph,
    tags: ["Antiques", "Vintage", "Collectibles"],
    scribble: "happening now",
    tilt: -1.2,
    x: 38,
    y: 46,
  },
  {
    id: "e2",
    name: "Pilsen Maker Market",
    neighborhood: "Pilsen, Chicago",
    date: "Sat May 30",
    hours: "9a – 4p",
    vendorCount: 64,
    followers: 3800,
    image: eventPilsen,
    tags: ["Craft", "Handmade", "Art"],
    scribble: "makers only",
    tilt: 0.8,
    x: 30,
    y: 70,
  },
  {
    id: "e3",
    name: "Logan Square Farmers Market",
    neighborhood: "Logan Square, Chicago",
    date: "Sun May 31",
    hours: "8a – 1p",
    vendorCount: 92,
    followers: 5600,
    image: eventLogan,
    tags: ["Farmers", "Bakery", "Flowers"],
    scribble: "early birds",
    tilt: -0.6,
    x: 58,
    y: 22,
  },
  {
    id: "e4",
    name: "West Loop Food Yard",
    neighborhood: "West Loop, Chicago",
    date: "Fri – Sun",
    hours: "11a – 10p",
    vendorCount: 32,
    followers: 7900,
    image: eventFoodyard,
    tags: ["Food trucks", "Drinks"],
    scribble: "yum",
    tilt: 1.4,
    x: 44,
    y: 58,
  },
];

export const paymentLabel: Record<Payment, string> = {
  Card: "Card",
  Cash: "Cash",
  Venmo: "Venmo",
};
