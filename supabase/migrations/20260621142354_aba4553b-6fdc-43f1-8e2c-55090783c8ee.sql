GRANT SELECT ON public.academy_musthave_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_musthave_products TO authenticated;
GRANT ALL ON public.academy_musthave_products TO service_role;

ALTER TABLE public.academy_musthave_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academy_musthave_products ALTER COLUMN created_by SET DEFAULT auth.uid();
ALTER TABLE public.academy_musthave_products ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE public.academy_musthave_products ALTER COLUMN updated_at SET DEFAULT now();

CREATE OR REPLACE FUNCTION public.academy_musthave_products_set_defaults()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_by = COALESCE(NEW.created_by, auth.uid());
    NEW.created_at = COALESCE(NEW.created_at, now());
    NEW.updated_at = COALESCE(NEW.updated_at, now());
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.updated_at = now();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS academy_musthave_products_set_defaults_trigger ON public.academy_musthave_products;
CREATE TRIGGER academy_musthave_products_set_defaults_trigger
BEFORE INSERT OR UPDATE ON public.academy_musthave_products
FOR EACH ROW
EXECUTE FUNCTION public.academy_musthave_products_set_defaults();

DROP POLICY IF EXISTS "Authenticated importer can insert musthave products" ON public.academy_musthave_products;
CREATE POLICY "Authenticated importer can insert musthave products"
ON public.academy_musthave_products
FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());