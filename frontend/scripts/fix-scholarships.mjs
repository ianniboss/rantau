// One-off: replace the Khazanah seed resource with MARA and refresh the JPA copy.
import { readFileSync } from 'node:fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { ACADEMIC_RESOURCES } from '../src/lib/seedData.mjs';

const env = Object.fromEntries(readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
const db = getFirestore(initializeApp({ apiKey: env.REACT_APP_FIREBASE_API_KEY, projectId: env.REACT_APP_FIREBASE_PROJECT_ID, appId: env.REACT_APP_FIREBASE_APP_ID }));

const seeded = await getDocs(query(collection(db, 'resources'), where('isSeed', '==', true)));
const mara = ACADEMIC_RESOURCES.find((r) => r.title.startsWith('MARA'));
const jpa = ACADEMIC_RESOURCES.find((r) => r.title.startsWith('JPA'));
for (const d of seeded.docs) {
  const t = d.data().title;
  if (t.startsWith('Khazanah')) { await updateDoc(doc(db, 'resources', d.id), { title: mara.title, externalLink: mara.externalLink, description: mara.description, tags: mara.tags }); console.log('Khazanah → MARA ✓'); }
  if (t.startsWith('JPA')) { await updateDoc(doc(db, 'resources', d.id), { title: jpa.title, description: jpa.description }); console.log('JPA updated ✓'); }
}
process.exit(0);
