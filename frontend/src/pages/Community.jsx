import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MessagesSquare, Plus } from 'lucide-react';
import { Page, PageHeader } from '@/components/Page';
import { PostCard } from '@/components/PostCard';
import { ListSkeleton } from '@/components/Skeletons';
import { EmptyState, ErrorState } from '@/components/EmptyState';
import { StaggerGrid, StaggerItem } from '@/components/Stagger';
import { CITY_NAMES, POST_CATEGORIES } from '@/lib/constants';
import { fetchPosts } from '@/lib/db';
import { friendlyError } from '@/lib/format';
import { btnPrimary, inputCls, pillCls } from '@/lib/ui';

export default function Community() {
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['posts'], queryFn: fetchPosts });
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  const list = useMemo(() =>
    (data || []).filter((p) => (!category || p.category === category) && (!city || p.city === city)).sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)),
  [data, category, city]);

  return (
    <Page testId="community-page">
      <PageHeader
        eyebrow="Community board"
        title="Ask, offer, organise"
        subtitle="Housing leads, second-hand deals, study groups and general chatter."
        action={<Link to="/community/new" data-testid="create-post-button" className={btnPrimary}><Plus size={16} /> New post</Link>}
      />
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between" data-testid="post-filters">
        <div className="flex flex-wrap gap-2">
          <button data-testid="post-category-all" onClick={() => setCategory('')} className={pillCls(!category)}>All</button>
          {POST_CATEGORIES.map((c) => (
            <button key={c.value} data-testid={`post-category-${c.value}`} onClick={() => setCategory(c.value)} className={pillCls(category === c.value)}>{c.label}</button>
          ))}
        </div>
        <select data-testid="post-city-filter" value={city} onChange={(e) => setCity(e.target.value)} className={`${inputCls} md:w-48`}>
          <option value="">All cities</option>
          {CITY_NAMES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {error ? <ErrorState message={friendlyError(error)} onRetry={refetch} /> : isLoading ? <ListSkeleton count={4} image={false} cols="grid-cols-1" /> : list.length === 0 ? (
        <EmptyState icon={MessagesSquare} title="No posts here yet" message="Every good thread starts with someone asking. Go on." actionLabel="Write the first post" actionTo="/community/new" testId="posts-empty" />
      ) : (
        <StaggerGrid className="grid grid-cols-1 gap-4" testId="posts-list">
          {list.map((p) => <StaggerItem key={p.id} hover={false}><PostCard post={p} /></StaggerItem>)}
        </StaggerGrid>
      )}
    </Page>
  );
}
