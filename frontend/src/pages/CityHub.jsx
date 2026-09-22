import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Timestamp } from 'firebase/firestore';
import { ArrowLeft, Calendar, Lightbulb, MapPin, Plus, Utensils, ShoppingBasket, Moon, ExternalLink, Store } from 'lucide-react';
import { toast } from 'sonner';
import { Page } from '@/components/Page';
import { EventCard } from '@/components/EventCard';
import { ListSkeleton } from '@/components/Skeletons';
import { EmptyState } from '@/components/EmptyState';
import { StaggerGrid, StaggerItem } from '@/components/Stagger';
import { CITIES, PLACE_CATEGORIES, labelFor } from '@/lib/constants';
import { addPlace, addTip, fetchCity, fetchEvents } from '@/lib/db';
import { friendlyError, googleMapsLink, isPastDate, timeAgo } from '@/lib/format';
import { useAuth } from '@/hooks/useAuth';
import { btnPrimary, btnSecondary, inputCls, labelCls, pillCls } from '@/lib/ui';

const PLACE_ICONS = { restaurant: Utensils, grocery: ShoppingBasket, mosque: Moon, other: Store };

const PlaceForm = ({ cityId, onDone }) => {
  const { user, authorInfo } = useAuth();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues: { category: 'restaurant' } });
  const submit = async (v) => {
    try {
      await addPlace(cityId, { name: v.name.trim(), category: v.category, address: v.address.trim(), lat: v.lat ? Number(v.lat) : null, lng: v.lng ? Number(v.lng) : null, addedBy: user.uid, addedByName: authorInfo.name });
      reset();
      toast.success('Place suggested — thanks!');
      onDone();
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };
  return (
    <form onSubmit={handleSubmit(submit)} className="mt-4 grid gap-3 rounded-xl border border-line bg-surface p-4 sm:grid-cols-2" data-testid="place-form">
      <div><label className={labelCls}>Name</label><input data-testid="place-name-input" className={inputCls} placeholder="Restaurant Nasi Lemak" {...register('name', { required: 'Required' })} />{errors.name && <p className="mt-1 text-xs text-my-red">{errors.name.message}</p>}</div>
      <div><label className={labelCls}>Type</label><select data-testid="place-category-input" className={inputCls} {...register('category')}>{PLACE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
      <div className="sm:col-span-2"><label className={labelCls}>Address</label><input data-testid="place-address-input" className={inputCls} placeholder="3 Rue des Filatiers" {...register('address', { required: 'Required' })} /></div>
      <div><label className={labelCls}>Latitude <span className="text-ink-muted">(optional)</span></label><input data-testid="place-lat-input" className={inputCls} placeholder="43.6045" {...register('lat')} /></div>
      <div><label className={labelCls}>Longitude <span className="text-ink-muted">(optional)</span></label><input data-testid="place-lng-input" className={inputCls} placeholder="1.4442" {...register('lng')} /></div>
      <button data-testid="place-submit-button" disabled={isSubmitting} className={`${btnPrimary} sm:col-span-2`}>Add place</button>
    </form>
  );
};

export default function CityHub() {
  const { cityId } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, authorInfo } = useAuth();
  const meta = CITIES.find((c) => c.id === cityId);
  const { data: city, isLoading } = useQuery({ queryKey: ['city', cityId], queryFn: () => fetchCity(cityId) });
  const { data: events, isLoading: eventsLoading } = useQuery({ queryKey: ['events'], queryFn: fetchEvents });
  const [placeFilter, setPlaceFilter] = useState('');
  const [showPlaceForm, setShowPlaceForm] = useState(false);
  const [tip, setTip] = useState('');
  const [sendingTip, setSendingTip] = useState(false);

  if (!meta) return <Page><EmptyState title="Unknown city" message="We don't have a hub for that city yet." actionLabel="All cities" actionTo="/cities" /></Page>;

  const name = meta.name;
  const local = (events || []).filter((e) => e.location?.city === name && !isPastDate(e.date)).slice(0, 6);
  const places = (city?.places || []).filter((p) => !placeFilter || p.category === placeFilter);
  const tips = [...(city?.tips || [])].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

  const requireAuth = () => {
    if (user) return true;
    toast.info('Log in to contribute');
    navigate('/login', { state: { from: `/cities/${cityId}` } });
    return false;
  };

  const submitTip = async (e) => {
    e.preventDefault();
    if (!tip.trim() || !requireAuth()) return;
    setSendingTip(true);
    try {
      await addTip(cityId, { text: tip.trim(), addedBy: user.uid, addedByName: authorInfo.name, createdAt: Timestamp.now() });
      setTip('');
      qc.invalidateQueries({ queryKey: ['city', cityId] });
      toast.success('Tip shared');
    } catch (err) {
      toast.error(friendlyError(err));
    } finally {
      setSendingTip(false);
    }
  };

  return (
    <Page wide className="w-full" testId="city-hub-page">
      <section className="relative -mt-16 h-72 overflow-hidden pt-16 sm:h-80">
        {meta.image ? <img src={meta.image} alt={name} className="absolute inset-0 h-full w-full object-cover" /> : <div className="hero-gradient absolute inset-0" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/20" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-8 text-white sm:px-6 lg:px-8">
          <Link to="/cities" className="mb-auto mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/80 hover:text-white"><ArrowLeft size={16} /> All cities</Link>
          <p className="text-xs font-semibold uppercase tracking-wider text-my-yellow">City hub</p>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl" data-testid="city-name">{name}</h1>
          <p className="mt-2 text-sm text-white/80">{city?.studentCount || 0} Malaysian students · {city?.places?.length || 0} places · {local.length} upcoming events</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-10 sm:px-6 lg:px-8">
        <section data-testid="city-events">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-ink"><Calendar size={20} className="text-my-red" /> Upcoming in {name}</h2>
            <Link to="/events/new" className={`${btnSecondary} !py-2`}><Plus size={14} /> Add event</Link>
          </div>
          {eventsLoading ? <ListSkeleton count={3} /> : local.length === 0 ? (
            <EmptyState icon={Calendar} title={`Nothing scheduled in ${name} yet`} message="Organise a makan or a study session and it'll show up here." actionLabel="Create an event" actionTo="/events/new" testId="city-events-empty" />
          ) : (
            <StaggerGrid>{local.map((e) => <StaggerItem key={e.id}><EventCard event={e} /></StaggerItem>)}</StaggerGrid>
          )}
        </section>

        <div className="grid gap-8 lg:grid-cols-5">
          <section className="lg:col-span-3" data-testid="city-places">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-heading text-2xl font-bold text-ink"><MapPin size={20} className="text-my-red" /> Places to know</h2>
              <button data-testid="suggest-place-button" onClick={() => requireAuth() && setShowPlaceForm((s) => !s)} className={`${btnPrimary} !py-2`}><Plus size={14} /> Suggest a place</button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button data-testid="place-filter-all" onClick={() => setPlaceFilter('')} className={pillCls(!placeFilter)}>All</button>
              {PLACE_CATEGORIES.map((c) => <button key={c.value} data-testid={`place-filter-${c.value}`} onClick={() => setPlaceFilter(c.value)} className={pillCls(placeFilter === c.value)}>{c.label}</button>)}
            </div>
            {showPlaceForm && user && <PlaceForm cityId={cityId} onDone={() => { setShowPlaceForm(false); qc.invalidateQueries({ queryKey: ['city', cityId] }); }} />}
            {/* TODO: render Google Map with pins (lat/lng) via @react-google-maps/api when API key is configured */}
            <div className="mt-4 space-y-3">
              {isLoading && [0, 1, 2].map((i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
              {!isLoading && places.length === 0 && <EmptyState icon={Utensils} title="No places listed yet" message="Know a halal spot or an Asian grocery here? Suggest it and help the next arrival." testId="places-empty" />}
              {places.map((p, i) => {
                const Icon = PLACE_ICONS[p.category] || Store;
                return (
                  <div key={`${p.name}-${i}`} data-testid={`place-item-${i}`} className="flex items-center gap-4 rounded-xl border border-line bg-panel p-4 shadow-card">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-my-blue/10 text-my-blue dark:bg-my-yellow/15 dark:text-my-yellow"><Icon size={18} /></span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-ink">{p.name}</p>
                      <p className="truncate text-xs text-ink-muted">{labelFor(PLACE_CATEGORIES, p.category)} · {p.address}</p>
                    </div>
                    <a href={googleMapsLink(p.address, name)} target="_blank" rel="noreferrer" className="text-ink-muted hover:text-ink" aria-label="Open in maps"><ExternalLink size={16} /></a>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="lg:col-span-2" data-testid="city-tips">
            <h2 className="mb-4 flex items-center gap-2 font-heading text-2xl font-bold text-ink"><Lightbulb size={20} className="text-my-yellow" /> Local tips</h2>
            <form onSubmit={submitTip} className="rounded-xl border border-line bg-panel p-4 shadow-card">
              <textarea data-testid="tip-input" value={tip} onChange={(e) => setTip(e.target.value)} rows={3} maxLength={500} placeholder={`Something every new student in ${name} should know…`} className={inputCls} />
              <button data-testid="tip-submit-button" disabled={sendingTip || !tip.trim()} className={`${btnPrimary} mt-3 w-full`}>Share tip</button>
            </form>
            <ul className="mt-4 space-y-3">
              {!isLoading && tips.length === 0 && <li className="text-sm text-ink-muted" data-testid="tips-empty">No tips yet. Yours could be the first.</li>}
              {tips.map((t, i) => (
                <li key={i} data-testid={`tip-item-${i}`} className="rounded-xl border-l-4 border-my-yellow bg-panel p-4 shadow-card">
                  <p className="text-sm text-ink">{t.text}</p>
                  <p className="mt-2 text-xs text-ink-muted">— {t.addedByName || 'a student'}, {timeAgo(t.createdAt)}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </Page>
  );
}
