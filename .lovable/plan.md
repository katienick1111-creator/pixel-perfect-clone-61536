## Plan: Admin Dashboard on Lovable Cloud

### 1. Turn on Lovable Cloud
Enables Postgres, auth, and storage. No external accounts to set up.

### 2. Database schema
New tables (all RLS-on, with `service_role` + scoped `authenticated` grants):

- `profiles` — id (FK auth.users), display_name, created_at. Auto-created on signup via trigger.
- `user_roles` — (user_id, role enum: `admin` | `vendor` | `shopper`). Checked via `has_role()` security-definer function.
- `vendors` — id, owner_id (FK auth.users, nullable), name, tagline, category, image_url, scribble, payments[], status (`pending`/`approved`/`hidden`), featured, created_at.
- `events` — id, name, location, starts_at, ends_at, created_at.
- `event_vendors` — (event_id, vendor_id, booth, hours, open_today) — assigns vendors to a market.
- `follows` — (shopper_id, vendor_id) — who's following whom.

### 3. Auth
- Email/password + Google sign-in (default Lovable Cloud setup).
- First user to sign up at `/admin/setup` gets the `admin` role (one-time bootstrap), afterwards admin promotion happens inside the dash.
- `/admin/*` routes wrapped in `_authenticated` layout + child `beforeLoad` that checks `has_role('admin')`.

### 4. Admin dashboard routes
```
/admin           → overview (counts: vendors pending, events upcoming, total shoppers)
/admin/vendors   → list, approve/hide, edit, add new
/admin/vendors/$id → full edit form (reuses the vendor card UI)
/admin/events    → list + create/edit markets
/admin/events/$id → assign vendors, set booths/hours
/admin/shoppers  → list signups, follows count, last active
```

All reads/writes go through `createServerFn` with `requireSupabaseAuth` + admin-role check.

### 5. Wire the home page to the database
Replace the hardcoded `allVendors` array + localStorage `VendorProfile` with live queries against `vendors` + `event_vendors`. Keeps "The Roster" mosaic exactly as it is — just real data.

### 6. Header nav
Add a small "Sign in" / "Admin" link in the existing nav, visible based on auth state.

### Out of scope (later)
- Analytics charts (just raw counts for now).
- Vendor self-serve dashboard rewrite (the existing `/vendor` page keeps working against localStorage until we migrate it in a follow-up).
- Image uploads (we'll keep image URLs as text fields for v1; storage bucket comes next).

### Technical notes
- Roles in a separate `user_roles` table — never on profiles (prevents privilege escalation).
- `has_role()` is `SECURITY DEFINER` to avoid RLS recursion.
- Every new public-schema table gets explicit `GRANT`s in the same migration.
- Home page becomes a public server fn using `supabaseAdmin` with `WHERE status='approved'` so SSR works without a session.
