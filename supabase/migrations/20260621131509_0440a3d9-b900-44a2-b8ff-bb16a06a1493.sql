
CREATE TABLE public.academy_profit_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Untitled calculation',
  calc_date date,
  event_name text,
  product_name text,
  inputs jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text,
  is_favorite boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_profit_calculations TO authenticated;
GRANT ALL ON public.academy_profit_calculations TO service_role;

ALTER TABLE public.academy_profit_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own profit calculations"
  ON public.academy_profit_calculations
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER academy_profit_calculations_touch
  BEFORE UPDATE ON public.academy_profit_calculations
  FOR EACH ROW EXECUTE FUNCTION public.academy_touch_updated_at();

CREATE INDEX academy_profit_calculations_user_idx
  ON public.academy_profit_calculations(user_id, updated_at DESC);
