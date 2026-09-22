import { format, formatDistanceToNow, isPast } from 'date-fns';

export const toDate = (v) => (v?.toDate ? v.toDate() : v?.seconds ? new Date(v.seconds * 1000) : v ? new Date(v) : null);

export const formatDate = (v, pattern = 'EEE d MMM yyyy · HH:mm') => {
  const d = toDate(v);
  return d ? format(d, pattern) : '';
};

export const timeAgo = (v) => {
  const d = toDate(v);
  return d ? formatDistanceToNow(d, { addSuffix: true }) : 'just now';
};

export const isPastDate = (v) => {
  const d = toDate(v);
  return d ? isPast(d) : false;
};

export const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((s) => s[0].toUpperCase()).join('') || '?';

const FIREBASE_ERRORS = {
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/invalid-email': 'That email address looks invalid.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'permission-denied': "You don't have permission to do that. Are you logged in?",
  unavailable: 'Service temporarily unavailable. Please retry.',
};

export const friendlyError = (e) =>
  FIREBASE_ERRORS[e?.code] || e?.response?.data?.detail || e?.message || 'Something went wrong. Please try again.';

export const googleMapsLink = (address, city) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address || ''} ${city || ''}`.trim())}`;
