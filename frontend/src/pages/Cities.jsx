import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Users, ArrowRight } from 'lucide-react';
import { Page, PageHeader } from '@/components/Page';
import { StaggerGrid, StaggerItem } from '@/components/Stagger';
import { CITIES } from '@/lib/constants';
import { fetchCities, fetchEvents } from '@/lib/db';
import { isPastDate } from '@/lib/format';
import { focusRing } from '@/lib/ui';

const GRADIENTS = ['from-my-blue to-[#4a4ab8]', 'from-my-red to-flame', 'from-[#7a0a3a] to-my-red', 'from-[#0b3d91] to-my-blue', 'from-flame to-my-yellow', 'from-[#1b1b6b] to-[#7a0a3a]'];

export default function Cities() {
  const { data: cities } = useQuery({ queryKey: ['cities'], queryFn: fetchCities });
  const { data: events } = useQuery({ queryKey: ['events'], queryFn: fetchEvents });
  const byId = Object.fromEntries((cities || []).map((c) => [c.id, c]));
  const upcomingCount = (name) => (events || []).filter((e) => e.location?.city === name && !isPastDate(e.date)).length;

  return (
    <Page testId="cities-page">
      <PageHeader eyebrow="City hubs" title="Where are you based?" subtitle="Each city hub gathers local events, halal food & grocery spots, and tips from students on the ground." />
      <StaggerGrid className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" testId="cities-grid">
        {CITIES.map((c, i) => (
          <StaggerItem key={c.id} hover={false}>
            <Link to={`/cities/${c.id}`} data-testid={`city-card-${c.id}`} className={`group relative block h-52 overflow-hidden rounded-2xl border border-line shadow-card transition-[box-shadow,transform] duration-200 hover:-translate-y-1 hover:shadow-lift focus-visible:-translate-y-1 focus-visible:shadow-lift motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0 ${focusRing}`}>
              {c.image ? (
                <img src={c.image} alt={c.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:group-hover:scale-100 motion-reduce:group-focus-visible:scale-100" />
              ) : (
                <div className={`h-full w-full bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}`} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
                <div className="min-w-0">
                  <h3 className="font-heading text-2xl font-extrabold">{c.name}</h3>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/85">
                    <span className="inline-flex items-center gap-1"><Users size={12} /> {byId[c.id]?.studentCount || 0} students</span>
                    <span className="inline-flex items-center gap-1"><MapPin size={12} /> {byId[c.id]?.places?.length || 0} places</span>
                    <span>{upcomingCount(c.name)} upcoming</span>
                  </p>
                </div>
                <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur transition-[background-color,transform] group-hover:translate-x-1 group-hover:bg-my-yellow group-hover:text-[#010066] group-focus-visible:translate-x-1 group-focus-visible:bg-my-yellow group-focus-visible:text-[#010066] motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0"><ArrowRight size={16} /></span>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </Page>
  );
}
