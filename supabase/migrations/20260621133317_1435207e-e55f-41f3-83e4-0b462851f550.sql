
-- Vendor Must-Haves: categories
CREATE TABLE public.academy_musthave_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  group_name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.academy_musthave_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.academy_musthave_categories TO authenticated;
GRANT ALL ON public.academy_musthave_categories TO service_role;

ALTER TABLE public.academy_musthave_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view musthave categories"
  ON public.academy_musthave_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins manage musthave categories"
  ON public.academy_musthave_categories FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_musthave_cat_updated
  BEFORE UPDATE ON public.academy_musthave_categories
  FOR EACH ROW EXECUTE FUNCTION public.academy_touch_updated_at();

-- Vendor Must-Haves: products
CREATE TABLE public.academy_musthave_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  brand text,
  category_slug text NOT NULL REFERENCES public.academy_musthave_categories(slug) ON UPDATE CASCADE,
  short_description text,
  full_description text,
  why_recommended text,
  pros text[] NOT NULL DEFAULT '{}',
  cons text[] NOT NULL DEFAULT '{}',
  best_uses text[] NOT NULL DEFAULT '{}',
  best_for text[] NOT NULL DEFAULT '{}',
  price_min numeric,
  price_max numeric,
  price_display text,
  image_url text,
  images text[] NOT NULL DEFAULT '{}',
  purchase_url text,
  affiliate_url text,
  is_featured boolean NOT NULL DEFAULT false,
  is_staff_pick boolean NOT NULL DEFAULT false,
  is_trovin_recommended boolean NOT NULL DEFAULT false,
  rating numeric,
  rating_count int NOT NULL DEFAULT 0,
  popularity int NOT NULL DEFAULT 0,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_musthave_products_category ON public.academy_musthave_products(category_slug);
CREATE INDEX idx_musthave_products_featured ON public.academy_musthave_products(is_featured);

GRANT SELECT ON public.academy_musthave_products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.academy_musthave_products TO authenticated;
GRANT ALL ON public.academy_musthave_products TO service_role;

ALTER TABLE public.academy_musthave_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view musthave products"
  ON public.academy_musthave_products FOR SELECT
  USING (true);

CREATE POLICY "Admins manage musthave products"
  ON public.academy_musthave_products FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_musthave_prod_updated
  BEFORE UPDATE ON public.academy_musthave_products
  FOR EACH ROW EXECUTE FUNCTION public.academy_touch_updated_at();

-- Vendor Must-Haves: per-user favorites
CREATE TABLE public.academy_musthave_favorites (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.academy_musthave_products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, product_id)
);

GRANT SELECT, INSERT, DELETE ON public.academy_musthave_favorites TO authenticated;
GRANT ALL ON public.academy_musthave_favorites TO service_role;

ALTER TABLE public.academy_musthave_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own musthave favorites"
  ON public.academy_musthave_favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users add own musthave favorites"
  ON public.academy_musthave_favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own musthave favorites"
  ON public.academy_musthave_favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Seed categories
INSERT INTO public.academy_musthave_categories (slug, title, group_name, sort_order) VALUES
  ('canopy-tents','Commercial Canopy Tents','Booth Essentials',10),
  ('tent-weights','Tent Weights','Booth Essentials',20),
  ('folding-tables','Folding Tables','Booth Essentials',30),
  ('adjustable-tables','Adjustable Tables','Booth Essentials',40),
  ('table-covers','Table Covers','Booth Essentials',50),
  ('chairs','Comfortable Chairs','Booth Essentials',60),
  ('rolling-wagons','Rolling Wagons','Booth Essentials',70),
  ('hand-trucks','Hand Trucks','Booth Essentials',80),
  ('storage-totes','Storage Totes','Booth Essentials',90),
  ('tool-kits','Tool Kits','Booth Essentials',100),
  ('zip-ties','Zip Ties','Booth Essentials',110),
  ('bungee-cords','Bungee Cords','Booth Essentials',120),
  ('sandbags','Sandbags','Booth Essentials',130),

  ('gridwall','Gridwall Panels','Displays',10),
  ('slatwall','Slatwall Displays','Displays',20),
  ('pegboard','Pegboard Displays','Displays',30),
  ('jewelry-displays','Jewelry Displays','Displays',40),
  ('clothing-racks','Clothing Racks','Displays',50),
  ('wood-risers','Wood Display Risers','Displays',60),
  ('acrylic-sign-holders','Acrylic Sign Holders','Displays',70),
  ('rotating-displays','Rotating Displays','Displays',80),
  ('shelf-displays','Shelf Displays','Displays',90),
  ('basket-displays','Basket Displays','Displays',100),

  ('square-reader','Square Reader','Payments & Technology',10),
  ('square-terminal','Square Terminal','Payments & Technology',20),
  ('square-handheld','Square Handheld','Payments & Technology',30),
  ('clover-flex','Clover Flex','Payments & Technology',40),
  ('cash-box','Cash Box','Payments & Technology',50),
  ('receipt-printer','Receipt Printer','Payments & Technology',60),
  ('label-printer','Label Printer','Payments & Technology',70),
  ('barcode-scanner','Barcode Scanner','Payments & Technology',80),
  ('wifi-hotspot','Portable Wi-Fi Hotspot','Payments & Technology',90),
  ('power-banks','Power Banks','Payments & Technology',100),
  ('charging-stations','Charging Stations','Payments & Technology',110),
  ('tablet-stands','Tablet Stands','Payments & Technology',120),

  ('led-lights','LED Lights','Lighting & Power',10),
  ('clamp-lights','Clamp Lights','Lighting & Power',20),
  ('string-lights','String Lights','Lighting & Power',30),
  ('power-stations','Portable Power Stations','Lighting & Power',40),
  ('generators','Generators','Lighting & Power',50),
  ('extension-cords','Extension Cords','Lighting & Power',60),
  ('power-strips','Power Strips','Lighting & Power',70),
  ('rechargeable-lights','Rechargeable Lights','Lighting & Power',80),

  ('retractable-banners','Retractable Banners','Branding & Marketing',10),
  ('a-frame-signs','A-Frame Signs','Branding & Marketing',20),
  ('business-cards','Business Cards','Branding & Marketing',30),
  ('qr-code-signs','QR Code Signs','Branding & Marketing',40),
  ('menu-boards','Menu Boards','Branding & Marketing',50),
  ('price-tag-holders','Price Tag Holders','Branding & Marketing',60),
  ('loyalty-cards','Loyalty Cards','Branding & Marketing',70),
  ('flyers','Flyers','Branding & Marketing',80),
  ('table-signs','Table Signs','Branding & Marketing',90),
  ('phone-tripods','Phone Tripods','Branding & Marketing',100),
  ('ring-lights','Ring Lights','Branding & Marketing',110),

  ('rolling-bins','Rolling Bins','Packing & Storage',10),
  ('stackable-totes','Stackable Totes','Packing & Storage',20),
  ('coolers','Coolers','Packing & Storage',30),
  ('packing-tape','Packing Tape','Packing & Storage',40),
  ('bubble-wrap','Bubble Wrap','Packing & Storage',50),
  ('label-makers','Label Makers','Packing & Storage',60),
  ('storage-containers','Storage Containers','Packing & Storage',70),
  ('waterproof-cases','Waterproof Cases','Packing & Storage',80),

  ('cooling-fans','Cooling Fans','Comfort & Safety',10),
  ('portable-heaters','Portable Heaters','Comfort & Safety',20),
  ('anti-fatigue-mats','Anti-Fatigue Mats','Comfort & Safety',30),
  ('water-jugs','Water Jugs','Comfort & Safety',40),
  ('first-aid-kits','First Aid Kits','Comfort & Safety',50),
  ('sunscreen','Sunscreen','Comfort & Safety',60),
  ('rain-gear','Rain Gear','Comfort & Safety',70),
  ('bug-spray','Bug Spray','Comfort & Safety',80),
  ('fire-extinguishers','Fire Extinguishers','Comfort & Safety',90),

  ('food-thermometers','Food Thermometers','Food Vendor Equipment',10),
  ('handwashing-stations','Handwashing Stations','Food Vendor Equipment',20),
  ('serving-trays','Serving Trays','Food Vendor Equipment',30),
  ('cambro-containers','Cambro Containers','Food Vendor Equipment',40),
  ('food-gloves','Food Gloves','Food Vendor Equipment',50),
  ('ice-packs','Ice Packs','Food Vendor Equipment',60),
  ('food-coolers','Coolers (Food)','Food Vendor Equipment',70),
  ('food-storage','Food Storage Containers','Food Vendor Equipment',80);
