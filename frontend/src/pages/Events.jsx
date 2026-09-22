import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Plus, Search } from 'lucide-react';
import { Page, PageHeader } from '@/components/Page';
import { EventCard } from '@/components/EventCard';
import { ListSkeleton } from '@/components/Skeletons';
import { EmptyState, ErrorState } from '@/components/EmptyState';
import { StaggerGrid, StaggerItem } from '@/components/Stagger';
import { CITY_NAMES, EVENT_CATEGORIES } from '@/lib/constants';
import { fetchEvents } from '@/lib/db';
import { toDate, friendlyError } from '@/lib/format';
import { btnPrimary, inputCls, pillCls } from '@/lib/ui';

export default function Events() {
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['events'], queryFn: fetchEvents });
  const [q, setQ] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [showPast, setShowPast] = useState(false);

  const list = useMemo(() => {
    const now = new Date();
    return (data || []).filter((e) => {
      const d = toDate(e.date);
      if (!showPast && d && d < now) return false;
      if (city && e.location?.city !== city) return false;
      if (category && e.category !== category) return false;
      if (from && d && d < new Date(from)) return false;
      if (to && d && d > new Date(`${to}T23:59:59`)) return false;
      if (q) {
        const s = q.toLowerCase();
        return `${e.title} ${e.description} ${e.organizer?.name} ${e.location?.address}`.toLowerCase().includes(s);
      }
      return true;
    });
  }, [data, q, city, category, from, to, showPast]);

  return (
    <Page testId="events-page">
      <PageHeader
        eyebrow="Events"
        title="What's on across France"
        subtitle="Cultural nights, study sessions, futsal and everything in between."
        action={<Link to="/events/new" data-testid="create-event-button" className={btnPrimary}><Plus size={16} /> Create event</Link>}
      />

      <div className="mb-6 rounded-xl border border-line bg-panel p-4 shadow-card" data-testid="event-filters">
        <div className="grid gap-3 md:grid-cols-4">
          <label className="relative md:col-span-2">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input data-testid="event-search-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events…" className={`${inputCls} pl-9`} />
          </label>
          <select data-testid="event-city-filter" value={city} onChange={(e) => setCity(e.target.value)} className={inputCls}>
            <option value="">All cities</option>
            {CITY_NAMES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" data-testid="event-date-from" value={from} onChange={(e) => setFrom(e.target.value)} className={inputCls} aria-label="From date" />
            <input type="date" data-testid="event-date-to" value={to} onChange={(e) => setTo(e.target.value)} className={inputCls} aria-label="To date" />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button data-testid="event-category-all" onClick={() => setCategory('')} className={pillCls(!category)}>All</button>
          {EVENT_CATEGORIES.map((c) => (
            <button key={c.value} data-testid={`event-category-${c.value}`} onClick={() => setCategory(c.value)} className={pillCls(category === c.value)}>{c.label}</button>
          ))}
          <label className="ml-auto inline-flex items-center gap-2 text-sm text-ink-muted">
            <input type="checkbox" data-testid="event-show-past" checked={showPast} onChange={(e) => setShowPast(e.target.checked)} className="h-4 w-4 accent-[#010066]" /> Show past events
          </label>
        </div>
      </div>

      {error ? <ErrorState message={friendlyError(error)} onRetry={refetch} /> : isLoading ? <ListSkeleton /> : list.length === 0 ? (
        <EmptyState icon={Calendar} title="No events match" message={data?.length ? 'Try clearing a filter, or create the event you wish existed.' : 'Nothing has been posted yet. Kick things off with the first event!'} actionLabel="Create an event" actionTo="/events/new" testId="events-empty" />
      ) : (
        <StaggerGrid testId="events-grid">
          {list.map((e) => <StaggerItem key={e.id}><EventCard event={e} /></StaggerItem>)}
        </StaggerGrid>
      )}
      {!isLoading && !error && <p className="mt-6 text-sm text-ink-muted" data-testid="events-count">{list.length} event{list.length === 1 ? '' : 's'}</p>}
    </Page>
  );
}
