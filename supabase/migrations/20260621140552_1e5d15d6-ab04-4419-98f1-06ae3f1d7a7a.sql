
ALTER TABLE public.academy_musthave_products
  ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid();

CREATE POLICY "Vendors can insert their own musthave products"
  ON public.academy_musthave_products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'vendor')
    AND created_by = auth.uid()
  );

CREATE POLICY "Vendors can update their own musthave products"
  ON public.academy_musthave_products
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'vendor') AND created_by = auth.uid())
  WITH CHECK (public.has_role(auth.uid(), 'vendor') AND created_by = auth.uid());

CREATE POLICY "Vendors can delete their own musthave products"
  ON public.academy_musthave_products
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'vendor') AND created_by = auth.uid());
