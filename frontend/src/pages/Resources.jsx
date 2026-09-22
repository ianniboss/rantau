import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FileText, Plus, Search } from 'lucide-react';
import { Page, PageHeader } from '@/components/Page';
import { ResourceCard } from '@/components/ResourceCard';
import { ListSkeleton } from '@/components/Skeletons';
import { EmptyState, ErrorState } from '@/components/EmptyState';
import { StaggerGrid, StaggerItem } from '@/components/Stagger';
import { RESOURCE_CATEGORIES } from '@/lib/constants';
import { fetchResources } from '@/lib/db';
import { friendlyError } from '@/lib/format';
import { useAuth } from '@/hooks/useAuth';
import { btnPrimary, inputCls, pillCls } from '@/lib/ui';

export default function Resources() {
  const { user, isAdmin } = useAuth();
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['resources'], queryFn: fetchResources });
  const [tab, setTab] = useState('');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('popular');
  const [localDownloads, setLocalDownloads] = useState({});

  const list = useMemo(() => {
    const s = q.toLowerCase().trim();
    const visible = (data || []).filter((r) => r.status === 'approved' || isAdmin || (user && r.uploadedBy?.uid === user.uid));
    const filtered = visible.filter((r) => (!tab || r.category === tab) && (!s || r.title.toLowerCase().includes(s) || r.tags?.some((t) => t.toLowerCase().includes(s))));
    return filtered.sort((a, b) => sort === 'popular'
      ? (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes) || (b.downloads || 0) - (a.downloads || 0)
      : (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  }, [data, tab, q, sort, user, isAdmin]);

  return (
    <Page testId="resources-page">
      <PageHeader
        eyebrow="Resource library"
        title="Guides that get the paperwork done"
        subtitle="Official CAF, Ameli and Campus France links plus community-shared templates and tips."
        action={<Link to="/resources/new" data-testid="submit-resource-button" className={btnPrimary}><Plus size={16} /> Submit resource</Link>}
      />

      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center" data-testid="resource-filters">
        <div className="flex flex-wrap gap-2">
          <button data-testid="resource-tab-all" onClick={() => setTab('')} className={pillCls(!tab)}>All</button>
          {RESOURCE_CATEGORIES.map((c) => (
            <button key={c.value} data-testid={`resource-tab-${c.value}`} onClick={() => setTab(c.value)} className={pillCls(tab === c.value)}>{c.label}</button>
          ))}
        </div>
        <div className="flex flex-1 gap-2 md:justify-end">
          <label className="relative flex-1 md:max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input data-testid="resource-search-input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title or tag…" className={`${inputCls} pl-9`} />
          </label>
          <select data-testid="resource-sort-select" value={sort} onChange={(e) => setSort(e.target.value)} className={`${inputCls} w-auto`}>
            <option value="popular">Most popular</option>
            <option value="recent">Most recent</option>
          </select>
        </div>
      </div>

      {error ? <ErrorState message={friendlyError(error)} onRetry={refetch} /> : isLoading ? <ListSkeleton image={false} /> : list.length === 0 ? (
        <EmptyState icon={FileText} title="Nothing here yet" message={q ? 'No resource matches that search. Try a different keyword or tag.' : 'This category is waiting for its first contribution.'} actionLabel="Share a resource" actionTo="/resources/new" testId="resources-empty" />
      ) : (
        <StaggerGrid testId="resources-grid">
          {list.map((r) => (
            <StaggerItem key={r.id}>
              <ResourceCard resource={{ ...r, downloads: (r.downloads || 0) + (localDownloads[r.id] || 0) }} onDownload={(id) => setLocalDownloads((d) => ({ ...d, [id]: (d[id] || 0) + 1 }))} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      )}
    </Page>
  );
}
