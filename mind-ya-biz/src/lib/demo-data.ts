/**
 * Mind Ya Biz — demo seed data for the public experience.
 * Realistic sample content so every page looks complete in demo mode.
 * Visuals are recreated with color + emoji (no external image assets).
 */

export type Social = { label: string; href: string };

export type Storefront = {
  slug: string;
  name: string;
  logo: string; // emoji mark
  category: string;
  categoryIcon: string;
  tagline: string;
  description: string;
  story: string;
  location: string;
  website: string;
  socials: Social[];
  accent: string; // brand token name: purple | pink | orange | teal | blue
  cover: [string, string]; // gradient stops (hex)
  productCount: number;
  rating: number;
  reviews: number;
  wearItForward: boolean;
  bonusEvent?: string;
  promo?: string;
  featured?: boolean;
  isNew?: boolean;
  popular?: boolean;
  events?: { title: string; date: string; place: string }[];
};

export type Product = {
  id: string;
  slug: string;
  store: string; // storefront slug
  name: string;
  type: ProductType;
  emoji: string;
  price: number;
  points: number;
  cover: [string, string];
  colors: { name: string; hex: string }[];
  sizes: string[];
  description: string;
  rating: number;
  reviews: number;
  featured?: boolean;
  favorite?: boolean;
  isNew?: boolean;
  wearItForward?: boolean;
};

export type ProductType =
  | "T-Shirt" | "Hoodie" | "Crewneck" | "Hat" | "Tote Bag"
  | "Mug" | "Tumbler" | "Sticker" | "Keychain" | "Apron";

export const CATEGORIES: { label: string; icon: string }[] = [
  { label: "Restaurants", icon: "🌮" },
  { label: "Salons & Pets", icon: "✂️" },
  { label: "Contractors", icon: "🔨" },
  { label: "Realtors", icon: "🏡" },
  { label: "Creators", icon: "🎨" },
  { label: "Events", icon: "🎉" },
  { label: "Nonprofits", icon: "💛" },
  { label: "Food Trucks", icon: "🚚" },
];

export const STOREFRONTS: Storefront[] = [
  {
    slug: "taco-alley",
    name: "Taco Alley",
    logo: "🌮",
    category: "Restaurants",
    categoryIcon: "🌮",
    tagline: "Street tacos & good times.",
    description: "Family-run taco spot slinging birria, al pastor, and horchata since 2019.",
    story:
      "Started as a single cart outside the hardware store, Taco Alley now runs two trucks and a corner kitchen. The merch keeps the crew's late-night regulars repping the block wherever they roll.",
    location: "Pilsen, Chicago IL",
    website: "tacoalley.example",
    socials: [
      { label: "Instagram", href: "#" },
      { label: "TikTok", href: "#" },
    ],
    accent: "orange",
    cover: ["#ff7a1a", "#ff2d87"],
    productCount: 7,
    rating: 4.9,
    reviews: 214,
    wearItForward: true,
    bonusEvent: "Double points weekend",
    promo: "Scan any Taco Alley shirt → free horchata.",
    featured: true,
    popular: true,
    events: [
      { title: "Taco Trail Kickoff", date: "Aug 9", place: "Pilsen" },
      { title: "Late Night Market", date: "Aug 16", place: "Randolph St" },
    ],
  },
  {
    slug: "k9-kitty-kutters",
    name: "K9 & Kitty Kutters",
    logo: "🐾",
    category: "Salons & Pets",
    categoryIcon: "✂️",
    tagline: "Fresh cuts for good bois & divas.",
    description: "Neighborhood grooming studio for dogs and cats. Spa days, nail trims, and zoomies included.",
    story:
      "Two sisters turned a love for animals into the friendliest grooming studio in town. Their merch line lets pet parents show off their fur babies — and every hoodie funds a shelter adoption day.",
    location: "Logan Square, Chicago IL",
    website: "k9kitty.example",
    socials: [{ label: "Instagram", href: "#" }, { label: "Facebook", href: "#" }],
    accent: "teal",
    cover: ["#10bfb2", "#2f6bff"],
    productCount: 6,
    rating: 4.8,
    reviews: 132,
    wearItForward: true,
    promo: "Tap a Kitty Kutters tote → book a spa day.",
    featured: true,
    popular: true,
  },
  {
    slug: "ironclad-contracting",
    name: "Ironclad Contracting",
    logo: "🔨",
    category: "Contractors",
    categoryIcon: "🔨",
    tagline: "Built right. Built to last.",
    description: "Full-service construction & remodeling crew. Decks, kitchens, additions — done clean.",
    story:
      "Ironclad kits out their whole crew in branded workwear that doubles as a walking billboard. Scan the hoodie on a job site and you land right on their quote request page.",
    location: "Cicero, IL",
    website: "ironcladbuilds.example",
    socials: [{ label: "Instagram", href: "#" }],
    accent: "yellow",
    cover: ["#ffd21e", "#1b1420"],
    productCount: 5,
    rating: 4.9,
    reviews: 61,
    wearItForward: true,
    promo: "Tap the crew hoodie → instant project quote.",
    isNew: true,
  },
  {
    slug: "marquez-realty",
    name: "Marquez Realty",
    logo: "🏡",
    category: "Realtors",
    categoryIcon: "🏡",
    tagline: "Keys to your next chapter.",
    description: "Boutique real estate team helping first-time buyers and growing families find home.",
    story:
      "Sofia Marquez hands every client a closing-day gift box of MYB merch. The digital business card on the back of each tee means referrals are always one tap away.",
    location: "Oak Park, IL",
    website: "marquezrealty.example",
    socials: [{ label: "LinkedIn", href: "#" }, { label: "Instagram", href: "#" }],
    accent: "blue",
    cover: ["#2f6bff", "#7b2ff7"],
    productCount: 4,
    rating: 5.0,
    reviews: 48,
    wearItForward: true,
    promo: "Tap the tote → Sofia's digital business card.",
    popular: true,
  },
  {
    slug: "riverside-night-market",
    name: "Riverside Night Market",
    logo: "🎉",
    category: "Events",
    categoryIcon: "🎉",
    tagline: "Where the city comes to play.",
    description: "Monthly night market with 60+ local vendors, food trucks, live music, and maker booths.",
    story:
      "The Night Market runs a city-wide scavenger hunt every season — scan vendor shirts to collect stamps and unlock prizes. Their event tees are basically a game controller you can wear.",
    location: "Riverwalk, Chicago IL",
    website: "riversidenights.example",
    socials: [{ label: "Instagram", href: "#" }, { label: "TikTok", href: "#" }],
    accent: "purple",
    cover: ["#7b2ff7", "#ff2d87"],
    productCount: 5,
    rating: 4.7,
    reviews: 309,
    wearItForward: true,
    bonusEvent: "Scavenger hunt live",
    promo: "Scan 5 vendor shirts → limited market pin.",
    featured: true,
    isNew: true,
  },
  {
    slug: "jaylen-makes",
    name: "Jaylen Makes",
    logo: "⚡",
    category: "Creators",
    categoryIcon: "🎨",
    tagline: "Art you can wear & share.",
    description: "Illustrator & content creator dropping limited runs of hand-drawn streetwear.",
    story:
      "Jaylen turns every drop into a moment — fans who tap the sleeve tag get early access to the next release and points toward exclusive originals. Community first, hype second.",
    location: "Bronzeville, Chicago IL",
    website: "jaylenmakes.example",
    socials: [{ label: "Instagram", href: "#" }, { label: "YouTube", href: "#" }, { label: "TikTok", href: "#" }],
    accent: "pink",
    cover: ["#ff2d87", "#7b2ff7"],
    productCount: 6,
    rating: 4.9,
    reviews: 187,
    wearItForward: true,
    promo: "Tap the sleeve tag → early access to the next drop.",
    popular: true,
  },
];

const P = (
  store: string,
  n: number,
  name: string,
  type: ProductType,
  emoji: string,
  price: number,
  points: number,
  cover: [string, string],
  description: string,
  extra: Partial<Product> = {},
): Product => ({
  id: `${store}-${n}`,
  slug: `${store}-${n}`,
  store,
  name,
  type,
  emoji,
  price,
  points,
  cover,
  colors: [
    { name: "Black", hex: "#141414" },
    { name: "Cream", hex: "#efe9db" },
    { name: "Teal", hex: "#10bfb2" },
    { name: "Pink", hex: "#ff2d87" },
  ],
  sizes: ["S", "M", "L", "XL", "2XL"],
  description,
  rating: 4.7 + ((n % 3) * 0.1),
  reviews: 12 + n * 7,
  ...extra,
});

export const PRODUCTS: Product[] = [
  // Taco Alley
  P("taco-alley", 1, "Birria Boss Tee", "T-Shirt", "🌮", 28, 280, ["#ff7a1a", "#ff2d87"], "Soft ringspun tee with the Taco Alley crest. Scan the sleeve for a free horchata on your next order.", { featured: true, favorite: true, wearItForward: true, isNew: true }),
  P("taco-alley", 2, "Al Pastor Hoodie", "Hoodie", "🌮", 52, 520, ["#ff2d87", "#7b2ff7"], "Heavyweight fleece hoodie for late-night taco runs. Kangaroo pocket, ribbed cuffs.", { featured: true, wearItForward: true }),
  P("taco-alley", 3, "Horchata Tumbler", "Tumbler", "🥤", 24, 240, ["#ffd21e", "#ff7a1a"], "20oz stainless tumbler that keeps horchata cold for hours.", { favorite: true }),
  P("taco-alley", 4, "Taco Trail Snapback", "Hat", "🧢", 26, 260, ["#1b1420", "#ff7a1a"], "Structured snapback with embroidered taco patch and NFC hat tag.", { wearItForward: true }),
  P("taco-alley", 5, "Salsa Squad Sticker Pack", "Sticker", "🌶️", 8, 80, ["#ff2d87", "#ffd21e"], "Set of 6 die-cut vinyl stickers. Slap 'em anywhere.", { isNew: true }),
  P("taco-alley", 6, "Cocina Apron", "Apron", "🔥", 34, 340, ["#ff7a1a", "#1b1420"], "Canvas apron with adjustable strap — built for the grill.", {}),
  P("taco-alley", 7, "Alley Cat Tote", "Tote Bag", "🛍️", 22, 220, ["#ff7a1a", "#10bfb2"], "Heavy canvas tote with the Taco Alley mascot. Tap the corner tag for the menu.", { wearItForward: true }),
  // K9 & Kitty Kutters
  P("k9-kitty-kutters", 1, "Good Boi Club Tee", "T-Shirt", "🐾", 26, 260, ["#10bfb2", "#2f6bff"], "For proud dog parents. Every tee funds a shelter adoption day.", { featured: true, favorite: true, wearItForward: true }),
  P("k9-kitty-kutters", 2, "Spa Day Crewneck", "Crewneck", "🛁", 46, 460, ["#2f6bff", "#7b2ff7"], "Cozy crewneck with the Kitty Kutters spa logo.", { featured: true }),
  P("k9-kitty-kutters", 3, "Zoomies Mug", "Mug", "☕", 18, 180, ["#10bfb2", "#ffd21e"], "15oz ceramic mug for morning zoomies.", { favorite: true }),
  P("k9-kitty-kutters", 4, "Fur Baby Tote", "Tote Bag", "🐾", 20, 200, ["#10bfb2", "#ff2d87"], "Canvas tote — tap the tag to book a grooming spa day.", { wearItForward: true, isNew: true }),
  P("k9-kitty-kutters", 5, "Diva Cat Keychain", "Keychain", "🐱", 12, 120, ["#ff2d87", "#7b2ff7"], "Enamel keychain with a scannable NFC tag.", { wearItForward: true }),
  P("k9-kitty-kutters", 6, "Groomer Apron", "Apron", "✂️", 32, 320, ["#2f6bff", "#10bfb2"], "Water-resistant grooming apron with tool pockets.", {}),
  // Ironclad Contracting
  P("ironclad-contracting", 1, "Crew Workhorse Hoodie", "Hoodie", "🔨", 54, 540, ["#ffd21e", "#1b1420"], "Rugged fleece hoodie for the crew. Tap the sleeve for an instant project quote.", { featured: true, wearItForward: true }),
  P("ironclad-contracting", 2, "Built Right Tee", "T-Shirt", "🏗️", 27, 270, ["#1b1420", "#ffd21e"], "Durable cotton tee with the Ironclad wordmark.", { favorite: true, featured: true }),
  P("ironclad-contracting", 3, "Job Site Tumbler", "Tumbler", "🥤", 25, 250, ["#ffd21e", "#ff7a1a"], "Rugged 30oz tumbler that survives the truck bed.", {}),
  P("ironclad-contracting", 4, "Hard Hat Sticker Set", "Sticker", "⚙️", 9, 90, ["#1b1420", "#ffd21e"], "Weatherproof stickers for hard hats and toolboxes.", { isNew: true }),
  P("ironclad-contracting", 5, "Foreman Cap", "Hat", "🧢", 24, 240, ["#1b1420", "#ff7a1a"], "Low-profile cap with embroidered logo and NFC quote tag.", { wearItForward: true }),
  // Marquez Realty
  P("marquez-realty", 1, "Home Team Tote", "Tote Bag", "🏡", 22, 220, ["#2f6bff", "#7b2ff7"], "Closing-day tote. Tap the corner for Sofia's digital business card.", { featured: true, wearItForward: true, favorite: true }),
  P("marquez-realty", 2, "New Keys Tee", "T-Shirt", "🔑", 26, 260, ["#7b2ff7", "#2f6bff"], "Celebrate the move with a clean 'New Keys' tee.", { featured: true }),
  P("marquez-realty", 3, "Open House Mug", "Mug", "☕", 18, 180, ["#2f6bff", "#10bfb2"], "Housewarming mug your clients will actually use.", {}),
  P("marquez-realty", 4, "Referral Keychain", "Keychain", "🔑", 12, 120, ["#7b2ff7", "#ff2d87"], "NFC keychain — one tap sends your listing.", { wearItForward: true, isNew: true }),
  // Riverside Night Market
  P("riverside-night-market", 1, "Night Market Event Tee", "T-Shirt", "🌙", 30, 300, ["#7b2ff7", "#ff2d87"], "Official event tee. Scan it during the scavenger hunt to collect stamps.", { featured: true, wearItForward: true, isNew: true, favorite: true }),
  P("riverside-night-market", 2, "Maker Market Hoodie", "Hoodie", "🎉", 50, 500, ["#ff2d87", "#7b2ff7"], "Cozy hoodie repping the city's favorite night market.", { featured: true }),
  P("riverside-night-market", 3, "Vendor Crawl Tote", "Tote Bag", "🛍️", 20, 200, ["#7b2ff7", "#10bfb2"], "Roomy tote for all your market finds. Tap for this month's map.", { wearItForward: true }),
  P("riverside-night-market", 4, "Limited Market Pin Sticker", "Sticker", "📌", 7, 70, ["#ff2d87", "#ffd21e"], "Collectible sticker set — new design every season.", {}),
  P("riverside-night-market", 5, "Late Night Tumbler", "Tumbler", "🥤", 24, 240, ["#7b2ff7", "#2f6bff"], "Insulated tumbler for all-night market runs.", {}),
  // Jaylen Makes
  P("jaylen-makes", 1, "Drop 01 Art Tee", "T-Shirt", "⚡", 34, 340, ["#ff2d87", "#7b2ff7"], "Hand-drawn limited run. Tap the sleeve tag for early access to the next drop.", { featured: true, wearItForward: true, isNew: true, favorite: true }),
  P("jaylen-makes", 2, "Signature Hoodie", "Hoodie", "🎨", 58, 580, ["#7b2ff7", "#2f6bff"], "Premium heavyweight hoodie with Jaylen's signature line work.", { featured: true }),
  P("jaylen-makes", 3, "Sketchbook Crewneck", "Crewneck", "✏️", 48, 480, ["#ff2d87", "#ffd21e"], "Cream crewneck printed with original sketch scribbles.", { favorite: true }),
  P("jaylen-makes", 4, "Lightning Keychain", "Keychain", "⚡", 12, 120, ["#7b2ff7", "#ff2d87"], "NFC keychain that links to the latest drop.", { wearItForward: true }),
  P("jaylen-makes", 5, "Studio Mug", "Mug", "☕", 18, 180, ["#ff2d87", "#7b2ff7"], "Ceramic mug for late studio nights.", {}),
  P("jaylen-makes", 6, "Sticker Bomb Pack", "Sticker", "💥", 10, 100, ["#7b2ff7", "#10bfb2"], "12 original die-cut stickers to bomb your gear.", { isNew: true }),
];

/* ---------- selectors ---------- */
export const getStorefront = (slug: string) => STOREFRONTS.find((s) => s.slug === slug);
export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
export const productsByStore = (slug: string) => PRODUCTS.filter((p) => p.store === slug);
export const featuredProducts = () => PRODUCTS.filter((p) => p.featured);

export const ACCENT_HEX: Record<string, string> = {
  purple: "#7b2ff7",
  pink: "#ff2d87",
  orange: "#ff7a1a",
  teal: "#10bfb2",
  blue: "#2f6bff",
  yellow: "#ffd21e",
};

/* platform stats for homepage social proof */
export const PLATFORM_STATS = [
  { label: "Local storefronts", value: "60+", icon: "🏪" },
  { label: "Points earned by members", value: "2.4M", icon: "⭐" },
  { label: "Scans & taps tracked", value: "48K", icon: "📲" },
  { label: "Communities repped", value: "12", icon: "🏙️" },
];

/* "What can a scan open?" cards */
export const SCAN_DESTINATIONS = [
  { icon: "🌐", label: "Business website" },
  { icon: "🏪", label: "Storefront" },
  { icon: "🏷️", label: "Discount offer" },
  { icon: "💳", label: "Digital business card" },
  { icon: "📇", label: "Contact info" },
  { icon: "📅", label: "Booking page" },
  { icon: "🎟️", label: "Event page" },
  { icon: "🍽️", label: "Menu" },
  { icon: "📱", label: "Social media" },
  { icon: "💛", label: "Fundraiser" },
  { icon: "🏆", label: "Contest" },
  { icon: "🗺️", label: "Scavenger hunt" },
];
