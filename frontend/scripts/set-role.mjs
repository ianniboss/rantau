// Usage: node scripts/set-role.mjs <email> <role>
// Requires Firestore rules that allow the write (test mode) — otherwise set users/{uid}.role in the Firebase Console.
import { readFileSync } from 'node:fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';

const [email, role = 'admin'] = process.argv.slice(2);
if (!email) { console.error('usage: node scripts/set-role.mjs <email> <role>'); process.exit(1); }
const env = Object.fromEntries(readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
const db = getFirestore(initializeApp({ apiKey: env.REACT_APP_FIREBASE_API_KEY, projectId: env.REACT_APP_FIREBASE_PROJECT_ID, appId: env.REACT_APP_FIREBASE_APP_ID }));
const snap = await getDocs(query(collection(db, 'users'), where('email', '==', email)));
if (snap.empty) { console.error('no user with that email'); process.exit(1); }
for (const d of snap.docs) { await updateDoc(doc(db, 'users', d.id), { role }); console.log(`${email} (${d.id}) → ${role} ✓`); }
process.exit(0);
