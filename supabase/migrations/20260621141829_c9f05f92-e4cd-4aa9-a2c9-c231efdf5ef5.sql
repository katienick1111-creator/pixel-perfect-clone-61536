
-- Ensure created_by auto-fills
ALTER TABLE public.academy_musthave_products ALTER COLUMN created_by SET DEFAULT auth.uid();

-- Drop existing policies
DROP POLICY IF EXISTS "Admins manage musthave products" ON public.academy_musthave_products;
DROP POLICY IF EXISTS "Anyone can view musthave products" ON public.academy_musthave_products;
DROP POLICY IF EXISTS "Vendors can delete their own musthave products" ON public.academy_musthave_products;
DROP POLICY IF EXISTS "Vendors can insert their own musthave products" ON public.academy_musthave_products;
DROP POLICY IF EXISTS "Vendors can update their own musthave products" ON public.academy_musthave_products;

-- Public catalog: anyone (anon + authenticated) can read
CREATE POLICY "Public can view musthave products"
ON public.academy_musthave_products FOR SELECT
USING (true);

-- Admin full access
CREATE POLICY "Admins insert musthave products"
ON public.academy_musthave_products FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update musthave products"
ON public.academy_musthave_products FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete musthave products"
ON public.academy_musthave_products FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Vendor scoped access
CREATE POLICY "Vendors insert own musthave products"
ON public.academy_musthave_products FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'vendor') AND created_by = auth.uid());

CREATE POLICY "Vendors update own musthave products"
ON public.academy_musthave_products FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'vendor') AND created_by = auth.uid())
WITH CHECK (public.has_role(auth.uid(), 'vendor') AND created_by = auth.uid());

CREATE POLICY "Vendors delete own musthave products"
ON public.academy_musthave_products FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'vendor') AND created_by = auth.uid());

GRANT SELECT ON public.academy_musthave_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_musthave_products TO authenticated;
GRANT ALL ON public.academy_musthave_products TO service_role;
