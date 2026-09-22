import { collection, doc, getDocs, limit, query, setDoc, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { db } from './firebase';
import { CITY_SEED, ADMIN_RESOURCES, ACADEMIC_RESOURCES } from './seedData.mjs';

let attempted = false;

// Runs once per session; silently skips if rules or network prevent writes.
export async function seedIfEmpty() {
  if (attempted) return;
  attempted = true;
  try {
    const cities = await getDocs(query(collection(db, 'cities'), limit(1)));
    if (cities.empty) {
      await Promise.all(CITY_SEED.map(({ id, ...c }) => setDoc(doc(db, 'cities', id), c)));
    }
    const seeded = await getDocs(query(collection(db, 'resources'), where('isSeed', '==', true), limit(1)));
    if (seeded.empty) {
      await Promise.all(
        [...ADMIN_RESOURCES, ...ACADEMIC_RESOURCES].map((r) =>
          addDoc(collection(db, 'resources'), { ...r, createdAt: serverTimestamp() }),
        ),
      );
    }
  } catch (e) {
    console.warn('Seed skipped:', e.message);
  }
}
