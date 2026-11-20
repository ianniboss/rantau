import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Lightbulb, MapPin, ArrowRight } from 'lucide-react';
import { CITIES, cityIdFromName } from '@/lib/constants';
import { fetchCity } from '@/lib/db';
import { formatDate, isPastDate, timeAgo } from '@/lib/format';
import { useAuth } from '@/hooks/useAuth';
import { inputCls, focusRing } from '@/lib/ui';

export const WeeklyDigest = ({ events = [], loading }) => {
  const { profile } = useAuth();
  const [cityId, setCityId] = useState(() => localStorage.getItem('rantau-city') || 'toulouse');

  useEffect(() => {
    if (profile?.city) setCityId(cityIdFromName(profile.city));
  }, [profile?.city]);

  const city = CITIES.find((c) => c.id === cityId) || CITIES[1];
  const { data: cityDoc, isLoading } = useQuery({ queryKey: ['city', city.id], queryFn: () => fetchCity(city.id) });

  const upcoming = events.filter((e) => e.location?.city === city.name && !isPastDate(e.date) && e.status !== 'cancelled').slice(0, 3);
  const tips = [...(cityDoc?.tips || [])].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 3);

  const change = (id) => { setCityId(id); localStorage.setItem('rantau-city', id); };

  return (
    <section data-testid="weekly-digest" className="mt-16 overflow-hidden rounded-2xl border border-line bg-panel shadow-card sm:mt-20">
      <div className="flex flex-col gap-4 border-b border-line px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-my-red">Your city</p>
          <h2 className="font-heading text-2xl font-bold text-ink sm:text-3xl">This week in {city.name}</h2>
        </div>
        <label htmlFor="digest-city" className="flex flex-col gap-1.5 text-xs font-semibold text-ink-muted sm:w-44 sm:shrink-0">
          <span className="flex items-center gap-1.5"><MapPin size={14} aria-hidden="true" /> Selected city</span>
          <select id="digest-city" data-testid="digest-city-select" value={city.id} onChange={(e) => change(e.target.value)} className={`${inputCls} min-h-[44px] border-2 border-my-blue bg-surface font-semibold hover:border-ink dark:border-my-yellow dark:hover:border-ink`}>
            {CITIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
      </div>
      <div className="grid md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:divide-x md:divide-line lg:grid-cols-2">
        <div className="min-w-0 p-4 sm:p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink"><Calendar size={16} className="text-my-red" /> Next events</h3>
          <ul className="mt-4 space-y-3" data-testid="digest-events">
            {loading && [0, 1, 2].map((i) => <li key={i} className="skeleton h-12 rounded-lg" />)}
            {!loading && upcoming.length === 0 && <li className="text-sm text-ink-muted" data-testid="digest-events-empty">Nothing scheduled yet in {city.name}. <Link to="/events/new" className={`inline-flex min-h-[44px] items-center rounded-md font-semibold text-my-blue underline dark:text-my-yellow ${focusRing}`}>Organise one?</Link></li>}
            {upcoming.map((e) => (
              <li key={e.id}>
                <Link to={`/events/${e.id}`} data-testid={`digest-event-${e.id}`} className={`group -mx-2 flex min-h-[44px] items-center gap-3 rounded-lg p-2 transition-colors hover:bg-surface ${focusRing}`}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-my-blue/10 text-center leading-none dark:bg-my-yellow/15">
                    <span className="block text-[10px] font-bold uppercase text-my-red">{formatDate(e.date, 'MMM')}</span>
                    <span className="block font-heading text-base font-extrabold text-ink">{formatDate(e.date, 'd')}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{e.title}</span>
                    <span className="block text-xs text-ink-muted">{formatDate(e.date, 'EEE HH:mm')} · {e.attendees?.length || 0} going</span>
                  </span>
                  <ArrowRight size={16} className="shrink-0 text-ink-muted transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0 border-t border-line p-4 sm:p-6 md:border-t-0">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink"><Lightbulb size={16} className="text-my-yellow" /> Newest tips</h3>
          <ul className="mt-4 space-y-3" data-testid="digest-tips">
            {isLoading && [0, 1].map((i) => <li key={i} className="skeleton h-12 rounded-lg" />)}
            {!isLoading && tips.length === 0 && <li className="text-sm text-ink-muted" data-testid="digest-tips-empty">No tips for {city.name} yet. <Link to={`/cities/${city.id}`} className={`inline-flex min-h-[44px] items-center rounded-md font-semibold text-my-blue underline dark:text-my-yellow ${focusRing}`}>Share the first</Link></li>}
            {tips.map((t, i) => (
              <li key={i} data-testid={`digest-tip-${i}`} className="rounded-lg border-l-4 border-my-yellow bg-surface px-3 py-2">
                <p className="text-sm text-ink line-clamp-2">{t.text}</p>
                <p className="mt-1 text-[11px] text-ink-muted">— {t.addedByName || 'a student'}, {timeAgo(t.createdAt)}</p>
              </li>
            ))}
          </ul>
          <Link to={`/cities/${city.id}`} data-testid="digest-city-link" className={`mt-4 inline-flex min-h-[44px] items-center gap-1 rounded-md text-sm font-semibold text-my-blue hover:underline dark:text-my-yellow ${focusRing}`}>Open {city.name} hub <ArrowRight size={14} /></Link>
        </div>
      </div>
    </section>
  );
};
