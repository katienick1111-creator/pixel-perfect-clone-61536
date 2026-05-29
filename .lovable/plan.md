## Plan: Trovin' main app screen

Build the first real app interface for Trovin' as a vendor-first discovery platform for local markets, shows, fairs, food trucks, collectibles, and farmers markets.

### What I’ll build

1. **Replace the current brand showcase with an app UI**
   - No marketing landing page.
   - The `/` route becomes the main Trovin' app screen.
   - Use the existing Trovin' logo, badge, colors, and typography already added.

2. **Create a discovery-first dashboard**
   - Header with Trovin' wordmark, Chicago pilot context, search, and notification/profile controls.
   - Desktop app layout with a left navigation rail:
     - Discover
     - Events
     - Map
     - Following
     - Vendor Portal
   - Mobile-friendly layout with compact top controls and bottom navigation.

3. **Add core discovery content with mock data**
   - Featured nearby event: e.g. “Randolph Street Market.”
   - Vendor cards for categories from the PRD:
     - Antiques
     - Craft fairs
     - Food trucks
     - Collectibles
     - Farmers markets
   - Vendor details: category, event, today’s hours, payment methods, follow/save action, featured status.

4. **Add filter/search experience**
   - Search bar for vendor, keyword, event, or location.
   - Filter chips for category, event, payment method, and “open today.”
   - This will be visual/mock behavior for now, not database-backed.

5. **Add map-style event panel**
   - A branded illustrated map/card area, not a real map API yet.
   - Pins/booth markers for vendors.
   - Category legend and “future booth overlays” feel from the PRD.

6. **Add following and notification cues**
   - Small “followed vendor alert” panel.
   - Event reminders and category recommendation examples.
   - Make the app feel useful immediately, even with mock data.

### Technical approach

- Edit primarily `src/routes/index.tsx`.
- Keep the existing brand tokens in `src/styles.css`; only add small utility refinements if needed.
- Use existing UI conventions and semantic Tailwind tokens.
- No Lovable Cloud/database/auth yet, because you asked for the main app screen first.
- No new dependencies.

### Out of scope for this pass

- Real login/signup
- Real database tables
- Vendor portal forms
- Admin tools
- Live maps/geolocation
- Payment/subscription setup

Those come next after the app screen direction is approved.