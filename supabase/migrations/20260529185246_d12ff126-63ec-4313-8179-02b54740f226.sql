-- 1) Status enum + new columns
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_status') THEN
    CREATE TYPE public.event_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END$$;

ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS status public.event_status NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS submitted_by uuid,
  ADD COLUMN IF NOT EXISTS submitter_name text,
  ADD COLUMN IF NOT EXISTS submitter_email text,
  ADD COLUMN IF NOT EXISTS hours text,
  ADD COLUMN IF NOT EXISTS description text;

-- Existing events should remain visible
UPDATE public.events SET status = 'approved' WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS events_status_starts_at_idx
  ON public.events (status, starts_at);

-- 2) Replace permissive public-read policy with approved-only
DROP POLICY IF EXISTS "events public read" ON public.events;

CREATE POLICY "events public read approved"
ON public.events
FOR SELECT
TO anon, authenticated
USING (
  status = 'approved'
  OR public.has_role(auth.uid(), 'admin'::public.app_role)
  OR submitted_by = auth.uid()
);

-- 3) Let any signed-in user submit an event (forced to pending in app code)
DROP POLICY IF EXISTS "events user submit" ON public.events;

CREATE POLICY "events user submit"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (
  submitted_by = auth.uid()
  AND status = 'pending'
);
