# Rantau — Malaysian Student Resource Hub (France) · PRD

## Original problem statement
Build a production-ready full-stack platform connecting Malaysian students across France: events, administrative resource library (real CAF/Ameli/Campus France links), community board, city hubs, profiles. Firebase Auth + Firestore, React + Tailwind, framer-motion polish, firestore.rules, seed data, README. Out of scope: admin dashboard, chat, notifications, payments, native app.

## User choices
- Backend: Firebase (Auth + Firestore) — config for project `rantau-d7242` in `frontend/.env`
- Maps: skipped (address + "Open in Google Maps" link; TODO hooks for `@react-google-maps/api`)
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

## Implemented (2026-06)
- All 6 feature areas end-to-end; tested by testing agent (backend 5/5, all frontend flows pass).
- Dark mode, route transitions, skeleton shimmer, stagger lists, hover lift, vote pulse, RSVP morph, sticky blur nav w/ sliding indicator, animated hero gradient, toasts.
- README with Firebase/Vercel setup; `.env.example`; seed script; rules files.
- Fixes after test: initials null-guard, 390px overflow on resource cards, MARA replaces Khazanah in seed + live Firestore.

## Backlog
- P0: Publish final `firestore.rules` in Firebase Console (currently open test-mode). Verify server-side Firebase ID token on `/api/upload` (firebase-admin).
- P1: Google Maps embed for event detail + city places (needs API key). Admin approval UI for pending resources. Event status auto "completed" after date.
- P2: Notifications, chat, richer profiles (avatar upload), pagination for large lists, composite Firestore indexes if server-side filtering is needed.

## Known notes
- Firestore keeps a long-poll connection; Playwright `networkidle` waits time out — use `load`.
- Test data left in Firestore by QA: 1 event (Toulouse), 1 pending resource, 1 place + 1 tip in Toulouse, user qa+1790066392@rantau.test.
