CREATE TABLE public.academy_inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT '',
  sku text,
  cost numeric NOT NULL DEFAULT 0,
  retail_price numeric NOT NULL DEFAULT 0,
  quantity integer NOT NULL DEFAULT 0,
  low_stock_alert integer NOT NULL DEFAULT 0,
  notes text,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_inventory_items TO authenticated;
GRANT ALL ON public.academy_inventory_items TO service_role;

ALTER TABLE public.academy_inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own inventory"
ON public.academy_inventory_items
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER academy_inventory_items_updated_at
BEFORE UPDATE ON public.academy_inventory_items
FOR EACH ROW EXECUTE FUNCTION public.academy_touch_updated_at();

CREATE INDEX academy_inventory_items_user_idx ON public.academy_inventory_items(user_id);