import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, MapPin, Users, Check, Star, ExternalLink, Bookmark, Trash2, ArrowLeft, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Page } from '@/components/Page';
import { DetailSkeleton } from '@/components/Skeletons';
import { EmptyState } from '@/components/EmptyState';
import { Comments } from '@/components/Comments';
import { CategoryBadge } from '@/components/CategoryBadge';
import { EVENT_CATEGORIES, cityIdFromName } from '@/lib/constants';
import { deleteEvent, fetchEvent, setRsvp, setSavedEvents } from '@/lib/db';
import { formatDate, friendlyError, googleMapsLink, isPastDate } from '@/lib/format';
import { useAuth } from '@/hooks/useAuth';
import { btnSecondary } from '@/lib/ui';

const RsvpButton = ({ active, onClick, icon: Icon, label, activeLabel, testId, tone }) => (
  <motion.button
    data-testid={testId}
    onClick={onClick}
    whileTap={{ scale: 0.95 }}
    className={`relative inline-flex min-w-[9rem] items-center justify-center gap-2 overflow-hidden rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
      active ? `${tone} text-white shadow-md` : 'border border-line bg-panel text-ink hover:bg-surface'
    }`}
  >
    <AnimatePresence mode="wait" initial={false}>
      <motion.span key={active ? 'on' : 'off'} initial={{ scale: 0.4, opacity: 0, rotate: -90 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0.4, opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }} className="grid place-items-center">
        {active ? <Check size={16} strokeWidth={3} /> : <Icon size={16} />}
      </motion.span>
    </AnimatePresence>
    {active ? activeLabel : label}
  </motion.button>
);

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, profile, isAdmin, refreshProfile } = useAuth();
  const { data: event, isLoading } = useQuery({ queryKey: ['event', id], queryFn: () => fetchEvent(id) });
  const [busy, setBusy] = useState(false);

  if (isLoading) return <Page testId="event-detail-page"><DetailSkeleton /></Page>;
  if (!event) return <Page testId="event-detail-page"><EmptyState title="Event not found" message="It may have been removed by the organizer." actionLabel="Back to events" actionTo="/events" /></Page>;

  const going = user && event.attendees?.includes(user.uid);
  const interested = user && event.interested?.includes(user.uid);
  const saved = profile?.savedEvents?.includes(id);
  const canDelete = user && (user.uid === event.organizer?.uid || isAdmin);
  const full = event.capacity && (event.attendees?.length || 0) >= event.capacity && !going;

  const requireAuth = () => {
    if (user) return true;
    toast.info('Log in to RSVP');
    navigate('/login', { state: { from: `/events/${id}` } });
    return false;
  };

  const rsvp = async (status) => {
    if (!requireAuth() || busy) return;
    setBusy(true);
    try {
      const next = (status === 'going' && going) || (status === 'interested' && interested) ? null : status;
      await setRsvp(id, user.uid, next);
      await qc.invalidateQueries({ queryKey: ['event', id] });
      qc.invalidateQueries({ queryKey: ['events'] });
      toast.success(next === 'going' ? "You're going! 🎉" : next === 'interested' ? 'Marked as interested' : 'RSVP removed');
    } catch (e) {
      toast.error(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  const toggleSave = async () => {
    if (!requireAuth()) return;
    const current = profile?.savedEvents || [];
    const next = saved ? current.filter((x) => x !== id) : [...current, id];
    try {
      await setSavedEvents(user.uid, next);
      await refreshProfile();
      toast.success(saved ? 'Removed from saved' : 'Event saved to your profile');
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  const remove = async () => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
    try {
      await deleteEvent(id);
      qc.invalidateQueries({ queryKey: ['events'] });
      toast.success('Event deleted');
      navigate('/events');
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  return (
    <Page testId="event-detail-page">
      <Link to="/events" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"><ArrowLeft size={16} /> All events</Link>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-card">
            {event.imageUrl ? <img src={event.imageUrl} alt="" className="h-64 w-full object-cover sm:h-80" /> : <div className="hero-gradient h-40 sm:h-56" />}
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge list={EVENT_CATEGORIES} value={event.category} />
                {isPastDate(event.date) && <span className="rounded-full bg-ink/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase text-ink-muted">Past event</span>}
                {event.status === 'cancelled' && <span className="rounded-full bg-my-red/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase text-my-red">Cancelled</span>}
              </div>
              <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-4xl" data-testid="event-title">{event.title}</h1>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <p className="flex items-start gap-2.5 text-sm text-ink"><Calendar size={18} className="mt-0.5 shrink-0 text-my-red" /> <span>{formatDate(event.date, 'EEEE d MMMM yyyy')}<br /><span className="text-ink-muted">{formatDate(event.date, 'HH:mm')}</span></span></p>
                <p className="flex items-start gap-2.5 text-sm text-ink"><MapPin size={18} className="mt-0.5 shrink-0 text-my-red" /> <span>{event.location?.address}<br /><Link to={`/cities/${cityIdFromName(event.location?.city)}`} className="text-ink-muted hover:underline">{event.location?.city}</Link></span></p>
              </div>
              <div className="prose-basic mt-6 whitespace-pre-wrap text-sm leading-relaxed text-ink sm:text-base" data-testid="event-description">{event.description}</div>
              {/* TODO: Google Maps embed via @react-google-maps/api once REACT_APP_GOOGLE_MAPS_API_KEY is set */}
              <a href={googleMapsLink(event.location?.address, event.location?.city)} target="_blank" rel="noreferrer" data-testid="event-maps-link" className={`${btnSecondary} mt-6`}>
                <ExternalLink size={16} /> Open in Google Maps
              </a>
            </div>
          </div>
          <div className="mt-8"><Comments parentType="event" parentId={id} /></div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-line bg-panel p-5 shadow-card" data-testid="rsvp-card">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink"><Users size={16} /> <span data-testid="attendee-count">{event.attendees?.length || 0}</span> going · {event.interested?.length || 0} interested</p>
            {event.capacity > 0 && (
              <div className="mt-3">
                <div className="h-1.5 overflow-hidden rounded-full bg-surface"><div className="h-full rounded-full bg-my-blue transition-[width] duration-500 dark:bg-my-yellow" style={{ width: `${Math.min(100, ((event.attendees?.length || 0) / event.capacity) * 100)}%` }} /></div>
                <p className="mt-1.5 text-xs text-ink-muted">{event.capacity - (event.attendees?.length || 0)} of {event.capacity} spots left</p>
              </div>
            )}
            <div className="mt-4 flex flex-col gap-2">
              <RsvpButton active={!!going} onClick={() => rsvp('going')} icon={Check} label={full ? 'Event full' : "I'm going"} activeLabel="Going" testId="rsvp-going-button" tone="bg-success" />
              <RsvpButton active={!!interested} onClick={() => rsvp('interested')} icon={Star} label="Interested" activeLabel="Interested" testId="rsvp-interested-button" tone="bg-flame" />
              <button data-testid="save-event-button" onClick={toggleSave} className={`${btnSecondary} ${saved ? '!border-my-blue text-my-blue dark:!border-my-yellow dark:text-my-yellow' : ''}`}>
                <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save event'}
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-panel p-5 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Organizer</p>
            <Link to={`/profile/${event.organizer?.uid}`} data-testid="organizer-link" className="mt-2 block font-heading font-bold text-ink hover:underline">{event.organizer?.name}</Link>
            {event.organizer?.contact && <a href={`mailto:${event.organizer.contact}`} className="mt-1 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"><Mail size={14} /> {event.organizer.contact}</a>}
            {canDelete && (
              <button data-testid="delete-event-button" onClick={remove} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-my-red hover:underline"><Trash2 size={14} /> Delete event</button>
            )}
          </div>
        </aside>
      </div>
    </Page>
  );
}
