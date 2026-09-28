import {
  collection, doc, addDoc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy,
  serverTimestamp, arrayUnion, increment, runTransaction,
} from 'firebase/firestore';
import { db } from './firebase';

const snapToList = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }));
const one = async (col, id) => {
  const snap = await getDoc(doc(db, col, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
};

// ---- Events
export const fetchEvents = async () => snapToList(await getDocs(query(collection(db, 'events'), orderBy('date', 'asc'))));
export const fetchEvent = (id) => one('events', id);
export const createEvent = (data) =>
  addDoc(collection(db, 'events'), { ...data, attendees: [], interested: [], status: 'upcoming', createdAt: serverTimestamp() });
export const deleteEvent = (id) => deleteDoc(doc(db, 'events', id));
export const fetchEventsBy = async (uid) =>
  snapToList(await getDocs(query(collection(db, 'events'), where('organizer.uid', '==', uid))));

export async function setRsvp(eventId, uid, status) {
  const ref = doc(db, 'events', eventId);
  await runTransaction(db, async (tx) => {
    const d = (await tx.get(ref)).data();
    const attendees = (d.attendees || []).filter((x) => x !== uid);
    const interested = (d.interested || []).filter((x) => x !== uid);
    if (status === 'going') {
      if (d.capacity && attendees.length >= d.capacity) throw new Error('This event is already full');
      attendees.push(uid);
    }
    if (status === 'interested') interested.push(uid);
    tx.update(ref, { attendees, interested });
  });
}

// ---- Resources (queries shaped to satisfy firestore.rules for list reads)
const byNewest = (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
export const fetchResources = async () =>
  snapToList(await getDocs(query(collection(db, 'resources'), where('status', '==', 'approved')))).sort(byNewest);
export const fetchPendingResources = async () =>
  snapToList(await getDocs(query(collection(db, 'resources'), where('status', '==', 'pending_approval')))).sort(byNewest);
export const fetchResourcesBy = async (uid, approvedOnly = false) => {
  const clauses = [where('uploadedBy.uid', '==', uid)];
  if (approvedOnly) clauses.push(where('status', '==', 'approved'));
  return snapToList(await getDocs(query(collection(db, 'resources'), ...clauses))).sort(byNewest);
};
export const approveResource = (id) => updateDoc(doc(db, 'resources', id), { status: 'approved' });
export const deleteResource = (id) => deleteDoc(doc(db, 'resources', id));
export const createResource = (data, isAdmin) =>
  addDoc(collection(db, 'resources'), {
    ...data, upvotes: 0, downvotes: 0, votedBy: {}, downloads: 0,
    status: isAdmin ? 'approved' : 'pending_approval', createdAt: serverTimestamp(),
  });
export const incrementDownloads = (id) => updateDoc(doc(db, 'resources', id), { downloads: increment(1) });

// ---- Votes (resources & posts) — one vote per user, toggled
export async function castVote(col, id, uid, dir) {
  const ref = doc(db, col, id);
  return runTransaction(db, async (tx) => {
    const d = (await tx.get(ref)).data();
    const votedBy = { ...(d.votedBy || {}) };
    const prev = votedBy[uid];
    let up = d.upvotes || 0;
    let down = d.downvotes || 0;
    if (prev === 'up') up -= 1;
    if (prev === 'down') down -= 1;
    const next = prev === dir ? null : dir;
    if (next === 'up') up += 1;
    if (next === 'down') down += 1;
    if (next) votedBy[uid] = next; else delete votedBy[uid];
    tx.update(ref, { upvotes: up, downvotes: down, votedBy });
    return { upvotes: up, downvotes: down, votedBy };
  });
}

// ---- Posts
export const fetchPosts = async () => snapToList(await getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc'))));
export const fetchPost = (id) => one('posts', id);
export const fetchPostsBy = async (uid) =>
  snapToList(await getDocs(query(collection(db, 'posts'), where('author.uid', '==', uid))));
export const createPost = (data) =>
  addDoc(collection(db, 'posts'), {
    ...data, upvotes: 0, downvotes: 0, votedBy: {}, commentCount: 0, isPinned: false, createdAt: serverTimestamp(),
  });
export const deletePost = (id) => deleteDoc(doc(db, 'posts', id));

// ---- Comments (parentType: post | event | resource)
export const fetchComments = async (parentId) => {
  const list = snapToList(await getDocs(query(collection(db, 'comments'), where('postId', '==', parentId))));
  return list.sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
};
export async function addComment({ parentType, parentId, author, content }) {
  const ref = await addDoc(collection(db, 'comments'), { postId: parentId, parentType, author, content, createdAt: serverTimestamp() });
  if (parentType === 'post') await updateDoc(doc(db, 'posts', parentId), { commentCount: increment(1) });
  return ref;
}

// ---- Cities
export const fetchCities = async () => snapToList(await getDocs(collection(db, 'cities')));
export const fetchCity = (id) => one('cities', id);
export const addPlace = (cityId, place) => updateDoc(doc(db, 'cities', cityId), { places: arrayUnion(place) });
export const addTip = (cityId, tip) => updateDoc(doc(db, 'cities', cityId), { tips: arrayUnion(tip) });

// ---- Users
export const fetchUser = (uid) => one('users', uid);
export const updateUser = (uid, data) => setDoc(doc(db, 'users', uid), data, { merge: true });
export const setSavedEvents = (uid, savedEvents) => updateDoc(doc(db, 'users', uid), { savedEvents });
export const fetchEventsByIds = async (ids) => (await Promise.all(ids.map((id) => fetchEvent(id)))).filter(Boolean);
