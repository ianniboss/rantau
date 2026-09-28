import { ExternalLink, FileText, Download, Clock, Tag, Check, X } from 'lucide-react';
import { RESOURCE_CATEGORIES } from '@/lib/constants';
import { incrementDownloads } from '@/lib/db';
import { timeAgo } from '@/lib/format';
import { CategoryBadge } from './CategoryBadge';
import { VoteButtons } from './VoteButtons';

export const ResourceCard = ({ resource, onDownload, onApprove, onReject }) => {
  const href = resource.fileUrl || resource.externalLink;
  const open = async () => {
    incrementDownloads(resource.id).catch(() => {});
    onDownload?.(resource.id);
  };
  const domain = resource.externalLink ? resource.externalLink.replace(/^https?:\/\//, '').split('/')[0] : null;

  return (
    <article
      data-testid={`resource-card-${resource.id}`}
      className="flex h-full flex-col rounded-xl border border-line bg-panel p-5 shadow-card transition-shadow duration-200 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        <CategoryBadge list={RESOURCE_CATEGORIES} value={resource.category} />
        {resource.status === 'pending_approval' && (
          <span data-testid="pending-badge" className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
            <Clock size={11} /> Pending review
          </span>
        )}
      </div>
      <h3 className="mt-3 font-heading text-base font-bold leading-snug text-ink sm:text-lg">{resource.title}</h3>
      <p className="mt-2 text-sm text-ink-muted line-clamp-3">{resource.description}</p>
      {resource.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {resource.tags.slice(0, 5).map((t) => (
            <span key={t} className="inline-flex items-center gap-1 rounded-md bg-surface px-2 py-0.5 text-[11px] font-medium text-ink-muted">
              <Tag size={10} /> {t}
            </span>
          ))}
        </div>
      )}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        <VoteButtons collection="resources" item={resource} compact />
        <div className="flex min-w-0 items-center gap-3 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1" data-testid={`downloads-${resource.id}`}><Download size={12} /> {resource.downloads || 0}</span>
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              onClick={open}
              data-testid={`resource-open-${resource.id}`}
              className="inline-flex max-w-[14rem] items-center gap-1.5 rounded-lg bg-my-blue px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#02008f] active:scale-95 dark:bg-my-yellow dark:text-[#010066]"
            >
              {resource.fileUrl ? <FileText size={13} className="shrink-0" /> : <ExternalLink size={13} className="shrink-0" />}
              <span className="truncate">{resource.fileUrl ? `Open ${resource.fileType?.toUpperCase() || 'file'}` : domain}</span>
            </a>
          )}
        </div>
      </div>
      <p className="mt-3 text-[11px] text-ink-muted">Shared by {resource.uploadedBy?.name} · {timeAgo(resource.createdAt)}</p>
      {resource.status === 'pending_approval' && onApprove && (
        <div className="mt-4 flex gap-2 border-t border-line pt-4" data-testid={`moderation-${resource.id}`}>
          <button type="button" data-testid={`approve-resource-${resource.id}`} onClick={() => onApprove(resource)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-success px-3 py-2 text-xs font-semibold text-white transition-[background-color,transform] hover:bg-emerald-600 active:scale-95">
            <Check size={14} /> Approve
          </button>
          <button type="button" data-testid={`reject-resource-${resource.id}`} onClick={() => onReject(resource)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-my-red/40 px-3 py-2 text-xs font-semibold text-my-red transition-[background-color,transform] hover:bg-my-red/10 active:scale-95">
            <X size={14} /> Reject
          </button>
        </div>
      )}
    </article>
  );
};
