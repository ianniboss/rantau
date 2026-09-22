// Seed Firestore with the 10 cities and the Administrative/Academic resources.
// Usage (from /app/frontend):  node scripts/seed.mjs
// Reads Firebase config from frontend/.env. Requires Firestore rules that allow the
// writes (run once in test mode, or temporarily with an admin account — see README).
import { readFileSync } from 'node:fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, addDoc, collection, getDocs, query, where, limit, serverTimestamp } from 'firebase/firestore';
import { CITY_SEED, ADMIN_RESOURCES, ACADEMIC_RESOURCES } from '../src/lib/seedData.mjs';

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n').filter((l) => l.includes('=')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }),
);

const app = initializeApp({
  apiKey: env.REACT_APP_FIREBASE_API_KEY,
  authDomain: env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.REACT_APP_FIREBASE_APP_ID,
});
const db = getFirestore(app);

for (const { id, ...city } of CITY_SEED) {
  await setDoc(doc(db, 'cities', id), city, { merge: true });
  console.log('city ✓', city.name);
}

const existing = await getDocs(query(collection(db, 'resources'), where('isSeed', '==', true), limit(1)));
if (existing.empty) {
  for (const r of [...ADMIN_RESOURCES, ...ACADEMIC_RESOURCES]) {
    await addDoc(collection(db, 'resources'), { ...r, createdAt: serverTimestamp() });
    console.log('resource ✓', r.title);
  }
} else {
  console.log('resources already seeded, skipping');
}
console.log('Done.');
process.exit(0);
