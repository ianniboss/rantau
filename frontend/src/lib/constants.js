export const CITIES = [
  { id: 'paris', name: 'Paris', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200' },
  { id: 'toulouse', name: 'Toulouse', image: 'https://images.unsplash.com/photo-1650707199496-b02442055332?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200' },
  { id: 'lyon', name: 'Lyon', image: 'https://images.unsplash.com/photo-1602719092282-f027126b6b74?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200' },
  { id: 'bordeaux', name: 'Bordeaux', image: 'https://images.unsplash.com/photo-1536005566535-fc9a7a68f4c1?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200' },
  { id: 'lille', name: 'Lille', image: 'https://images.pexels.com/photos/32405354/pexels-photo-32405354.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { id: 'marseille', name: 'Marseille', image: 'https://images.unsplash.com/photo-1628025799421-5b0d37fc0624?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200' },
  { id: 'montpellier', name: 'Montpellier', image: 'https://images.unsplash.com/photo-1613283850334-9219c5fb7143?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200' },
  { id: 'nantes', name: 'Nantes', image: 'https://images.unsplash.com/photo-1601827580383-5263a5571cea?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200' },
  { id: 'strasbourg', name: 'Strasbourg', image: 'https://images.pexels.com/photos/38200805/pexels-photo-38200805.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { id: 'nice', name: 'Nice', image: 'https://images.unsplash.com/photo-1664262322738-1adaaa33cfd0?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200' },
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
