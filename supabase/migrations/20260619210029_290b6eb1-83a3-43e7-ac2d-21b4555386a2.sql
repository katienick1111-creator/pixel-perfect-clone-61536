
CREATE TABLE public.academy_pricing_calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Untitled calculation',
  inputs jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_favorite boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_pricing_calculations TO authenticated;
GRANT ALL ON public.academy_pricing_calculations TO service_role;

ALTER TABLE public.academy_pricing_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage pricing calcs"
  ON public.academy_pricing_calculations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX academy_pricing_calculations_user_idx
  ON public.academy_pricing_calculations(user_id, updated_at DESC);

CREATE TRIGGER trg_academy_pricing_calculations_updated
  BEFORE UPDATE ON public.academy_pricing_calculations
  FOR EACH ROW EXECUTE FUNCTION public.academy_touch_updated_at();
