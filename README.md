# Rantau — Malaysian Student Resource Hub

A platform built for Malaysian students living in France: event listings, an administrative resource library (CAF, Ameli, SFERE), a community board, and dedicated hubs for 10 cities.

## Why I built this

I'm a JPA scholar, and students on JPA are supported by SFERE (Société Française d'Exportation des Ressources Éducatives) for our administration and insurance, home and medical. Almost five years in France now, starting in Tours, taught me that even with that support, a lot of the practical knowledge, which site handles what, caf.fr for housing allowance, ameli.fr for health insurance, administration-etrangers-en-france.interieur.gouv.fr for renewing a titre de séjour, messervicesetudiantsetrangers for other student formalities, isn't something anyone hands you outright. Sometimes it's a language barrier, sometimes it's just not knowing where to look. I built Rantau to put that knowledge, plus everything no official service covers, where to find halal food and meat, which Asian grocery stores stock what you need, how supermarkets like Auchan, Leclerc, and Lidl compare, which mobile plan (Orange, Bouygues, Free, SFR, Red by SFR) actually makes sense, how public transport works in each city, in one place, shared by students who've already figured it out, for the ones still learning.

## What it does

- Email/password auth; signup collects name, university, city, year, course; `users/{uid}` profile doc
- Events: list with city / category / date-range filters + keyword search, detail with RSVP (Going / Interested, capacity-aware), save/bookmark, comments, create form with image upload & preview, delete by organizer/admin
- Resource library: category tabs, title/tag search, most-recent / most-popular sort, one-vote-per-user up/down votes, download counter, PDF/DOCX/image upload, `pending_approval` unless admin
- Community board: 5 categories, city filter, posts with images, votes, threaded comments, pinned posts, delete by author/admin
- City hubs: 10 cities, local upcoming events, community-suggested places (restaurant / grocery / mosque / other), local tips
- Profiles: own (saved events, events, resources, posts, edit incl. social links) and public view
- Motion: route transitions, shimmer skeletons, staggered lists, hover lift, tactile buttons, vote pulse, RSVP morph, toasts, sticky blur nav with sliding indicator, animated hero gradient, dark mode

## Tech stack, and why

- **Frontend — React 19 + Tailwind CSS** (with React Router v7, React Hook Form, framer-motion, lucide-react, sonner for toasts, TanStack Query): a component-driven SPA with utility-first styling lets me ship a polished, animated UI quickly without fighting bespoke CSS.
- **Auth & database — Firebase Authentication (email/password) + Cloud Firestore**: managed auth and a realtime NoSQL store mean there's no server to operate for the core app and data stays in sync across clients instantly.
- **File uploads — a small FastAPI service** that stores files in Emergent object storage and serves them back at `/api/files/...`: keeps large binaries out of Firestore and behind one simple upload endpoint.
- **Maps — Leaflet + OpenStreetMap**: embedded, pinned maps with no API key and no billing, so anyone can run the project for free.
- **Deployment — Vercel (frontend) + Firebase (Auth/Firestore/rules) + any Python host (file service)**: each piece ships independently to a platform that fits it, all on generous free tiers.
