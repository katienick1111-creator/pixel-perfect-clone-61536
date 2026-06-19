// Booth Setup Masterclass content — chapters, layouts, gallery, downloads.
// Content is hand-written editorial copy derived from the Masterclass outline.

export type BoothLesson = {
  slug: string;
  title: string;
  readMinutes: number;
  body: string; // Markdown-ish; rendered as paragraphs split on \n\n.
};

export type BoothChapter = {
  slug: string;
  number: string;
  title: string;
  summary: string;
  lessons: BoothLesson[];
};

export const boothChapters: BoothChapter[] = [
  {
    slug: "booth-basics",
    number: "01",
    title: "Booth Basics",
    summary:
      "The non-negotiable gear list. Tents, weights, flooring, tables, chairs, storage, power, and lighting — what to buy, why, and what to skip.",
    lessons: [
      {
        slug: "choosing-the-right-tent",
        title: "Choosing the Right Tent",
        readMinutes: 4,
        body: "Your tent is your storefront. Treat it like a capital purchase, not a clearance grab. Look for a steel frame (not aluminum), reinforced peaks, a 500D+ polyester top (not 'pop-up' polyethylene), and seams that are double-stitched and seam-sealed.\n\nThe two brands to short-list: Trimline (the standard at every serious craft show) and EZ-Up Eclipse for a lower-priced entry. Skip anything sold at a big-box store — those tents are designed for a backyard birthday, not 30 events a year.\n\nBuy white. Colored tops cast a tint over your product photos and customers' faces, which is the fastest way to make handmade goods look 'cheap.'",
      },
      {
        slug: "tent-sizes-10x10-vs-10x20",
        title: "Tent Sizes: 10x10 vs 10x20",
        readMinutes: 3,
        body: "10x10 is the universal market footprint — every show sells it, every vehicle can carry it, and it forces you to merchandise tight (a good thing). Start here unless you sell large-format goods (furniture, plants, framed art).\n\n10x20 doubles your space and roughly triples your footprint cost: bigger booth fee, second tent (often two 10x10s side by side, not one giant tent), more weight, more setup time, and a vehicle that can haul it. Don't 'graduate' to a 10x20 until your average revenue per event exceeds 4× a 10x10 booth fee for three events in a row.\n\nCorner spots are worth a $20–$50 upcharge every time. Two open sides = roughly 1.6× the foot traffic of a midline.",
      },
      {
        slug: "canopy-recommendations",
        title: "Canopy Recommendations",
        readMinutes: 3,
        body: "Your top is the part that fails first. Wind chews vinyl, sun rots polyester, and rain finds every unsealed seam. A pro top will last 4–6 seasons of weekly use; a cheap top will fail mid-event in year one.\n\nGet sidewalls (at least three) on day one. They block sun, hide your storage, and let you close up overnight at multi-day shows. White or natural canvas matches the white roof — colored walls cast a tint inside.",
      },
      {
        slug: "tent-weights",
        title: "Tent Weights",
        readMinutes: 3,
        body: "Weights are the most-ignored, most-required piece of vendor gear. Most shows mandate 25–40 lbs per leg, minimum. Wind doesn't care about the rule — a 10x10 tent becomes a sail at 15 mph, and an unweighted tent will travel at 20.\n\nOptions, ranked: (1) PVC pipe filled with concrete (cheapest, ugliest, works), (2) sand-filled canvas weight bags (clean, portable, $25 each), (3) screw-in plate weights from a vendor supply company ($150+, lifetime). Strap weights to the leg AND to the truss above — strapping to the leg alone lets the tent lift.",
      },
      {
        slug: "flooring-options",
        title: "Flooring Options",
        readMinutes: 3,
        body: "Flooring isn't required, but it changes how long customers stay. Hard pavement makes browsers leave after 90 seconds; padded flooring keeps them in the booth for four to five minutes.\n\nThree options: interlocking foam tiles (cheap, easy, looks like a daycare), commercial outdoor rugs (mid-cost, more 'boutique'), or a Rola-Trac portable floor (expensive, but the gold standard for indoor shows with cable-management issues).",
      },
      {
        slug: "tables",
        title: "Table Sizes",
        readMinutes: 3,
        body: "Plastic 6-foot folding tables are the workhorse. Two of them in a 10x10 booth, set in an 'L' or open 'U,' is the most-used layout in market vending.\n\nUpgrade path: wooden farmhouse tables, vintage console tables, or live-edge slabs. Anything other than the bare plastic table immediately separates you from the booth next door. If you must use plastic, drape it floor-to-ground with linen or burlap — never table-cloth-with-a-clip.",
      },
      {
        slug: "chairs",
        title: "Chair Recommendations",
        readMinutes: 2,
        body: "One chair, behind a back corner, out of the customer's eye-line. Never two chairs in the front. A seated vendor with a chatting friend is the universal 'do not enter' signal — customers will walk past your booth and never look in.",
      },
      {
        slug: "storage-solutions",
        title: "Storage Solutions",
        readMinutes: 3,
        body: "Hide storage. Customers should never see a plastic tote, a cardboard box, or a personal cooler. Storage lives under a draped table, behind a curtain, or inside an under-counter cabinet.\n\nBuy stackable, color-matched bins. Clear bins with hand-written labels read 'organized vendor.' Mismatched random totes read 'flea market.'",
      },
      {
        slug: "trailer-organization",
        title: "Trailer Organization",
        readMinutes: 4,
        body: "If you're hauling more than a 10x10 setup, a cargo trailer pays for itself in two seasons (no more unpacking your car every Friday night). Build out shelving with French cleats, label every shelf, and pack the trailer in reverse-setup order: last thing in is the first thing out.\n\nA Bluetti-style power station charges in the trailer overnight, so you arrive event-day with a full battery for lights and a card reader.",
      },
      {
        slug: "vehicle-packing",
        title: "Vehicle Packing",
        readMinutes: 3,
        body: "Pack in reverse-setup order: tent on top, then weights, then tables, then product. The first item you grab should be the first item you set up.\n\nKeep a dedicated 'last 10 minutes' bin: cash float, card reader, business cards, hand sanitizer, lint roller, water. It lives in the passenger seat, not the back.",
      },
      {
        slug: "power-options",
        title: "Power Options",
        readMinutes: 3,
        body: "Most outdoor markets do not provide power. Plan to be 100% off-grid.\n\nGenerators: loud, smell like gas, banned at many shows. Skip unless you sell hot food.\n\nBattery power stations (Bluetti AC180, EcoFlow Delta 2, Jackery 1000): silent, recharge at home, run lights + card reader + small fridge for 8–10 hours. The single biggest gear upgrade most vendors make.",
      },
      {
        slug: "lighting-basics",
        title: "Lighting Basics",
        readMinutes: 3,
        body: "Even at outdoor daytime shows, a tent casts deep shade — your product looks dim, your customer's phone camera under-exposes, and your booth reads 'closed.'\n\nMinimum: two clip-on LED work lights on the back truss, aimed forward and down. Upgrade: warm-white (2700K–3000K) string lights along the front edge for evening shows. Never use cool-white daylight bulbs — they make food look gray and skin look sick.",
      },
    ],
  },
  {
    slug: "layout-library",
    number: "02",
    title: "Booth Layout Library",
    summary:
      "21 annotated booth layouts — every size, venue, and category. Each one shows product placement, customer flow, checkout, storage, signage, and impulse zones.",
    lessons: [
      {
        slug: "how-to-read-a-layout",
        title: "How to Read a Layout",
        readMinutes: 2,
        body: "Every layout in the library is annotated with eight zones: Product (the merch wall), Flow (the customer path arrow), Checkout (the register), Storage (hidden inventory), Signage (banner placement), Upsell (the 'before-the-register' bump), Waiting (where partners stand), and Impulse (under-$10 grab items at the register).\n\nUse the layouts as starting points, not gospel. Adjust based on whether your booth is a midline, a corner, or an end-cap.",
      },
    ],
  },
  {
    slug: "display-psychology",
    number: "03",
    title: "Display Psychology",
    summary:
      "Why customers stop, why they enter, why they buy. Eye-level, rule of three, hot zones, focal points, and storytelling displays.",
    lessons: [
      {
        slug: "eye-level-selling",
        title: "Eye Level Selling",
        readMinutes: 3,
        body: "Your highest-margin product goes at eye level — 54 to 66 inches off the ground for a standing customer. Everything above eye level is decorative; everything below knee level is functionally invisible.\n\nIf your hero product is currently sitting on a 30-inch table, you are merchandising it for children. Raise it on a riser, a pedestal, or a wall display.",
      },
      {
        slug: "rule-of-three",
        title: "The Rule of Three",
        readMinutes: 2,
        body: "Group product in odd numbers — three of a candle, three of a print, three of a mug. Odd-numbered groupings read as 'curated.' Even-numbered groupings read as 'inventory.'\n\nThree heights, three colors, three textures — same rule, applied across the whole booth.",
      },
      {
        slug: "hot-zones-cold-zones",
        title: "Hot Zones & Cold Zones",
        readMinutes: 3,
        body: "Your hot zone is the front two feet of your booth — what a customer sees from six feet away. Put your best-selling, most-photographed, most-recognizable product here.\n\nYour cold zone is the back wall and the corners. Use them for inventory depth, branded signage, and the 'wall of social proof' (press clippings, reviews, customer photos).",
      },
      {
        slug: "traffic-flow",
        title: "Traffic Flow",
        readMinutes: 3,
        body: "Customers move counter-clockwise in 80% of booths (the same direction they move in a grocery store). Set up your booth so the customer enters on the right, browses along the back wall, and exits past the register on the left.\n\nNever block the front edge with a long horizontal table — it reads as a wall, and shoppers will not step in.",
      },
      {
        slug: "focal-points-and-height",
        title: "Focal Points & Height",
        readMinutes: 3,
        body: "Every booth needs one (and only one) hero focal point — a hanging sign, an oversized art piece, a single product on a tall pedestal. Multiple focal points = no focal point.\n\nBuild three height tiers: 24 inches (table), 48 inches (riser/shelf), 72+ inches (banner/hanging piece). Flat displays read as 'flea market' even when the product is premium.",
      },
      {
        slug: "color-blocking",
        title: "Color Blocking",
        readMinutes: 3,
        body: "Group product by color, not by type. A wall of all-white candles, all-amber candles, and all-black candles reads as 'collection.' The same candles mixed by scent reads as 'pile.'\n\nThis is the single highest-ROI merchandising change most vendors can make in 10 minutes.",
      },
      {
        slug: "storytelling-displays",
        title: "Storytelling & Lifestyle Displays",
        readMinutes: 3,
        body: "Don't display product in isolation. Display it in context: the candle on a stack of vintage books next to a coffee cup, the print framed on a chair, the soap in a wooden bowl with a linen towel.\n\nLifestyle displays sell at 30–50% higher prices than bare-product displays because customers see the product 'in their home' before they buy it.",
      },
      {
        slug: "premium-displays",
        title: "Premium Displays",
        readMinutes: 3,
        body: "Pull your three highest-priced items out of the main display and put them on their own riser with their own sign ('The Studio Collection' or similar). Premium product needs premium real estate — and a clear visual line between it and the everyday line.\n\nA $48 candle next to a $14 candle on the same shelf looks overpriced. The same candle on its own pedestal, with negative space around it, looks aspirational.",
      },
    ],
  },
  {
    slug: "signage",
    number: "04",
    title: "Signage",
    summary:
      "Banners, price signs, menu boards, QR codes, and the directional cues that pull a customer from 30 feet away into your booth.",
    lessons: [
      {
        slug: "banner-placement",
        title: "Banner Placement",
        readMinutes: 3,
        body: "Hang one large banner across the back of the booth, top edge at 84+ inches, readable from 50 feet. This is your storefront sign — not the place for paragraphs.\n\nThree elements only: your business name (big), what you sell (one phrase, smaller), and your handle/website (small, bottom corner). Anything more and the eye won't process it.",
      },
      {
        slug: "price-signs",
        title: "Price Signs",
        readMinutes: 3,
        body: "Every single item gets a price. Customers who have to ask 'how much?' will walk away 70% of the time. They don't want to feel rude, and they don't want sticker shock in public.\n\nUse the same sign template for every product line (chalkboard, kraft tag, acrylic stand). Mixed sign styles read 'disorganized.' Consistent sign styles read 'brand.'",
      },
      {
        slug: "qr-code-signs",
        title: "QR Code Signs",
        readMinutes: 2,
        body: "One QR code per booth, framed, on the corner of the register table. Link it to your website, your Linktree, or your email signup. Add one line of text: 'Get 10% off your first order.'\n\nMore than one QR code in the booth = nobody scans any of them.",
      },
      {
        slug: "menu-boards",
        title: "Menu Boards",
        readMinutes: 3,
        body: "Food and coffee vendors live or die on the menu board. Hand-lettered chalkboards are charming for 8 items or fewer — past that, you need a printed/laminated board you can update with a sticker.\n\nList prices. Always list prices. A menu without prices triples your line wait time because every customer asks before ordering.",
      },
      {
        slug: "sale-signs",
        title: "Sale & Special Signs",
        readMinutes: 2,
        body: "Sale signs should be the only signs in your booth that use a contrasting color (terracotta, red, mustard — pick one). Reserve the contrast color for sales and limited drops. Use it everywhere and it stops meaning anything.",
      },
      {
        slug: "directional-and-cards",
        title: "Directional Signs & Business Cards",
        readMinutes: 2,
        body: "If your booth is hard to find, ask the event for permission to post a small directional sign at the entry. ('Find us in Booth 47 →')\n\nBusiness cards live in a small holder at the register. Don't fan them across the front table — they get rained on, wind-blown, and ignored.",
      },
    ],
  },
  {
    slug: "lighting",
    number: "05",
    title: "Lighting",
    summary:
      "Daytime, evening, warm vs cool, spotlights and accents — the lighting choices that turn a $20 product into a $40 product.",
    lessons: [
      {
        slug: "daytime-lighting",
        title: "Daytime Lighting",
        readMinutes: 2,
        body: "Even at noon, the inside of your tent is 4–6 stops darker than the sun outside. Customers' eyes adjust slowly; their cameras don't. Add light or your product photos (and Instagram tags) will look murky.",
      },
      {
        slug: "evening-lighting",
        title: "Evening Lighting",
        readMinutes: 3,
        body: "Evening markets are a different sport. You need (1) ambient light to fill the booth, (2) accent light on the hero product, and (3) front-edge string lights to mark your booth from a distance.\n\nWarm-white only (2700K). Run everything off a single 1000Wh battery station and it'll last the full evening.",
      },
      {
        slug: "warm-vs-cool",
        title: "Warm vs Cool Lights",
        readMinutes: 2,
        body: "Warm (2700K–3000K) for everything except surgical lighting. Cool/daylight (4000K+) makes wood look gray, makes baked goods look stale, makes candles look like wax, and makes skin look sick. There is no product that sells better under cool light.",
      },
      {
        slug: "spotlights-and-accent",
        title: "Spotlights & Accent Lighting",
        readMinutes: 3,
        body: "A single small spotlight on your hero product lifts perceived value more than any other display change. Use a battery-powered puck light, an LED picture light, or a clip-on track head — aimed at one product, from above, at a 45-degree angle.",
      },
      {
        slug: "battery-and-led",
        title: "Battery & LED Recommendations",
        readMinutes: 3,
        body: "USB-rechargeable puck lights (3-pack, ~$30) are the easiest entry. Step up to a Govee LED light bar or a Bluetti-powered Edison string for evening shows. Avoid anything that requires a wall plug — outdoor power is unreliable even when it's promised.",
      },
    ],
  },
  {
    slug: "merchandising",
    number: "06",
    title: "Merchandising",
    summary:
      "How product is grouped, stacked, and stocked. Cross-sells, upsells, bundle displays, seasonal swaps.",
    lessons: [
      {
        slug: "color-coordination",
        title: "Color Coordination",
        readMinutes: 2,
        body: "Group by color first, then by scent/style/size. Color is the eye's first sort; everything else is a second sort. A color-blocked display reads as a brand; a randomly-mixed display reads as a clearance table.",
      },
      {
        slug: "shelf-and-vertical",
        title: "Shelf & Vertical Displays",
        readMinutes: 3,
        body: "Build up, not out. A 4-foot table covered in product is overwhelming; the same product on three vertical shelves is shoppable. Use crates, vintage ladders, peg boards, or modular cube shelving.\n\nGoal: 60% of your inventory should be at eye level or above.",
      },
      {
        slug: "cross-sell-upsell",
        title: "Cross-Selling & Upselling",
        readMinutes: 3,
        body: "Cross-sell at the register: 'Want the matching wick trimmer for $6?' Upsell on the display: 'The 12oz size is only $4 more.'\n\nCross-sells add 10–18% to average order value. Almost no vendors do them.",
      },
      {
        slug: "bundles",
        title: "Bundle Displays",
        readMinutes: 2,
        body: "Build one obvious gift bundle and price it 10–15% below the loose total. Tie it with twine, tag it, and put it at the register. Bundles drive your highest-margin sales and clear slow-moving SKUs at the same time.",
      },
      {
        slug: "seasonal-holiday",
        title: "Seasonal & Holiday Displays",
        readMinutes: 3,
        body: "Swap your hero focal point every 6–8 weeks. Pumpkin in October, evergreen in December, dried wildflower in May. Customers who follow you on Instagram and see a 'static' booth photo for six months stop showing up.",
      },
    ],
  },
  {
    slug: "branding",
    number: "07",
    title: "Branding",
    summary:
      "Logo, color, font, packaging, uniforms, business cards, thank-you cards — the small consistencies that build a brand.",
    lessons: [
      {
        slug: "logo-placement",
        title: "Logo Placement",
        readMinutes: 2,
        body: "Your logo appears in three places, max: the back banner, the front table runner, and the packaging. More than three and it reads as desperate.",
      },
      {
        slug: "color-palette",
        title: "Color Palette",
        readMinutes: 3,
        body: "Pick three colors and use only those three across signage, packaging, table runners, and apparel. Two of them are neutrals (a paper-white and a deep ink), the third is your brand accent.\n\nThe Trovin Academy palette is a working example: paper, ink, and terracotta.",
      },
      {
        slug: "fonts",
        title: "Fonts",
        readMinutes: 2,
        body: "Two fonts, max. One display font for the logo and headlines, one body font for prices and labels. Mixing four fonts is the fastest way to look amateur.",
      },
      {
        slug: "uniforms",
        title: "Uniforms",
        readMinutes: 2,
        body: "You don't need a printed shirt — you need a consistent look. Same apron at every event, same color palette in your outfit. Customers should be able to spot 'you' in a five-vendor lineup.",
      },
      {
        slug: "packaging",
        title: "Packaging",
        readMinutes: 3,
        body: "The bag, the tissue, and the sticker do more brand-building than your business card. Branded bags walk around the market for the rest of the day and become billboards for your booth.\n\nMinimum: kraft bags + branded sticker + a folded thank-you card with a discount code for next time.",
      },
      {
        slug: "thank-you-cards",
        title: "Thank-You Cards",
        readMinutes: 2,
        body: "A handwritten thank-you card, slipped into the bag, with a unique code for 10% off the customer's next online order. Costs $0.05. Converts ~15% of first-time buyers into repeat buyers. Almost no vendor does this.",
      },
    ],
  },
  {
    slug: "customer-experience",
    number: "08",
    title: "Customer Experience",
    summary:
      "Greeting, conversation starters, closing the sale, managing lines, collecting emails, and turning a one-time buyer into a regular.",
    lessons: [
      {
        slug: "greeting",
        title: "Greeting Customers",
        readMinutes: 3,
        body: "Make eye contact, smile, and say one short line. Not 'Can I help you?' (closes the conversation) — instead, 'These are my new ones, just dropped this weekend.' (opens a conversation).\n\nNever sit, never scroll your phone, never finish a conversation with another vendor while a customer is in your booth.",
      },
      {
        slug: "conversation-starters",
        title: "Conversation Starters",
        readMinutes: 3,
        body: "Three you can use at any booth: (1) 'That one's my favorite — want to know why?' (2) 'It's all made in [city] — I'm 20 minutes away.' (3) 'That's the one that sold out last weekend — I just restocked.'\n\nThe goal is to give the customer permission to keep talking, without pressuring them to buy.",
      },
      {
        slug: "closing-sales",
        title: "Closing Sales",
        readMinutes: 3,
        body: "Don't ask 'Would you like one?' Ask 'Would you like the small or the large?' or 'Cash or card?' Assume the sale. The customer who reached for the product already wanted it — your job is to remove the last friction.",
      },
      {
        slug: "lines-and-crowds",
        title: "Handling Crowds & Lines",
        readMinutes: 3,
        body: "If a line forms, designate a second person to walk the line with samples or to ring up tap-to-pay sales on a second phone. A line that takes longer than 4 minutes will lose 30% of its customers.",
      },
      {
        slug: "checkout-flow",
        title: "Checkout Flow",
        readMinutes: 3,
        body: "Card reader on a dedicated stand, bag area to the side, packaging staged underneath. The customer should never wait while you hunt for a bag or fumble a card reader. Practice the full checkout — tap, bag, thank-you-card, hand-over — until it takes under 30 seconds.",
      },
      {
        slug: "collecting-emails",
        title: "Collecting Emails",
        readMinutes: 3,
        body: "An email list is the single most-valuable asset a vendor can build. Offer: '10% off your first online order — drop your email here.' Use a tablet with a 1-field form (email only, no name, no phone), or a paper signup pad with three lines.\n\nGoal: 8–15 new emails per event. After 10 events, that's a 100-person list — your first email blast pays for the next booth fee.",
      },
      {
        slug: "reviews-and-repeats",
        title: "Reviews & Repeat Customers",
        readMinutes: 3,
        body: "At checkout: 'If you love it, a Google review really helps small vendors like me — here's the QR.' That single ask, said by every vendor, doubles review velocity.\n\nFor repeat customers: remember their first name. Write it on the back of the thank-you card. Recognition is the cheapest loyalty program ever invented.",
      },
    ],
  },
  {
    slug: "mistakes",
    number: "09",
    title: "Common Mistakes",
    summary:
      "The 10 booth mistakes that cost vendors the most money — and the fast fixes for each.",
    lessons: [
      {
        slug: "poor-layout",
        title: "Mistake: Poor Layout",
        readMinutes: 2,
        body: "A long horizontal table across the front of the booth = a wall. Customers won't step over it. Open the front with an L-shape or U-shape and watch your foot traffic double.",
      },
      {
        slug: "too-much-inventory",
        title: "Mistake: Too Much Inventory",
        readMinutes: 2,
        body: "An overstuffed booth reads as a clearance pile. Bring 30% less product than you think you need, merchandise it twice as well, and restock from hidden storage as items sell.",
      },
      {
        slug: "weak-signage",
        title: "Mistake: Weak Signage",
        readMinutes: 2,
        body: "If a customer 30 feet away can't tell what you sell, you don't have a sign. You have decoration. Fix: a banner with one phrase ('Hand-poured candles') readable at a glance.",
      },
      {
        slug: "no-pricing",
        title: "Mistake: No Pricing",
        readMinutes: 2,
        body: "Every. Item. Gets. A. Price. Customers who have to ask will leave 7 times out of 10.",
      },
      {
        slug: "clutter-and-phone",
        title: "Mistake: Clutter & Phone Usage",
        readMinutes: 2,
        body: "Personal water bottles, coffee cups, packing peanuts, and your phone — invisible to you, blaring to the customer. Keep a 'pocket box' under the table for personal items and pick up your phone only when nobody is in the booth.",
      },
      {
        slug: "bad-checkout",
        title: "Mistake: Bad Checkout",
        readMinutes: 2,
        body: "A slow checkout kills the experience and clogs the front of your booth. Practice your full transaction (ring → bag → thank-you) until it's reliable in under 30 seconds.",
      },
    ],
  },
];

// ---------- Layout Library ----------

export type LayoutZone = {
  kind:
    | "product"
    | "flow"
    | "checkout"
    | "storage"
    | "signage"
    | "upsell"
    | "waiting"
    | "impulse";
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  note?: string;
};

export type BoothLayout = {
  slug: string;
  title: string;
  size: "10x10" | "10x20" | "Corner" | "Island" | "Indoor" | "Outdoor" | "Mobile";
  category:
    | "general"
    | "farmers-market"
    | "craft"
    | "boutique"
    | "food"
    | "coffee"
    | "bakery"
    | "jewelry"
    | "candle"
    | "clothing"
    | "pet"
    | "kids"
    | "home-decor"
    | "plants"
    | "mobile";
  summary: string;
  width: number; // canvas units (feet × 10)
  height: number;
  zones: LayoutZone[];
};

// Helper to define booth dimensions consistently. 1 ft = 10 units.
const ft = (n: number) => n * 10;

export const boothLayouts: BoothLayout[] = [
  {
    slug: "10x10-classic",
    title: "10x10 Classic U-Shape",
    size: "10x10",
    category: "general",
    summary:
      "The default 10x10. Open front, U-shape of tables, register in the back-right corner, storage hidden behind the back wall.",
    width: ft(10),
    height: ft(10),
    zones: [
      { kind: "signage", x: ft(1), y: 0, w: ft(8), h: ft(1), label: "Banner", note: "Hung at 84\"+." },
      { kind: "product", x: ft(0), y: ft(2), w: ft(2), h: ft(6), label: "Left Wall — bestsellers" },
      { kind: "product", x: ft(8), y: ft(2), w: ft(2), h: ft(6), label: "Right Wall — collection" },
      { kind: "product", x: ft(2), y: ft(7), w: ft(5), h: ft(2), label: "Back Hero Display", note: "Eye-level riser." },
      { kind: "storage", x: ft(7), y: ft(8.5), w: ft(2), h: ft(1.5), label: "Hidden storage" },
      { kind: "checkout", x: ft(7), y: ft(7), w: ft(2), h: ft(1.5), label: "Register" },
      { kind: "impulse", x: ft(6), y: ft(6), w: ft(1), h: ft(1), label: "Impulse (<$10)" },
      { kind: "upsell", x: ft(5.5), y: ft(7), w: ft(1.5), h: ft(1), label: "Add-on bundle" },
      { kind: "flow", x: ft(4.5), y: ft(0.5), w: ft(1), h: ft(8.5), label: "Customer flow ↺" },
    ],
  },
  {
    slug: "10x20-double",
    title: "10x20 Double Wide",
    size: "10x20",
    category: "general",
    summary:
      "Two 10x10 tents side by side. Twin entries, one central focal display, register midway, storage at the far back of each half.",
    width: ft(20),
    height: ft(10),
    zones: [
      { kind: "signage", x: ft(2), y: 0, w: ft(16), h: ft(1), label: "Banner (full-width)" },
      { kind: "product", x: ft(0), y: ft(2), w: ft(2), h: ft(7), label: "Left wall" },
      { kind: "product", x: ft(18), y: ft(2), w: ft(2), h: ft(7), label: "Right wall" },
      { kind: "product", x: ft(8), y: ft(4), w: ft(4), h: ft(3), label: "Central hero island" },
      { kind: "product", x: ft(2), y: ft(7), w: ft(5), h: ft(2), label: "Left back table" },
      { kind: "product", x: ft(13), y: ft(7), w: ft(5), h: ft(2), label: "Right back table" },
      { kind: "checkout", x: ft(9), y: ft(8), w: ft(2), h: ft(1.5), label: "Register" },
      { kind: "storage", x: ft(0.5), y: ft(8.5), w: ft(1.5), h: ft(1.5), label: "Storage L" },
      { kind: "storage", x: ft(18), y: ft(8.5), w: ft(1.5), h: ft(1.5), label: "Storage R" },
      { kind: "impulse", x: ft(7), y: ft(8), w: ft(2), h: ft(1), label: "Impulse" },
      { kind: "flow", x: ft(3), y: ft(1), w: ft(14), h: ft(1), label: "Two-door flow ↔" },
    ],
  },
  {
    slug: "corner-booth",
    title: "Corner Booth",
    size: "Corner",
    category: "general",
    summary:
      "Two open sides. Wrap the L of tables around the inside corner; put the hero focal at the diagonal corner — the spot most-seen from the aisle.",
    width: ft(10),
    height: ft(10),
    zones: [
      { kind: "signage", x: 0, y: 0, w: ft(10), h: ft(1), label: "Corner banner (L-wrap)" },
      { kind: "product", x: ft(7), y: ft(2), w: ft(3), h: ft(7), label: "Hero diagonal display" },
      { kind: "product", x: ft(0), y: ft(7), w: ft(6), h: ft(2), label: "Back table" },
      { kind: "product", x: ft(0), y: ft(2), w: ft(2), h: ft(5), label: "Side wall" },
      { kind: "checkout", x: ft(4.5), y: ft(8), w: ft(2), h: ft(1.5), label: "Register" },
      { kind: "storage", x: ft(0), y: ft(8.5), w: ft(2), h: ft(1.5), label: "Hidden storage" },
      { kind: "impulse", x: ft(3), y: ft(8), w: ft(1.5), h: ft(1), label: "Impulse" },
      { kind: "flow", x: ft(2), y: ft(2), w: ft(5), h: ft(1), label: "Two-side entry ↺" },
    ],
  },
  {
    slug: "island-booth",
    title: "Island Booth",
    size: "Island",
    category: "general",
    summary:
      "All four sides open. Build a 360° central display; ring with shoppable product; place register on the back side facing the lowest-traffic aisle.",
    width: ft(10),
    height: ft(10),
    zones: [
      { kind: "product", x: ft(3), y: ft(3), w: ft(4), h: ft(4), label: "360° Hero tower" },
      { kind: "product", x: ft(0), y: ft(1), w: ft(10), h: ft(2), label: "Front display ring" },
      { kind: "product", x: ft(0), y: ft(7), w: ft(10), h: ft(2), label: "Back display ring" },
      { kind: "checkout", x: ft(4), y: ft(9), w: ft(2), h: ft(1), label: "Register (back-facing)" },
      { kind: "storage", x: ft(0), y: ft(9), w: ft(2), h: ft(1), label: "Storage" },
      { kind: "flow", x: ft(0.5), y: ft(0.5), w: ft(9), h: ft(0.5), label: "All-sides flow ⟳" },
    ],
  },
  {
    slug: "indoor-booth",
    title: "Indoor Booth",
    size: "Indoor",
    category: "general",
    summary:
      "No tent — pipe-and-drape back wall. Maximize the wall for vertical merchandising; use power if available for spotlights.",
    width: ft(10),
    height: ft(10),
    zones: [
      { kind: "signage", x: ft(1), y: ft(0), w: ft(8), h: ft(1), label: "Wall banner" },
      { kind: "product", x: ft(0), y: ft(1), w: ft(10), h: ft(2), label: "Back wall (vertical merch)" },
      { kind: "product", x: ft(1), y: ft(6), w: ft(8), h: ft(2), label: "Front table line" },
      { kind: "product", x: ft(2), y: ft(3.5), w: ft(6), h: ft(2), label: "Mid riser" },
      { kind: "checkout", x: ft(7), y: ft(8), w: ft(2), h: ft(1.5), label: "Register" },
      { kind: "storage", x: ft(0), y: ft(8), w: ft(2), h: ft(2), label: "Under-drape storage" },
      { kind: "impulse", x: ft(5.5), y: ft(8), w: ft(1.5), h: ft(1), label: "Impulse" },
      { kind: "flow", x: ft(3), y: ft(8), w: ft(2), h: ft(1), label: "Center entry" },
    ],
  },
  {
    slug: "outdoor-booth",
    title: "Outdoor Booth",
    size: "Outdoor",
    category: "general",
    summary:
      "10x10 tent, weighted four corners, sidewalls on three sides for sun control. Open front, U-shape product, hidden storage behind drape.",
    width: ft(10),
    height: ft(10),
    zones: [
      { kind: "signage", x: ft(1), y: 0, w: ft(8), h: ft(1), label: "Front-edge banner" },
      { kind: "product", x: ft(0), y: ft(2), w: ft(2), h: ft(6), label: "Left side under wall" },
      { kind: "product", x: ft(8), y: ft(2), w: ft(2), h: ft(6), label: "Right side under wall" },
      { kind: "product", x: ft(2), y: ft(7), w: ft(6), h: ft(2), label: "Back hero shelf" },
      { kind: "storage", x: ft(0), y: ft(8.5), w: ft(2), h: ft(1.5), label: "Behind drape" },
      { kind: "checkout", x: ft(7.5), y: ft(8), w: ft(2), h: ft(1.5), label: "Register + battery" },
      { kind: "impulse", x: ft(6), y: ft(8), w: ft(1.5), h: ft(1), label: "Impulse" },
      { kind: "flow", x: ft(4), y: ft(1), w: ft(2), h: ft(8), label: "Flow ↺" },
    ],
  },
  {
    slug: "farmers-market",
    title: "Farmers Market Booth",
    size: "10x10",
    category: "farmers-market",
    summary:
      "Crates of produce stacked at an angle for visual abundance. Scale and bags at the register. Sample tray at the front edge as a magnet.",
    width: ft(10),
    height: ft(10),
    zones: [
      { kind: "signage", x: ft(1), y: 0, w: ft(8), h: ft(1), label: "Farm name + 'this week'" },
      { kind: "product", x: ft(0), y: ft(2), w: ft(10), h: ft(3), label: "Crate wall (angled)" },
      { kind: "product", x: ft(0), y: ft(5.5), w: ft(7), h: ft(2.5), label: "Front-table produce" },
      { kind: "impulse", x: ft(0), y: ft(5), w: ft(2), h: ft(1), label: "Sample tray (front edge)", note: "Magnet to pull traffic in." },
      { kind: "checkout", x: ft(7.5), y: ft(6), w: ft(2.5), h: ft(2), label: "Scale + register" },
      { kind: "storage", x: ft(7.5), y: ft(8.5), w: ft(2.5), h: ft(1.5), label: "Cooler + bags" },
      { kind: "flow", x: ft(3), y: ft(1), w: ft(4), h: ft(1), label: "Step-in flow" },
    ],
  },
  {
    slug: "craft-booth",
    title: "Craft Booth",
    size: "10x10",
    category: "craft",
    summary:
      "Wall of finished pieces in the back, work-in-progress demo at the side, hero piece on a pedestal in the front-right corner.",
    width: ft(10),
    height: ft(10),
    zones: [
      { kind: "signage", x: ft(1), y: 0, w: ft(8), h: ft(1), label: "Maker name" },
      { kind: "product", x: ft(0.5), y: ft(2), w: ft(9), h: ft(2.5), label: "Back wall — finished pieces" },
      { kind: "product", x: ft(8), y: ft(5), w: ft(2), h: ft(3), label: "Hero pedestal (front-right)" },
      { kind: "product", x: ft(0), y: ft(5), w: ft(2), h: ft(4), label: "WIP demo bench" },
      { kind: "checkout", x: ft(5), y: ft(8), w: ft(2), h: ft(1.5), label: "Register" },
      { kind: "storage", x: ft(7), y: ft(8.5), w: ft(2), h: ft(1.5), label: "Storage" },
      { kind: "impulse", x: ft(3), y: ft(8), w: ft(2), h: ft(1), label: "Print/sticker grab box" },
      { kind: "flow", x: ft(3), y: ft(1.5), w: ft(4), h: ft(1), label: "Center flow ↺" },
    ],
  },
  {
    slug: "boutique-booth",
    title: "Boutique Booth",
    size: "10x10",
    category: "boutique",
    summary:
      "Garment rack along the back wall, mannequin focal in the front-left, jewelry case at the register, fitting curtain on the side.",
    width: ft(10),
    height: ft(10),
    zones: [
      { kind: "signage", x: ft(1), y: 0, w: ft(8), h: ft(1), label: "Boutique name" },
      { kind: "product", x: ft(1), y: ft(2), w: ft(8), h: ft(2), label: "Garment rack" },
      { kind: "product", x: ft(0.5), y: ft(5), w: ft(2.5), h: ft(3), label: "Mannequin focal" },
      { kind: "product", x: ft(4), y: ft(5), w: ft(3.5), h: ft(2), label: "Folded display" },
      { kind: "upsell", x: ft(7.5), y: ft(5), w: ft(2), h: ft(1.5), label: "Jewelry / scarves" },
      { kind: "checkout", x: ft(7.5), y: ft(7), w: ft(2), h: ft(1.5), label: "Register" },
      { kind: "storage", x: ft(0), y: ft(8.5), w: ft(2.5), h: ft(1.5), label: "Sizes / spare stock" },
      { kind: "waiting", x: ft(3), y: ft(8), w: ft(2), h: ft(1.5), label: "Curtain fitting nook" },
      { kind: "flow", x: ft(5), y: ft(1.5), w: ft(2), h: ft(7), label: "Flow ↺" },
    ],
  },
  {
    slug: "food-vendor",
    title: "Food Vendor Booth",
    size: "10x10",
    category: "food",
    summary:
      "Cooking station at the back, service counter mid-front, menu board overhead, line forms to the right, exit-left after pickup.",
    width: ft(10),
    height: ft(10),
    zones: [
      { kind: "signage", x: ft(1), y: ft(0), w: ft(8), h: ft(1.5), label: "Menu board (overhead)" },
      { kind: "product", x: ft(0), y: ft(7.5), w: ft(10), h: ft(2.5), label: "Cooking line (back)" },
      { kind: "product", x: ft(1), y: ft(5), w: ft(8), h: ft(2), label: "Service counter" },
      { kind: "checkout", x: ft(7), y: ft(5), w: ft(2), h: ft(2), label: "Order + pay" },
      { kind: "waiting", x: ft(8.5), y: ft(1.5), w: ft(1.5), h: ft(3.5), label: "Line (enters right)" },
      { kind: "upsell", x: ft(5), y: ft(5), w: ft(2), h: ft(2), label: "Add a drink / side" },
      { kind: "storage", x: ft(0), y: ft(9), w: ft(2), h: ft(1), label: "Cold storage" },
      { kind: "flow", x: ft(0.5), y: ft(2), w: ft(2), h: ft(3), label: "Pickup / exit ←" },
    ],
  },
  {
    slug: "coffee-booth",
    title: "Coffee Booth",
    size: "10x10",
    category: "coffee",
    summary:
      "Espresso machine on the back-right, order at the front-left, pickup at the front-right. Pastry case as visual magnet on the open side.",
    width: ft(10),
    height: ft(10),
    zones: [
      { kind: "signage", x: ft(1), y: 0, w: ft(8), h: ft(1.5), label: "Menu board" },
      { kind: "product", x: ft(5), y: ft(7), w: ft(5), h: ft(3), label: "Espresso bar" },
      { kind: "upsell", x: ft(0), y: ft(5), w: ft(4), h: ft(2), label: "Pastry case (magnet)" },
      { kind: "checkout", x: ft(0.5), y: ft(7), w: ft(3), h: ft(2), label: "Order + pay (front-left)" },
      { kind: "product", x: ft(4), y: ft(5), w: ft(2), h: ft(2), label: "Beans / merch retail" },
      { kind: "waiting", x: ft(3.5), y: ft(2), w: ft(3), h: ft(2.5), label: "Pickup waiting" },
      { kind: "storage", x: ft(8), y: ft(2), w: ft(2), h: ft(2.5), label: "Cups / lids stock" },
      { kind: "flow", x: ft(1), y: ft(2), w: ft(2), h: ft(2.5), label: "Order → pickup →" },
    ],
  },
  {
    slug: "bakery-booth",
    title: "Bakery Booth",
    size: "10x10",
    category: "bakery",
    summary:
      "Tiered front display of breads + pastries, branded boxes pre-stacked behind, jam and add-on shelf at the register.",
    width: ft(10),
    height: ft(10),
    zones: [
      { kind: "signage", x: ft(1), y: 0, w: ft(8), h: ft(1), label: "Bakery name + 'today's bake'" },
      { kind: "product", x: ft(0.5), y: ft(2), w: ft(9), h: ft(3), label: "Tiered front display" },
      { kind: "product", x: ft(0.5), y: ft(5.5), w: ft(6), h: ft(2), label: "Loaf shelf" },
      { kind: "upsell", x: ft(6.5), y: ft(5.5), w: ft(3), h: ft(2), label: "Jam + butter add-on" },
      { kind: "checkout", x: ft(6.5), y: ft(7.5), w: ft(3), h: ft(1.5), label: "Register" },
      { kind: "storage", x: ft(0), y: ft(8), w: ft(3), h: ft(2), label: "Boxes + bags" },
      { kind: "impulse", x: ft(3.5), y: ft(8), w: ft(2.5), h: ft(1.5), label: "Cookies (impulse)" },
      { kind: "flow", x: ft(4), y: ft(1.2), w: ft(2), h: ft(0.8), label: "Step-in flow" },
    ],
  },
  {
    slug: "jewelry-booth",
    title: "Jewelry Booth",
    size: "10x10",
    category: "jewelry",
    summary:
      "Glass cases at the front (lockable overnight), velvet trays on risers, hero piece spotlit on a single pedestal in the back-center.",
    width: ft(10),
    height: ft(10),
    zones: [
      { kind: "signage", x: ft(1), y: 0, w: ft(8), h: ft(1), label: "Banner" },
      { kind: "product", x: ft(0.5), y: ft(7), w: ft(9), h: ft(2.5), label: "Glass front cases" },
      { kind: "product", x: ft(4), y: ft(2.5), w: ft(2), h: ft(2), label: "Hero pedestal (spotlit)" },
      { kind: "product", x: ft(0.5), y: ft(2), w: ft(3), h: ft(3), label: "Earring wall" },
      { kind: "product", x: ft(6.5), y: ft(2), w: ft(3), h: ft(3), label: "Necklace wall" },
      { kind: "checkout", x: ft(7.5), y: ft(5.5), w: ft(2), h: ft(1.5), label: "Register" },
      { kind: "storage", x: ft(0), y: ft(5.5), w: ft(2), h: ft(1.5), label: "Stock drawers" },
      { kind: "impulse", x: ft(5.5), y: ft(5.5), w: ft(2), h: ft(1.5), label: "Stacking rings (impulse)" },
      { kind: "flow", x: ft(4), y: ft(0.5), w: ft(2), h: ft(1.5), label: "Center entry" },
    ],
  },
  {
    slug: "candle-booth",
    title: "Candle Booth",
    size: "10x10",
    category: "candle",
    summary:
      "Scent-grouped wall, sniff bar at the front edge, premium collection on its own riser at the back, melt + accessory bundle at the register.",
    width: ft(10),
    height: ft(10),
    zones: [
      { kind: "signage", x: ft(1), y: 0, w: ft(8), h: ft(1), label: "Candle co. name" },
      { kind: "product", x: ft(0.5), y: ft(2), w: ft(9), h: ft(2.5), label: "Scent wall (color-blocked)" },
      { kind: "product", x: ft(3), y: ft(5), w: ft(4), h: ft(2), label: "Premium collection riser" },
      { kind: "impulse", x: ft(0.5), y: ft(5), w: ft(2.5), h: ft(2), label: "Sniff bar (front edge)" },
      { kind: "upsell", x: ft(7), y: ft(5), w: ft(2.5), h: ft(2), label: "Wick trimmer / matches" },
      { kind: "checkout", x: ft(7), y: ft(7.5), w: ft(2.5), h: ft(1.5), label: "Register" },
      { kind: "storage", x: ft(0), y: ft(8), w: ft(3), h: ft(2), label: "Stock totes" },
      { kind: "flow", x: ft(4), y: ft(1.2), w: ft(2), h: ft(0.8), label: "Step-in flow" },
    ],
  },
  {
    slug: "clothing-booth",
    title: "Clothing Booth",
    size: "10x10",
    category: "clothing",
    summary:
      "Racks left + right, folded table center, hero mannequin at the front corner. Mirror at the register.",
    width: ft(10),
    height: ft(10),
    zones: [
      { kind: "signage", x: ft(1), y: 0, w: ft(8), h: ft(1), label: "Brand banner" },
      { kind: "product", x: ft(0), y: ft(2), w: ft(2), h: ft(6), label: "Left rack" },
      { kind: "product", x: ft(8), y: ft(2), w: ft(2), h: ft(6), label: "Right rack" },
      { kind: "product", x: ft(2.5), y: ft(4.5), w: ft(5), h: ft(2.5), label: "Folded center table" },
      { kind: "product", x: ft(2.5), y: ft(2), w: ft(2.5), h: ft(2.5), label: "Mannequin focal" },
      { kind: "upsell", x: ft(5.5), y: ft(2), w: ft(2), h: ft(2.5), label: "Accessories" },
      { kind: "checkout", x: ft(7.5), y: ft(8), w: ft(2.5), h: ft(1.5), label: "Register + mirror" },
      { kind: "storage", x: ft(0), y: ft(8.5), w: ft(2.5), h: ft(1.5), label: "Sizes" },
      { kind: "flow", x: ft(4), y: ft(8), w: ft(2), h: ft(1.5), label: "Center entry" },
    ],
  },
  {
    slug: "pet-vendor",
    title: "Pet Vendor Booth",
    size: "10x10",
    category: "pet",
    summary:
      "Treat sample bowl + water bowl at the front edge (the dog enters first). Leash hooks on the side wall. Premium toy display elevated.",
    width: ft(10),
    height: ft(10),
    zones: [
      { kind: "signage", x: ft(1), y: 0, w: ft(8), h: ft(1), label: "Brand name + 'pet-safe'" },
      { kind: "impulse", x: ft(1), y: ft(8.5), w: ft(2), h: ft(1.5), label: "Treat sample + water bowl", note: "Dog magnet." },
      { kind: "product", x: ft(0), y: ft(2), w: ft(2), h: ft(6), label: "Leash / collar wall" },
      { kind: "product", x: ft(2), y: ft(2), w: ft(6), h: ft(3), label: "Treat shelf (color-grouped)" },
      { kind: "product", x: ft(2), y: ft(5.5), w: ft(6), h: ft(2.5), label: "Toy + bed display" },
      { kind: "checkout", x: ft(8), y: ft(7), w: ft(2), h: ft(2), label: "Register" },
      { kind: "storage", x: ft(8), y: ft(2), w: ft(2), h: ft(4), label: "Stock" },
      { kind: "flow", x: ft(3), y: ft(8.5), w: ft(4), h: ft(1.5), label: "Dog-first entry" },
    ],
  },
  {
    slug: "kids-vendor",
    title: "Kids Vendor Booth",
    size: "10x10",
    category: "kids",
    summary:
      "Lower display heights for kids (24\" tables). Parent-height pricing on the back wall. Color-blocked, soft floor, a single touch-and-try zone.",
    width: ft(10),
    height: ft(10),
    zones: [
      { kind: "signage", x: ft(1), y: 0, w: ft(8), h: ft(1), label: "Brand name" },
      { kind: "product", x: ft(0.5), y: ft(2), w: ft(9), h: ft(2), label: "Parent-height back wall" },
      { kind: "product", x: ft(0.5), y: ft(5), w: ft(6), h: ft(2.5), label: "Low kid-height table" },
      { kind: "impulse", x: ft(6.5), y: ft(5), w: ft(3), h: ft(2.5), label: "Touch & try zone" },
      { kind: "checkout", x: ft(7.5), y: ft(8), w: ft(2.5), h: ft(1.5), label: "Register" },
      { kind: "storage", x: ft(0), y: ft(8), w: ft(3), h: ft(2), label: "Stock" },
      { kind: "flow", x: ft(4), y: ft(8), w: ft(3), h: ft(1.5), label: "Soft floor entry" },
    ],
  },
  {
    slug: "home-decor",
    title: "Home Decor Booth",
    size: "10x10",
    category: "home-decor",
    summary:
      "One styled lifestyle vignette (chair + table + lamp + art) that doubles as the focal. Shoppable inventory ringed behind it.",
    width: ft(10),
    height: ft(10),
    zones: [
      { kind: "signage", x: ft(1), y: 0, w: ft(8), h: ft(1), label: "Brand banner" },
      { kind: "product", x: ft(2.5), y: ft(2), w: ft(5), h: ft(3.5), label: "Lifestyle vignette focal" },
      { kind: "product", x: ft(0), y: ft(2), w: ft(2.5), h: ft(7), label: "Left inventory wall" },
      { kind: "product", x: ft(7.5), y: ft(2), w: ft(2.5), h: ft(7), label: "Right inventory wall" },
      { kind: "product", x: ft(2.5), y: ft(6), w: ft(5), h: ft(2), label: "Smalls table" },
      { kind: "checkout", x: ft(7.5), y: ft(8), w: ft(2.5), h: ft(2), label: "Register" },
      { kind: "storage", x: ft(0), y: ft(9), w: ft(2.5), h: ft(1), label: "Wrap + stock" },
      { kind: "flow", x: ft(4), y: ft(8.5), w: ft(2), h: ft(1.5), label: "Step-in flow" },
    ],
  },
  {
    slug: "plants-flowers",
    title: "Plants & Flowers",
    size: "10x10",
    category: "plants",
    summary:
      "Tiered crates spilling onto the aisle (a flower bucket on the ground is a magnet). Bouquet bar and wrap station at the register.",
    width: ft(10),
    height: ft(10),
    zones: [
      { kind: "signage", x: ft(1), y: 0, w: ft(8), h: ft(1), label: "Farm / studio name" },
      { kind: "impulse", x: ft(0), y: ft(9), w: ft(3), h: ft(1), label: "Aisle bucket (magnet)" },
      { kind: "product", x: ft(0.5), y: ft(2), w: ft(9), h: ft(3), label: "Tiered plant wall" },
      { kind: "product", x: ft(0.5), y: ft(5.5), w: ft(6), h: ft(2.5), label: "Cut flower bar" },
      { kind: "upsell", x: ft(6.5), y: ft(5.5), w: ft(3), h: ft(2.5), label: "Pots + care kits" },
      { kind: "checkout", x: ft(7), y: ft(8), w: ft(2.5), h: ft(2), label: "Wrap + register" },
      { kind: "storage", x: ft(3), y: ft(8), w: ft(3), h: ft(1), label: "Water buckets" },
      { kind: "flow", x: ft(3.5), y: ft(8.5), w: ft(2), h: ft(0.5), label: "Step-in flow" },
    ],
  },
  {
    slug: "mobile-trailer",
    title: "Mobile Trailer",
    size: "Mobile",
    category: "mobile",
    summary:
      "Service window on the long side. Awning extension overhead. Order at the left, pickup at the right. Menu board large and centered.",
    width: ft(20),
    height: ft(8),
    zones: [
      { kind: "signage", x: ft(4), y: ft(0), w: ft(12), h: ft(1.5), label: "Trailer name + menu" },
      { kind: "product", x: ft(0), y: ft(2), w: ft(20), h: ft(2), label: "Trailer body" },
      { kind: "checkout", x: ft(2), y: ft(4), w: ft(4), h: ft(2), label: "Order + pay (left)" },
      { kind: "waiting", x: ft(14), y: ft(4), w: ft(4), h: ft(2), label: "Pickup window (right)" },
      { kind: "upsell", x: ft(6), y: ft(4), w: ft(8), h: ft(2), label: "Menu / specials board" },
      { kind: "storage", x: ft(0), y: ft(6.5), w: ft(20), h: ft(1.5), label: "Customer queuing under awning" },
      { kind: "flow", x: ft(0.5), y: ft(4), w: ft(1.5), h: ft(2), label: "Line forms →" },
    ],
  },
  {
    slug: "food-truck",
    title: "Food Truck",
    size: "Mobile",
    category: "food",
    summary:
      "Single service window. Tall menu board on the side facing approach traffic. Queue on the right, pickup straight ahead, exit left.",
    width: ft(20),
    height: ft(8),
    zones: [
      { kind: "signage", x: ft(0), y: ft(0), w: ft(20), h: ft(1.5), label: "Truck wrap + menu board" },
      { kind: "product", x: ft(0), y: ft(2), w: ft(20), h: ft(2), label: "Food truck body" },
      { kind: "checkout", x: ft(8), y: ft(4), w: ft(4), h: ft(2), label: "Service window" },
      { kind: "waiting", x: ft(12), y: ft(4), w: ft(8), h: ft(2), label: "Line queue (right)" },
      { kind: "flow", x: ft(0.5), y: ft(4), w: ft(7), h: ft(2), label: "Pickup / exit ←" },
      { kind: "storage", x: ft(0), y: ft(6.5), w: ft(20), h: ft(1.5), label: "Customer queuing under awning" },
    ],
  },
];

// ---------- Gallery ----------

export type GalleryImage = {
  slug: string;
  category: BoothLayout["category"] | "art" | "seasonal" | "holiday" | "luxury" | "minimalist" | "modern" | "rustic" | "industrial";
  title: string;
  credit: string;
  src: string;
  tags: string[];
};

const u = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const galleryImages: GalleryImage[] = [
  { slug: "food-1", category: "food", title: "Open-fire taqueria", credit: "Unsplash · @louishansel", src: u("photo-1555396273-367ea4eb4db5"), tags: ["food", "outdoor"] },
  { slug: "food-2", category: "food", title: "Street-side pasta bar", credit: "Unsplash · @robinstickel", src: u("photo-1504674900247-0877df9cc836"), tags: ["food", "service"] },
  { slug: "craft-1", category: "craft", title: "Maker's bench display", credit: "Unsplash · @beccatapert", src: u("photo-1513519245088-0e12902e5a38"), tags: ["craft", "wood"] },
  { slug: "craft-2", category: "craft", title: "Ceramic studio market", credit: "Unsplash · @earl_wilcox", src: u("photo-1565193566173-7a0ee3dbe261"), tags: ["craft", "ceramics"] },
  { slug: "boutique-1", category: "boutique", title: "Vintage boutique pop-up", credit: "Unsplash · @cleobaeza", src: u("photo-1567401893414-76b7b1e5a7a5"), tags: ["boutique", "vintage"] },
  { slug: "jewelry-1", category: "jewelry", title: "Velvet-tray jewelry case", credit: "Unsplash · @studiofeixen", src: u("photo-1611652022419-a9419f74343d"), tags: ["jewelry", "case"] },
  { slug: "candle-1", category: "candle", title: "Apothecary candle wall", credit: "Unsplash · @rebeccaperetz", src: u("photo-1602874801007-bd458bb1b8b6"), tags: ["candle", "apothecary"] },
  { slug: "plants-1", category: "plants", title: "Greenhouse market stand", credit: "Unsplash · @scottwebb", src: u("photo-1466692476868-aef1dfb1e735"), tags: ["plants", "green"] },
  { slug: "coffee-1", category: "coffee", title: "Mobile espresso cart", credit: "Unsplash · @nate_dumlao", src: u("photo-1495474472287-4d71bcdd2085"), tags: ["coffee", "service"] },
  { slug: "bakery-1", category: "bakery", title: "Tiered pastry display", credit: "Unsplash · @rocknwool", src: u("photo-1509440159596-0249088772ff"), tags: ["bakery", "pastry"] },
  { slug: "art-1", category: "art", title: "Print + frame booth", credit: "Unsplash · @priscilladupreez", src: u("photo-1513519245088-0e12902e5a38"), tags: ["art", "print"] },
  { slug: "kids-1", category: "kids", title: "Soft-floor kids booth", credit: "Unsplash · @lavi_perchik", src: u("photo-1503454537195-1dcabb73ffb9"), tags: ["kids", "soft"] },
  { slug: "seasonal-1", category: "seasonal", title: "Autumn farmers market", credit: "Unsplash · @stillsbyjenna", src: u("photo-1506084868230-bb9d95c24759"), tags: ["seasonal", "autumn"] },
  { slug: "holiday-1", category: "holiday", title: "Holiday craft fair", credit: "Unsplash · @kaylee_brayne", src: u("photo-1543589077-47d81606c1bf"), tags: ["holiday", "winter"] },
  { slug: "luxury-1", category: "luxury", title: "Spotlit luxury display", credit: "Unsplash · @arobj", src: u("photo-1441986300917-64674bd600d8"), tags: ["luxury", "spotlit"] },
  { slug: "minimalist-1", category: "minimalist", title: "Minimal product shelf", credit: "Unsplash · @priscilladupreez", src: u("photo-1556909114-f6e7ad7d3136"), tags: ["minimalist"] },
  { slug: "farmers-1", category: "farmers-market", title: "Crate-stacked produce", credit: "Unsplash · @timmossholder", src: u("photo-1488459716781-31db52582fe9"), tags: ["farmers", "produce"] },
  { slug: "modern-1", category: "modern", title: "Modern apothecary booth", credit: "Unsplash · @brookecagle", src: u("photo-1604014237800-1c9102c219da"), tags: ["modern"] },
  { slug: "rustic-1", category: "rustic", title: "Rustic wood booth", credit: "Unsplash · @yannicklaurent", src: u("photo-1501426026826-31c667bdf23d"), tags: ["rustic", "wood"] },
  { slug: "industrial-1", category: "industrial", title: "Industrial pipe-shelf booth", credit: "Unsplash · @rocknwool", src: u("photo-1567521464027-f127ff144326"), tags: ["industrial", "metal"] },
];

// ---------- Downloads ----------

export type DownloadDoc = {
  slug: string;
  title: string;
  description: string;
  sections: { heading: string; items: string[] }[];
};

export const downloadDocs: DownloadDoc[] = [
  {
    slug: "booth-planning-workbook",
    title: "Booth Planning Workbook",
    description: "A full pre-event workbook: goals, budget, layout sketch space, signage plan, lighting plan, checklist.",
    sections: [
      { heading: "Event Information", items: ["Event name", "Date", "Load-in time", "Booth number", "Booth size", "Power available? Y / N", "Weather forecast"] },
      { heading: "Goals", items: ["Revenue goal $", "Units to sell", "Emails to collect", "Reviews to ask for", "One thing to test"] },
      { heading: "Layout Sketch", items: ["Tent footprint", "Tables (size + count)", "Hero focal point", "Register location", "Storage location"] },
      { heading: "Signage Plan", items: ["Back banner copy", "Price sign style", "QR code link", "Sale sign location"] },
      { heading: "Lighting Plan", items: ["Daytime lights (count)", "Evening lights (count)", "Battery source", "Backup batteries"] },
    ],
  },
  {
    slug: "booth-sketch-sheets",
    title: "Booth Sketch Sheets",
    description: "Blank 10x10 and 10x20 grids for sketching your layout by hand.",
    sections: [
      { heading: "How to Use", items: ["Print one sheet per layout idea", "Each square = 1 ft", "Label every zone", "Photograph and save your favorite"] },
    ],
  },
  {
    slug: "10x10-layout-guide",
    title: "10x10 Layout Guide",
    description: "Reference diagrams and dimensions for the most-used 10x10 layouts.",
    sections: [
      { heading: "Layouts Included", items: ["U-shape classic", "L-shape corner-friendly", "Open-front island", "Diagonal corner setup"] },
    ],
  },
  {
    slug: "10x20-layout-guide",
    title: "10x20 Layout Guide",
    description: "Twin-tent and single-span 10x20 layouts with traffic flow notes.",
    sections: [
      { heading: "Layouts Included", items: ["Twin-entry side-by-side", "Central focal island", "L-wrap corner 10x20", "Mid-aisle pass-through"] },
    ],
  },
  {
    slug: "corner-booth-guide",
    title: "Corner Booth Guide",
    description: "How to take advantage of two open sides, with three corner-booth layouts.",
    sections: [
      { heading: "Layouts Included", items: ["Diagonal hero focal", "L-wrap product wall", "Twin-entry corner"] },
    ],
  },
  {
    slug: "sign-placement-guide",
    title: "Sign Placement Guide",
    description: "Where each sign belongs — banner, prices, QR, sale.",
    sections: [
      { heading: "Placement Rules", items: ["Banner: 84\"+ readable at 50 ft", "Price tags: every item, every time", "QR: one only, framed at register", "Sale signs: contrast color, reserved use"] },
    ],
  },
  {
    slug: "lighting-guide",
    title: "Lighting Guide",
    description: "Daytime + evening lighting plans with battery sizing.",
    sections: [
      { heading: "Daytime Setup", items: ["2x clip-on LED work lights, back truss", "Aimed forward + down"] },
      { heading: "Evening Setup", items: ["Warm-white string lights, front edge", "1x spotlight on hero product", "Battery: 1000Wh minimum"] },
    ],
  },
  {
    slug: "display-checklist",
    title: "Display Checklist",
    description: "Walk the booth from 30 ft away, then 6 ft away — checklist for both.",
    sections: [
      { heading: "From 30 ft", items: ["Sign legible", "One clear focal", "Three heights visible", "No clutter visible"] },
      { heading: "From 6 ft", items: ["Every item priced", "Rule-of-three groupings", "Hero on its own riser", "Cross-sell at register"] },
    ],
  },
  {
    slug: "branding-checklist",
    title: "Branding Checklist",
    description: "Every brand touchpoint, on one page.",
    sections: [
      { heading: "Brand Touchpoints", items: ["Banner logo", "Table runner", "Packaging stamp/sticker", "Business cards", "Thank-you cards", "QR code sign", "Apron / uniform", "Bag print"] },
    ],
  },
  {
    slug: "setup-checklist",
    title: "Setup Checklist",
    description: "Step-by-step setup, in order.",
    sections: [
      { heading: "Setup Order", items: ["Park + unload", "Tent up + weighted", "Tables in position", "Tablecloths + drape", "Risers + shelves", "Product on display", "Signage hung", "Lighting on", "Register + card reader tested", "Pre-event photo for Instagram"] },
    ],
  },
  {
    slug: "breakdown-checklist",
    title: "Breakdown Checklist",
    description: "Tear down fast, leave the spot clean.",
    sections: [
      { heading: "Breakdown Order", items: ["Pack register + cash first", "Bag all small product", "Tables + linens last", "Tent down + weights", "Sweep the spot", "Cooler + trash out"] },
    ],
  },
  {
    slug: "shopping-checklist",
    title: "Shopping Checklist",
    description: "Master gear list — everything you might ever need at an event.",
    sections: [
      { heading: "Tent + Display", items: ["Tent", "Weights (4)", "Sidewalls (3)", "Tables (2)", "Tablecloths/drape", "Risers", "Banner", "Sign frames"] },
      { heading: "Tech + Power", items: ["Battery station", "Card reader", "Tablet", "Charging cables", "Spare phone charger"] },
      { heading: "Soft Goods", items: ["Bags", "Tissue", "Stickers", "Business cards", "Thank-you cards", "Sharpie + masking tape"] },
    ],
  },
  {
    slug: "equipment-checklist",
    title: "Equipment Checklist",
    description: "Quick-scan equipment list for load-in day.",
    sections: [
      { heading: "Equipment", items: ["Tent", "Weights x4", "Sidewalls", "Tables", "Chairs", "Storage bins", "Dolly / hand truck"] },
    ],
  },
  {
    slug: "vendor-packing-guide",
    title: "Vendor Packing Guide",
    description: "How to pack a vehicle in reverse-setup order.",
    sections: [
      { heading: "Load Order (last in = first out)", items: ["Bottom: packed product, extra stock", "Middle: tables, weights, storage bins", "Top: tent, signage, banner", "Front seat: cash float, card reader, day-of bin"] },
    ],
  },
];
