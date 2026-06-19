-- Trovin Academy: foundation schema

-- 1) Categories
CREATE TABLE public.academy_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  icon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.academy_categories TO anon, authenticated;
GRANT ALL ON public.academy_categories TO service_role;
ALTER TABLE public.academy_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are public" ON public.academy_categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage categories" ON public.academy_categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2) Articles
CREATE TABLE public.academy_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES public.academy_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  body_md TEXT,
  cover_url TEXT,
  reading_minutes INT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.academy_articles TO anon, authenticated;
GRANT ALL ON public.academy_articles TO service_role;
ALTER TABLE public.academy_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published articles are public" ON public.academy_articles FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Admins manage articles" ON public.academy_articles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3) Downloads
CREATE TABLE public.academy_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES public.academy_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type TEXT,
  size_kb INT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.academy_downloads TO anon, authenticated;
GRANT ALL ON public.academy_downloads TO service_role;
ALTER TABLE public.academy_downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published downloads are public" ON public.academy_downloads FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Admins manage downloads" ON public.academy_downloads FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4) Favorites
CREATE TABLE public.academy_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('article','download','tool')),
  resource_ref TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, resource_type, resource_ref)
);
GRANT SELECT, INSERT, DELETE ON public.academy_favorites TO authenticated;
GRANT ALL ON public.academy_favorites TO service_role;
ALTER TABLE public.academy_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage favorites" ON public.academy_favorites FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 5) Worksheets (autosave)
CREATE TABLE public.academy_worksheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_slug TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, tool_slug)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_worksheets TO authenticated;
GRANT ALL ON public.academy_worksheets TO service_role;
ALTER TABLE public.academy_worksheets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage worksheets" ON public.academy_worksheets FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6) Goals
CREATE TABLE public.academy_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_value NUMERIC,
  current_value NUMERIC NOT NULL DEFAULT 0,
  unit TEXT,
  due_date DATE,
  is_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_goals TO authenticated;
GRANT ALL ON public.academy_goals TO service_role;
ALTER TABLE public.academy_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage goals" ON public.academy_goals FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 7) Community posts
CREATE TABLE public.academy_community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL DEFAULT 'tip' CHECK (kind IN ('tip','photo','story','question','review')),
  title TEXT,
  body TEXT NOT NULL,
  image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.academy_community_posts TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.academy_community_posts TO authenticated;
GRANT ALL ON public.academy_community_posts TO service_role;
ALTER TABLE public.academy_community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read posts" ON public.academy_community_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create own posts" ON public.academy_community_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners update own posts" ON public.academy_community_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners delete own posts" ON public.academy_community_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins manage all posts" ON public.academy_community_posts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 8) Comments
CREATE TABLE public.academy_community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.academy_community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_community_comments TO authenticated;
GRANT ALL ON public.academy_community_comments TO service_role;
ALTER TABLE public.academy_community_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read comments" ON public.academy_community_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users create own comments" ON public.academy_community_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners modify own comments" ON public.academy_community_comments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners delete own comments" ON public.academy_community_comments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 9) Download log
CREATE TABLE public.academy_download_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  download_id UUID NOT NULL REFERENCES public.academy_downloads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.academy_download_log TO authenticated, anon;
GRANT SELECT ON public.academy_download_log TO authenticated;
GRANT ALL ON public.academy_download_log TO service_role;
ALTER TABLE public.academy_download_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone may log downloads" ON public.academy_download_log FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read download log" ON public.academy_download_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.academy_touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_academy_categories_updated BEFORE UPDATE ON public.academy_categories FOR EACH ROW EXECUTE FUNCTION public.academy_touch_updated_at();
CREATE TRIGGER trg_academy_articles_updated BEFORE UPDATE ON public.academy_articles FOR EACH ROW EXECUTE FUNCTION public.academy_touch_updated_at();
CREATE TRIGGER trg_academy_downloads_updated BEFORE UPDATE ON public.academy_downloads FOR EACH ROW EXECUTE FUNCTION public.academy_touch_updated_at();
CREATE TRIGGER trg_academy_worksheets_updated BEFORE UPDATE ON public.academy_worksheets FOR EACH ROW EXECUTE FUNCTION public.academy_touch_updated_at();
CREATE TRIGGER trg_academy_goals_updated BEFORE UPDATE ON public.academy_goals FOR EACH ROW EXECUTE FUNCTION public.academy_touch_updated_at();
CREATE TRIGGER trg_academy_posts_updated BEFORE UPDATE ON public.academy_community_posts FOR EACH ROW EXECUTE FUNCTION public.academy_touch_updated_at();

-- Seed categories
INSERT INTO public.academy_categories (slug, title, description, sort_order, icon) VALUES
  ('getting-started', 'Getting Started', 'New to vending? Start here.', 1, 'compass'),
  ('festivals-events', 'Festivals & Events', 'Prep, packing, and on-site playbooks.', 2, 'tent'),
  ('booth-setup', 'Booth Setup', 'Layout, signage, displays, and lighting.', 3, 'layout-grid'),
  ('pricing-sales', 'Pricing & Sales', 'Price with confidence, close more.', 4, 'tag'),
  ('marketing', 'Marketing', 'Get noticed before, during, and after the event.', 5, 'megaphone'),
  ('business-tools', 'Business Tools', 'CRM, inventory, taxes, mileage.', 6, 'briefcase'),
  ('vendor-stories', 'Vendor Success Stories', 'Learn from vendors who''ve done it.', 7, 'book-open'),
  ('downloads', 'Downloads', 'Printable checklists, planners, workbooks.', 8, 'download');
