export const CITIES = [
  { id: 'paris', name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?crop=entropy&cs=srgb&fm=jpg&q=80&w=900' },
  { id: 'toulouse', name: 'Toulouse', image: 'https://images.pexels.com/photos/30753236/pexels-photo-30753236.jpeg?auto=compress&cs=tinysrgb&q=80&w=900' },
  { id: 'lyon', name: 'Lyon', image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?crop=entropy&cs=srgb&fm=jpg&q=80&w=900' },
  { id: 'bordeaux', name: 'Bordeaux', image: null },
  { id: 'lille', name: 'Lille', image: null },
  { id: 'marseille', name: 'Marseille', image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?crop=entropy&cs=srgb&fm=jpg&q=80&w=900' },
  { id: 'montpellier', name: 'Montpellier', image: null },
  { id: 'nantes', name: 'Nantes', image: null },
  { id: 'strasbourg', name: 'Strasbourg', image: null },
  { id: 'nice', name: 'Nice', image: null },
];

export const CITY_NAMES = CITIES.map((c) => c.name);
export const cityIdFromName = (name) => CITIES.find((c) => c.name === name)?.id || name?.toLowerCase();

export const EVENT_CATEGORIES = [
  { value: 'cultural', label: 'Cultural', color: 'bg-my-red/10 text-my-red dark:bg-my-red/20 dark:text-red-300' },
  { value: 'academic', label: 'Academic', color: 'bg-my-blue/10 text-my-blue dark:bg-blue-400/20 dark:text-blue-200' },
  { value: 'social', label: 'Social', color: 'bg-flame/10 text-flame dark:bg-flame/20 dark:text-orange-300' },
  { value: 'sports', label: 'Sports', color: 'bg-success/10 text-emerald-700 dark:bg-success/20 dark:text-emerald-300' },
];

export const RESOURCE_CATEGORIES = [
  { value: 'administrative', label: 'Administrative Guides', color: 'bg-my-blue/10 text-my-blue dark:bg-blue-400/20 dark:text-blue-200' },
  { value: 'academic', label: 'Academic', color: 'bg-my-red/10 text-my-red dark:bg-my-red/20 dark:text-red-300' },
  { value: 'living', label: 'Living in France', color: 'bg-flame/10 text-flame dark:bg-flame/20 dark:text-orange-300' },
  { value: 'community', label: 'Community', color: 'bg-success/10 text-emerald-700 dark:bg-success/20 dark:text-emerald-300' },
];

export const POST_CATEGORIES = [
  { value: 'housing', label: 'Housing & Accommodation', color: 'bg-my-blue/10 text-my-blue dark:bg-blue-400/20 dark:text-blue-200' },
  { value: 'marketplace', label: 'Marketplace', color: 'bg-flame/10 text-flame dark:bg-flame/20 dark:text-orange-300' },
  { value: 'study_group', label: 'Study Groups', color: 'bg-success/10 text-emerald-700 dark:bg-success/20 dark:text-emerald-300' },
  { value: 'general', label: 'General Discussion', color: 'bg-ink/10 text-ink dark:bg-white/10' },
  { value: 'jobs', label: 'Jobs & Internships', color: 'bg-my-red/10 text-my-red dark:bg-my-red/20 dark:text-red-300' },
];

export const PLACE_CATEGORIES = [
  { value: 'restaurant', label: 'Halal restaurant' },
  { value: 'grocery', label: 'Asian grocery' },
  { value: 'mosque', label: 'Mosque / prayer room' },
  { value: 'other', label: 'Other' },
];

export const YEARS = [1, 2, 3, 4, 5, 6];

export const CITY_CENTERS = {
  paris: { lat: 48.8566, lng: 2.3522 },
  toulouse: { lat: 43.6045, lng: 1.4442 },
  lyon: { lat: 45.764, lng: 4.8357 },
  bordeaux: { lat: 44.8378, lng: -0.5792 },
  lille: { lat: 50.6292, lng: 3.0573 },
  marseille: { lat: 43.2965, lng: 5.3698 },
  montpellier: { lat: 43.6108, lng: 3.8767 },
  nantes: { lat: 47.2184, lng: -1.5536 },
  strasbourg: { lat: 48.5734, lng: 7.7521 },
  nice: { lat: 43.7102, lng: 7.262 },
};

export const ROLE_LABELS = { user: 'Student', contributor: 'Contributor', organizer: 'Organizer', admin: 'Admin' };

export const labelFor = (list, value) => list.find((c) => c.value === value)?.label || value;
export const colorFor = (list, value) => list.find((c) => c.value === value)?.color || 'bg-ink/10 text-ink';
