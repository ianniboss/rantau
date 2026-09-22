import { Link } from 'react-router-dom';
import { MessageCircle, MapPin, Pin, ImageIcon } from 'lucide-react';
import { POST_CATEGORIES } from '@/lib/constants';
import { timeAgo } from '@/lib/format';
import { CategoryBadge } from './CategoryBadge';
import { VoteButtons } from './VoteButtons';

export const PostCard = ({ post }) => (
  <article
    data-testid={`post-card-${post.id}`}
    className="flex gap-4 rounded-xl border border-line bg-panel p-4 shadow-card transition-shadow duration-200 hover:shadow-lift sm:p-5"
  >
    <div className="hidden sm:block">
      <VoteButtons collection="posts" item={post} compact />
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <CategoryBadge list={POST_CATEGORIES} value={post.category} />
        {post.isPinned && <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-my-red"><Pin size={11} /> Pinned</span>}
        <span className="inline-flex items-center gap-1 text-xs text-ink-muted"><MapPin size={12} /> {post.city}</span>
      </div>
      <Link to={`/community/${post.id}`} className="mt-2 block">
        <h3 className="font-heading text-base font-bold leading-snug text-ink hover:text-my-blue dark:hover:text-my-yellow sm:text-lg">{post.title}</h3>
        <p className="mt-1.5 text-sm text-ink-muted line-clamp-2">{post.content}</p>
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-muted">
        <span>by <span className="font-medium text-ink">{post.author?.name}</span> · {timeAgo(post.createdAt)}</span>
        <span className="inline-flex items-center gap-1"><MessageCircle size={13} /> {post.commentCount || 0}</span>
        {post.imageUrls?.length > 0 && <span className="inline-flex items-center gap-1"><ImageIcon size={13} /> {post.imageUrls.length}</span>}
        <span className="sm:hidden"><VoteButtons collection="posts" item={post} compact /></span>
      </div>
    </div>
  </article>
);
