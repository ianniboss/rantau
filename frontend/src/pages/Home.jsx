import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Calendar, FileText, Users, MapPin, Landmark, HeartPulse, GraduationCap, Sparkles } from 'lucide-react';
import { Page } from '@/components/Page';
import { EventCard } from '@/components/EventCard';
import { ResourceCard } from '@/components/ResourceCard';
import { PostCard } from '@/components/PostCard';
import { ListSkeleton } from '@/components/Skeletons';
import { EmptyState } from '@/components/EmptyState';
import { StaggerGrid, StaggerItem } from '@/components/Stagger';
import { WeeklyDigest } from '@/components/WeeklyDigest';
import { CITIES } from '@/lib/constants';
import { fetchEvents, fetchPosts, fetchResources } from '@/lib/db';
import { isPastDate } from '@/lib/format';
import { seedIfEmpty } from '@/lib/seed';
import { useAuth } from '@/hooks/useAuth';
import { btnSecondary } from '@/lib/ui';

const fade = (delay) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, delay, ease: 'easeOut' } });

const QUICK_LINKS = [
  { icon: Landmark, title: 'CAF housing aid', text: 'Apply for APL without a social security number', href: 'https://www.caf.fr' },
  { icon: HeartPulse, title: 'Ameli registration', text: 'Enter the French health system as a new student', href: 'https://etudiant-etranger.ameli.fr' },
  { icon: GraduationCap, title: 'Campus France', text: 'Visas, scholarships and arrival guides', href: 'https://www.campusfrance.org/en' },
];

const Section = ({ title, subtitle, to, children, testId }) => (
  <section className="mt-16 sm:mt-20" data-testid={testId}>
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-ink-muted sm:text-base">{subtitle}</p>}
      </div>
      <Link to={to} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-my-blue hover:gap-2 dark:text-my-yellow" style={{ transition: 'gap 150ms' }}>
        View all <ArrowRight size={16} />
      </Link>
    </div>
    {children}
  </section>
);

export default function Home() {
  const { user } = useAuth();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 400], [0, -60]);
  const y2 = useTransform(scrollY, [0, 400], [0, -30]);
  const y3 = useTransform(scrollY, [0, 400], [0, -90]);

  useEffect(() => { seedIfEmpty(); }, []);

  const events = useQuery({ queryKey: ['events'], queryFn: fetchEvents });
  const resources = useQuery({ queryKey: ['resources'], queryFn: fetchResources });
  const posts = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });

  const upcoming = (events.data || []).filter((e) => !isPastDate(e.date) && e.status !== 'cancelled').slice(0, 3);
  const popular = (resources.data || []).sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes) || (b.downloads || 0) - (a.downloads || 0)).slice(0, 3);
  const recent = (posts.data || []).slice(0, 3);

  return (
    <Page wide className="w-full" testId="home-page">
      <section className="hero-gradient grain relative -mt-16 overflow-hidden pt-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-7">
            <motion.p {...fade(0)} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
              <Sparkles size={13} className="text-my-yellow" /> For Malaysian students in France
            </motion.p>
            <motion.h1 {...fade(0.08)} className="mt-6 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Your <span className="text-my-yellow">rantau</span> in France, made simpler.
            </motion.h1>
            <motion.p {...fade(0.18)} className="mt-6 max-w-xl text-base text-white/80 sm:text-lg">
              Events, CAF & Ameli guides, housing tips and a community board — one hub for Malaysian students from Toulouse to Paris.
            </motion.p>
            <motion.div {...fade(0.28)} className="mt-8 flex flex-wrap gap-3">
              <Link to="/resources" data-testid="hero-resources-cta" className="inline-flex items-center gap-2 rounded-lg bg-my-yellow px-5 py-3 text-sm font-bold text-[#010066] shadow-lg transition-transform active:scale-95 hover:bg-[#ffdb33]">
                <FileText size={16} /> Browse admin guides
              </Link>
              <Link to={user ? '/events' : '/signup'} data-testid="hero-join-cta" className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-[background-color,transform] hover:bg-white/20 active:scale-95">
                {user ? 'Find events' : 'Join the community'} <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
          <div className="relative hidden lg:col-span-5 lg:block">
            <motion.div style={{ y: y1 }} className="absolute left-4 top-6 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md animate-float">
              <Calendar size={26} className="text-my-yellow" /><p className="mt-2 text-xs font-semibold">Events</p>
            </motion.div>
            <motion.div style={{ y: y2 }} className="absolute right-6 top-24 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md animate-float [animation-delay:1.5s]">
              <FileText size={26} className="text-my-yellow" /><p className="mt-2 text-xs font-semibold">Guides</p>
            </motion.div>
            <motion.div style={{ y: y3 }} className="absolute bottom-4 left-24 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md animate-float [animation-delay:3s]">
              <Users size={26} className="text-my-yellow" /><p className="mt-2 text-xs font-semibold">Community</p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <StaggerGrid className="relative z-10 -mt-10 grid grid-cols-1 gap-4 sm:-mt-14 md:grid-cols-3" testId="quick-links">
          {QUICK_LINKS.map((q) => (
            <StaggerItem key={q.title}>
              <a href={q.href} target="_blank" rel="noreferrer" data-testid={`quick-link-${q.title.split(' ')[0].toLowerCase()}`} className="flex h-full items-start gap-4 rounded-xl border border-line bg-panel p-5 shadow-lift">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-my-blue/10 text-my-blue dark:bg-my-yellow/15 dark:text-my-yellow"><q.icon size={22} /></span>
                <span>
                  <span className="block font-heading font-bold text-ink">{q.title}</span>
                  <span className="mt-0.5 block text-sm text-ink-muted">{q.text}</span>
                </span>
              </a>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <WeeklyDigest events={events.data || []} loading={events.isLoading} />

        <Section title="Upcoming events" subtitle="Makan, study sessions, futsal — see what's happening near you." to="/events" testId="home-events">
          {events.isLoading ? <ListSkeleton count={3} /> : upcoming.length === 0 ? (
            <EmptyState icon={Calendar} title="No upcoming events yet" message="Be the first to organise something — a potluck, a study group or a weekend trip." actionLabel="Create an event" actionTo="/events/new" testId="home-events-empty" />
          ) : (
            <StaggerGrid>{upcoming.map((e) => <StaggerItem key={e.id}><EventCard event={e} /></StaggerItem>)}</StaggerGrid>
          )}
        </Section>

        <Section title="Popular resources" subtitle="Top-voted guides from the community and official portals." to="/resources" testId="home-resources">
          {resources.isLoading ? <ListSkeleton count={3} image={false} /> : popular.length === 0 ? (
            <EmptyState icon={FileText} title="No resources yet" message="Official guides will appear here once the library is seeded." actionLabel="Open the library" actionTo="/resources" testId="home-resources-empty" />
          ) : (
            <StaggerGrid>{popular.map((r) => <StaggerItem key={r.id}><ResourceCard resource={r} /></StaggerItem>)}</StaggerGrid>
          )}
        </Section>

        <Section title="From the community board" subtitle="Housing, marketplace, study groups and more." to="/community" testId="home-posts">
          {posts.isLoading ? <ListSkeleton count={2} image={false} cols="grid-cols-1" /> : recent.length === 0 ? (
            <EmptyState icon={Users} title="Quiet in here" message="Start a discussion — ask about housing, sell a bike, find a study buddy." actionLabel="Write a post" actionTo="/community/new" testId="home-posts-empty" />
          ) : (
            <StaggerGrid className="grid grid-cols-1 gap-4">{recent.map((p) => <StaggerItem key={p.id} hover={false}><PostCard post={p} /></StaggerItem>)}</StaggerGrid>
          )}
        </Section>

        <section className="my-16 rounded-2xl border border-line bg-panel p-6 sm:my-20 sm:p-10" data-testid="home-cities">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-tight text-ink sm:text-3xl">Pick your city</h2>
              <p className="mt-1 text-sm text-ink-muted sm:text-base">Local events, halal spots, groceries and tips from students already there.</p>
            </div>
            <Link to="/cities" className={btnSecondary}>All cities <ArrowRight size={16} /></Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <Link key={c.id} to={`/cities/${c.id}`} data-testid={`home-city-${c.id}`} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-ink transition-[background-color,color,transform] hover:bg-my-blue hover:text-white active:scale-95 dark:hover:bg-my-yellow dark:hover:text-[#010066]">
                <MapPin size={14} /> {c.name}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Page>
  );
}
