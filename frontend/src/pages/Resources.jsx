import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, Plus, Search, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Page, PageHeader } from '@/components/Page';
import { ResourceCard } from '@/components/ResourceCard';
import { ListSkeleton } from '@/components/Skeletons';
import { EmptyState, ErrorState } from '@/components/EmptyState';
import { StaggerGrid, StaggerItem } from '@/components/Stagger';
import { RESOURCE_CATEGORIES } from '@/lib/constants';
import { approveResource, deleteResource, fetchPendingResources, fetchResources, fetchResourcesBy } from '@/lib/db';
import { friendlyError } from '@/lib/format';
import { useAuth } from '@/hooks/useAuth';
import { btnPrimary, inputCls, pillCls } from '@/lib/ui';

export default function Resources() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const qc = useQueryClient();
  const approved = useQuery({ queryKey: ['resources'], queryFn: fetchResources });
  const mine = useQuery({ queryKey: ['userResources', user?.uid], queryFn: () => fetchResourcesBy(user.uid), enabled: !!user });
  const pending = useQuery({ queryKey: ['pendingResources'], queryFn: fetchPendingResources, enabled: isAdmin });
  const [tab, setTab] = useState('');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('popular');
  const [localDownloads, setLocalDownloads] = useState({});

  const all = useMemo(() => {
    const map = new Map();
    [...(approved.data || []), ...(mine.data || []), ...(pending.data || [])].forEach((r) => map.set(r.id, r));
    return [...map.values()];
  }, [approved.data, mine.data, pending.data]);

  const pendingCount = (pending.data || []).length;

  const list = useMemo(() => {
    const s = q.toLowerCase().trim();
    const filtered = all.filter((r) => {
      if (tab === 'pending') return r.status === 'pending_approval';
      if (tab && r.category !== tab) return false;
      return !s || r.title.toLowerCase().includes(s) || r.tags?.some((t) => t.toLowerCase().includes(s));
    });
    return filtered.sort((a, b) => sort === 'popular'
      ? (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes) || (b.downloads || 0) - (a.downloads || 0)
      : (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
  }, [all, tab, q, sort]);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ['resources'] });
    qc.invalidateQueries({ queryKey: ['pendingResources'] });
    qc.invalidateQueries({ queryKey: ['userResources'] });
  };

  const approve = async (r) => {
    try {
      await approveResource(r.id);
      refresh();
      toast.success(`"${r.title}" approved`);
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  const reject = async (r) => {
    if (!window.confirm(`Reject and delete "${r.title}"?`)) return;
    try {
      await deleteResource(r.id);
      refresh();
      toast.success('Submission rejected');
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  const isLoading = approved.isLoading || authLoading;

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
          {isAdmin && (
            <button data-testid="resource-tab-pending" onClick={() => setTab('pending')} className={`${pillCls(tab === 'pending')} inline-flex items-center gap-1.5`}>
              <ShieldCheck size={14} /> Pending
              {pendingCount > 0 && <span data-testid="pending-count" className="rounded-full bg-my-red px-1.5 text-[10px] font-bold text-white">{pendingCount}</span>}
            </button>
          )}
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

      {approved.error ? <ErrorState message={friendlyError(approved.error)} onRetry={approved.refetch} /> : isLoading ? <ListSkeleton image={false} /> : list.length === 0 ? (
        tab === 'pending'
          ? <EmptyState icon={ShieldCheck} title="Queue is clear" message="No submissions waiting for review." testId="pending-empty" />
          : <EmptyState icon={FileText} title="Nothing here yet" message={q ? 'No resource matches that search. Try a different keyword or tag.' : 'This category is waiting for its first contribution.'} actionLabel="Share a resource" actionTo="/resources/new" testId="resources-empty" />
      ) : (
        <StaggerGrid testId="resources-grid">
          {list.map((r) => (
            <StaggerItem key={r.id}>
              <ResourceCard
                resource={{ ...r, downloads: (r.downloads || 0) + (localDownloads[r.id] || 0) }}
                onDownload={(id) => setLocalDownloads((d) => ({ ...d, [id]: (d[id] || 0) + 1 }))}
                onApprove={isAdmin ? approve : undefined}
                onReject={isAdmin ? reject : undefined}
              />
            </StaggerItem>
          ))}
        </StaggerGrid>
      )}
    </Page>
  );
}
