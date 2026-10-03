# Rantau — Malaysian Student Resource Hub (France) · PRD

## Original problem statement
Build a production-ready full-stack platform connecting Malaysian students across France: events, administrative resource library (real CAF/Ameli/Campus France links), community board, city hubs, profiles. Firebase Auth + Firestore, React + Tailwind, framer-motion polish, firestore.rules, seed data, README. Out of scope: admin dashboard, chat, notifications, payments, native app.

## User choices
- Backend: Firebase (Auth + Firestore) — config for project `rantau-d7242` in `frontend/.env`
- Maps: **Leaflet + OpenStreetMap** (no API key / no billing). Embedded maps on event detail + city hubs; nullable lat/lng auto-geocoded via OSM Nominatim on create; records without coords fall back to a Google Maps address-search link.
- File uploads: Emergent object storage via FastAPI bridge (`/api/upload`, `/api/files/{path}`)
- Name: **Rantau**
- Scholarship references: JPA and MARA (not Khazanah)

## Architecture
- `frontend/` CRA (craco) React 19 + Tailwind, React Router v7, React Hook Form, TanStack Query, framer-motion, sonner, lucide-react. Firebase Web SDK used directly in the browser (`src/lib/firebase.js`, all data access in `src/lib/db.js`).
- `backend/server.py` FastAPI: upload/download bridge to Emergent object storage; file metadata in MongoDB `files`.
- `firestore.rules` (final locked rules — NOT yet published; Firestore currently in temporary open test-mode), `storage.rules` (optional).
- Seed: `frontend/src/lib/seedData.mjs` + `frontend/scripts/seed.mjs` (run ✅ 2026-06) + in-app `seedIfEmpty`.

## User personas
- New arrival: needs CAF/Ameli/visa guides fast, city tips, halal food spots.
- Active student: RSVPs to events, posts housing/marketplace threads, shares templates.
- Organizer/admin: creates events, approves resources (role set manually in Firestore).

## Core requirements (static)
Auth w/ profile fields · Events (filters, RSVP, comments, create w/ image) · Resources (tabs, search, votes, downloads, pending approval) · Community (categories, city filter, comments, votes) · City hubs (10 cities, places, tips) · Profiles (own + public) · Motion polish · Responsive 375/768/1280 · Loading/empty/error states.

- Iteration 4: fixed city images — all 10 cities in `CITIES` (`constants.js`) now use real significant-landmark photos (6 were previously `null` → gradient fallback; some were wrong). Applies to `/cities` grid + each City Hub hero. Tested ✅ iteration_4 (10/10 load, correct landmarks).
- Iteration 3: **Maps migrated from Google Maps to Leaflet + OpenStreetMap** (removed `@react-google-maps/api`; added `leaflet@1.9.4` + `react-leaflet@5.0.0` for React 19). `MapView.jsx` rewritten: OSM tile layer + attribution, `L.Icon.Default` marker-icon bundler fix, `geocode()` via OSM Nominatim, `hasMaps=true`, `MapsProvider` passthrough. Dark-theme tile filter in `index.css`. No API key/billing needed. README + `.env.example` updated (dropped `REACT_APP_GOOGLE_MAPS_API_KEY`). Also: untracked `.emergent/` + `.gitconfig` from git (kept locally, added to `.gitignore`). Tested ✅ iteration_3 (5/5 frontend).

## Implemented (earlier)
- All 6 feature areas end-to-end; tested by testing agent (backend 5/5, all frontend flows pass).
- Dark mode, route transitions, skeleton shimmer, stagger lists, hover lift, vote pulse, RSVP morph, sticky blur nav w/ sliding indicator, animated hero gradient, toasts.
- README with Firebase/Vercel setup; `.env.example`; seed script; rules files.
- Fixes after test: initials null-guard, 390px overflow on resource cards, MARA replaces Khazanah in seed + live Firestore.
- Iteration 2: admin resource approval (Pending tab, Approve/Reject) on /resources; homepage "This week in {city}" digest (next 3 events + newest 3 tips, city select persisted); resource queries reshaped to be rules-compatible (where status/uid); Google Maps component + geocoding wired behind `REACT_APP_GOOGLE_MAPS_API_KEY` (user skipped key — inactive); `scripts/set-role.mjs` to grant admin. Tested ✅ iteration_2.

## Backlog
- P0: Publish final `firestore.rules` in Firebase Console (user skipped — currently open test-mode until 2026-12-31) then regression-test under strict rules. Verify server-side Firebase ID token on `/api/upload` (firebase-admin).
- P1: Event status auto "completed" after date. (Optional) proxy OSM Nominatim through backend with a descriptive User-Agent if geocoding volume grows.
- P2: Notifications, chat, richer profiles (avatar upload), pagination for large lists, composite Firestore indexes if server-side filtering is needed.

## Known notes
- Firestore keeps a long-poll connection; Playwright `networkidle` waits time out — use `load`.
- Test data left in Firestore by QA: 1 event (Toulouse), 1 pending resource, 1 place + 1 tip in Toulouse, user qa+1790066392@rantau.test.
