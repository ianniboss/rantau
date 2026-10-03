# Rantau — Malaysian Student Resource Hub (France)

A platform connecting Malaysian students across France through **events**, an **administrative resource library** (CAF, Ameli, Campus France…), a **community board**, and **city hubs** for Paris, Toulouse, Lyon, Bordeaux, Lille, Marseille, Montpellier, Nantes, Strasbourg and Nice.

Built by **Ian Hafiz** — BUT Informatique, IUT Paul Sabatier (Toulouse), JPA scholar. Standalone portfolio project.

---

## Tech stack

| Layer | Choice |
|---|---|
| Frontend | React 19 + Tailwind CSS, React Router v7, React Hook Form, framer-motion, lucide-react, sonner (toasts), TanStack Query |
| Auth / DB | **Firebase Authentication** (email/password) + **Cloud Firestore** |
| File uploads | Small FastAPI service (`/backend`) that stores files in Emergent object storage and serves them back at `/api/files/...` (see *Assumptions*) |
| Maps | **Leaflet + OpenStreetMap** tiles — no API key or billing required. Embedded maps render on event detail & city hub pages; records without coordinates fall back to a Google Maps address-search link |
| Deployment | Frontend → Vercel, Firebase (Auth/Firestore/rules), file service → any Python host |

### Assumptions / deviations (documented on purpose)

1. **Create React App (craco) instead of Vite.** The hosting environment ships a CRA toolchain; the folder layout (`src/components`, `src/pages`, `src/hooks`, `src/lib/firebase.js`) is exactly as specified and would port to Vite by renaming `REACT_APP_*` → `VITE_*` and `process.env` → `import.meta.env`.
2. **Uploads use Emergent object storage via FastAPI**, not Firebase Storage (chosen by the project owner). `storage.rules` is still provided if you switch to Firebase Storage.
3. **Maps use Leaflet + OpenStreetMap** (no API key, no billing). `location.lat/lng` and `places[].lat/lng` are stored (nullable, auto-geocoded via OSM Nominatim on create); records without coordinates fall back to a Google Maps address-search link.
4. Comments use the field `postId` for the parent id (as in the schema) plus `parentType` (`post | event | resource`).
5. The `users/{uid}` doc has an extra optional `socialLinks` map; resources seeded by the script carry `isSeed: true`.
6. Roles are set manually in Firestore (`users/{uid}.role = "admin"`). No admin UI (out of scope).

---

## Project structure

```
frontend/
  src/
    components/   Navbar, Footer, Layout, cards, VoteButtons, Comments, FileUpload, skeletons…
    pages/        Home, Events, EventDetail, EventNew, Resources, ResourceNew, Community,
                  PostDetail, PostNew, Cities, CityHub, Profile, Login, Signup, NotFound
    hooks/        useAuth (AuthContext), useTheme (dark mode)
    lib/          firebase.js, db.js (all Firestore access), api.js (uploads), constants.js,
                  seedData.mjs (cities + official resources), seed.js, format.js, ui.js
  scripts/seed.mjs   Node seed script
  .env.example
backend/
  server.py          FastAPI upload/download bridge (/api/upload, /api/files/{path})
firestore.rules      Security rules (section 5 of the brief)
storage.rules        Optional Firebase Storage rules
```

---

## Setup

### 1. Firebase project

1. Go to <https://console.firebase.google.com> → **Add project**.
2. **Build → Authentication → Get started → Sign-in method → Email/Password → Enable**.
3. **Build → Firestore Database → Create database** (production mode, pick a region close to France e.g. `europe-west1`).
   - If you see *"Cloud Firestore API has not been used in project… or it is disabled"*, enable it at
     `https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=<projectId>`.
4. **Firestore → Rules** → paste the contents of `firestore.rules` → Publish.
5. **Project settings → Your apps → Web app (</>)** → copy the `firebaseConfig` values into `frontend/.env`.
6. (Optional) **Build → Storage** if you later switch uploads to Firebase Storage; paste `storage.rules`.

### 2. Environment variables

Copy `frontend/.env.example` → `frontend/.env` and fill in:

```
REACT_APP_BACKEND_URL=            # URL of the FastAPI file service (http://localhost:8001 locally)
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=
```

> Maps are powered by **Leaflet + OpenStreetMap** and need **no API key or billing** — there is nothing extra to configure.

Backend (`backend/.env`): `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`, `EMERGENT_LLM_KEY` (object storage key).

**Never commit real keys.** `.env` files are git-ignored.

### 3. Maps

Maps use **Leaflet + OpenStreetMap** tiles via `react-leaflet` — **no API key, no Google Cloud billing, nothing to configure**. Embedded maps render in `EventDetail.jsx` and `CityHub.jsx` using the stored `lat/lng`; addresses are auto-geocoded on create through OSM Nominatim, and any record still missing coordinates falls back to a Google Maps address-search link.

### 4. Seed data

Seeds the 10 cities and the Administrative + Academic resources (official URLs verbatim).

```bash
cd frontend
node scripts/seed.mjs
```

The script uses the *client* SDK, so Firestore rules must allow the writes. Easiest: run it once **before** publishing `firestore.rules` (database in test mode), or temporarily allow writes. The app also auto-seeds on first load if the `cities` collection is empty and rules permit (`src/lib/seed.js`).

---

## Local development

```bash
# frontend
cd frontend && yarn install && yarn start          # http://localhost:3000

# file-upload service
cd backend && pip install -r requirements.txt && uvicorn server:app --reload --port 8001
```

---

## Deployment

### Frontend → Vercel
1. Push the repo to GitHub, import it in Vercel, set **Root Directory** = `frontend`.
2. Build command `yarn build`, output directory `build`.
3. Add every `REACT_APP_*` variable from `.env.example` in *Project → Settings → Environment Variables*.
4. Add a rewrite so React Router handles deep links — `frontend/vercel.json`:
   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```
5. In Firebase Console → Authentication → Settings → **Authorized domains**, add your Vercel domain.

### Firebase
```bash
npm i -g firebase-tools
firebase login && firebase init firestore      # select existing project, point to firestore.rules
firebase deploy --only firestore:rules
```

### File service
Deploy `backend/` to any Python host (Railway, Render, Fly…) with the env vars above and point `REACT_APP_BACKEND_URL` at it.

---

## Features (MVP)

- Email/password auth; signup collects name, university, city, year, course; `users/{uid}` profile doc
- Events: list with city / category / date-range filters + keyword search, detail with RSVP (Going / Interested, capacity-aware), save/bookmark, comments, create form with image upload & preview, delete by organizer/admin
- Resource library: category tabs, title/tag search, most-recent / most-popular sort, one-vote-per-user up/down votes, download counter, PDF/DOCX/image upload, `pending_approval` unless admin
- Community board: 5 categories, city filter, posts with images, votes, threaded comments, pinned posts, delete by author/admin
- City hubs: 10 cities, local upcoming events, community-suggested places (restaurant / grocery / mosque / other), local tips
- Profiles: own (saved events, events, resources, posts, edit incl. social links) and public view
- Motion: route transitions, shimmer skeletons, staggered lists, hover lift, tactile buttons, vote pulse, RSVP morph, toasts, sticky blur nav with sliding indicator, animated hero gradient, dark mode

## Out of scope (hooks left as TODOs)
Admin moderation UI · real-time chat · notifications · payments · native app.
