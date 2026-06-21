CREATE TABLE public.academy_sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sale_date date NOT NULL DEFAULT CURRENT_DATE,
  event_name text NOT NULL DEFAULT '',
  product_name text NOT NULL DEFAULT '',
  quantity integer NOT NULL DEFAULT 1,
  price_per_item numeric NOT NULL DEFAULT 0,
  discount numeric NOT NULL DEFAULT 0,
  payment_type text NOT NULL DEFAULT 'Cash',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_sales TO authenticated;
GRANT ALL ON public.academy_sales TO service_role;
ALTER TABLE public.academy_sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own sales" ON public.academy_sales
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER academy_sales_updated_at BEFORE UPDATE ON public.academy_sales
  FOR EACH ROW EXECUTE FUNCTION public.academy_touch_updated_at();
CREATE INDEX academy_sales_user_idx ON public.academy_sales(user_id);

CREATE TABLE public.academy_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  event_name text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Miscellaneous',
  description text NOT NULL DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  payment_method text NOT NULL DEFAULT 'Card',
  receipt_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_expenses TO authenticated;
GRANT ALL ON public.academy_expenses TO service_role;
ALTER TABLE public.academy_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own expenses" ON public.academy_expenses
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER academy_expenses_updated_at BEFORE UPDATE ON public.academy_expenses
  FOR EACH ROW EXECUTE FUNCTION public.academy_touch_updated_at();
CREATE INDEX academy_expenses_user_idx ON public.academy_expenses(user_id);

CREATE TABLE public.academy_mileage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_date date NOT NULL DEFAULT CURRENT_DATE,
  event_name text NOT NULL DEFAULT '',
  start_location text NOT NULL DEFAULT '',
  end_location text NOT NULL DEFAULT '',
  miles numeric NOT NULL DEFAULT 0,
  rate numeric NOT NULL DEFAULT 0.67,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_mileage TO authenticated;
GRANT ALL ON public.academy_mileage TO service_role;
ALTER TABLE public.academy_mileage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own mileage" ON public.academy_mileage
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER academy_mileage_updated_at BEFORE UPDATE ON public.academy_mileage
  FOR EACH ROW EXECUTE FUNCTION public.academy_touch_updated_at();
CREATE INDEX academy_mileage_user_idx ON public.academy_mileage(user_id);