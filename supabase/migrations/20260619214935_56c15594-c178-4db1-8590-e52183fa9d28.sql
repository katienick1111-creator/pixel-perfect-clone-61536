-- Booth Setup Masterclass: 4 user-scoped tables

CREATE TABLE public.academy_booth_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_slug text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_slug)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_booth_progress TO authenticated;
GRANT ALL ON public.academy_booth_progress TO service_role;
ALTER TABLE public.academy_booth_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own booth progress" ON public.academy_booth_progress
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER academy_booth_progress_touch BEFORE UPDATE ON public.academy_booth_progress
  FOR EACH ROW EXECUTE FUNCTION public.academy_touch_updated_at();

CREATE TABLE public.academy_booth_designs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Untitled Booth',
  size text NOT NULL DEFAULT '10x10',
  data jsonb NOT NULL DEFAULT '{"items":[],"width":120,"height":120,"notes":""}'::jsonb,
  is_favorite boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_booth_designs TO authenticated;
GRANT ALL ON public.academy_booth_designs TO service_role;
ALTER TABLE public.academy_booth_designs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own booth designs" ON public.academy_booth_designs
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER academy_booth_designs_touch BEFORE UPDATE ON public.academy_booth_designs
  FOR EACH ROW EXECUTE FUNCTION public.academy_touch_updated_at();

CREATE TABLE public.academy_booth_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'Booth Setup Checklist',
  data jsonb NOT NULL DEFAULT '{"sections":[]}'::jsonb,
  is_favorite boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_booth_checklists TO authenticated;
GRANT ALL ON public.academy_booth_checklists TO service_role;
ALTER TABLE public.academy_booth_checklists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own booth checklists" ON public.academy_booth_checklists
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER academy_booth_checklists_touch BEFORE UPDATE ON public.academy_booth_checklists
  FOR EACH ROW EXECUTE FUNCTION public.academy_touch_updated_at();

CREATE TABLE public.academy_gallery_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, image_slug)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_gallery_favorites TO authenticated;
GRANT ALL ON public.academy_gallery_favorites TO service_role;
ALTER TABLE public.academy_gallery_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own gallery favorites" ON public.academy_gallery_favorites
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);