-- Events
CREATE TABLE public.academy_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name text NOT NULL DEFAULT '',
  event_date date,
  event_time text,
  location text,
  organizer_name text,
  organizer_email text,
  organizer_phone text,
  website text,
  application_deadline date,
  booth_fee numeric NOT NULL DEFAULT 0,
  booth_size text,
  indoor_outdoor text,
  electricity boolean NOT NULL DEFAULT false,
  notes text,
  status text NOT NULL DEFAULT 'Interested',
  checklist jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_events TO authenticated;
GRANT ALL ON public.academy_events TO service_role;
ALTER TABLE public.academy_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own academy events" ON public.academy_events
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER academy_events_updated_at BEFORE UPDATE ON public.academy_events
  FOR EACH ROW EXECUTE FUNCTION public.academy_touch_updated_at();
CREATE INDEX academy_events_user_idx ON public.academy_events(user_id);

-- Contacts
CREATE TABLE public.academy_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  company text,
  contact_type text NOT NULL DEFAULT 'Other',
  email text,
  phone text,
  website text,
  instagram text,
  facebook text,
  tiktok text,
  location text,
  notes text,
  last_contacted date,
  next_followup date,
  favorite boolean NOT NULL DEFAULT false,
  interactions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.academy_contacts TO authenticated;
GRANT ALL ON public.academy_contacts TO service_role;
ALTER TABLE public.academy_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their own contacts" ON public.academy_contacts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER academy_contacts_updated_at BEFORE UPDATE ON public.academy_contacts
  FOR EACH ROW EXECUTE FUNCTION public.academy_touch_updated_at();
CREATE INDEX academy_contacts_user_idx ON public.academy_contacts(user_id);

-- Extend goals
ALTER TABLE public.academy_goals
  ADD COLUMN IF NOT EXISTS goal_type text NOT NULL DEFAULT 'Other',
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'Medium',
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'Active';