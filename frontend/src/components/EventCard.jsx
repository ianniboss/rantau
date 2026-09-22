import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users } from 'lucide-react';
import { EVENT_CATEGORIES } from '@/lib/constants';
import { formatDate, isPastDate, toDate } from '@/lib/format';
import { CategoryBadge } from './CategoryBadge';

export const EventCard = ({ event }) => {
  const d = toDate(event.date);
  const past = isPastDate(event.date);
  return (
    <Link
      to={`/events/${event.id}`}
      data-testid={`event-card-${event.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-panel shadow-card transition-shadow duration-200 hover:shadow-lift"
    >
      <div className="relative h-40 overflow-hidden bg-my-blue/5">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
        ) : (
          <div className="hero-gradient h-full w-full opacity-80" />
        )}
        {d && (
          <div className="absolute left-3 top-3 rounded-lg bg-panel px-2.5 py-1.5 text-center shadow-card">
            <p className="text-[10px] font-bold uppercase tracking-wide text-my-red">{formatDate(d, 'MMM')}</p>
            <p className="-mt-0.5 font-heading text-lg font-extrabold leading-none text-ink">{formatDate(d, 'd')}</p>
          </div>
        )}
        {past && <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-2 py-0.5 text-[11px] font-semibold text-white">Past</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <CategoryBadge list={EVENT_CATEGORIES} value={event.category} />
        <h3 className="mt-2.5 font-heading text-base font-bold leading-snug text-ink sm:text-lg line-clamp-2">{event.title}</h3>
        <div className="mt-3 space-y-1.5 text-sm text-ink-muted">
          <p className="flex items-center gap-2"><Calendar size={14} /> {formatDate(event.date)}</p>
          <p className="flex items-center gap-2"><MapPin size={14} /> {event.location?.city}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-4 text-xs text-ink-muted">
          <span className="truncate">by {event.organizer?.name}</span>
          <span className="inline-flex items-center gap-1 font-medium"><Users size={13} /> {event.attendees?.length || 0} going</span>
        </div>
      </div>
    </Link>
  );
};
