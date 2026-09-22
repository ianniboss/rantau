import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Trash2, Pin } from 'lucide-react';
import { toast } from 'sonner';
import { Page } from '@/components/Page';
import { DetailSkeleton } from '@/components/Skeletons';
import { EmptyState } from '@/components/EmptyState';
import { Comments } from '@/components/Comments';
import { CategoryBadge } from '@/components/CategoryBadge';
import { VoteButtons } from '@/components/VoteButtons';
import { POST_CATEGORIES } from '@/lib/constants';
import { deletePost, fetchPost } from '@/lib/db';
import { friendlyError, initials, timeAgo } from '@/lib/format';
import { useAuth } from '@/hooks/useAuth';

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user, isAdmin } = useAuth();
  const { data: post, isLoading } = useQuery({ queryKey: ['post', postId], queryFn: () => fetchPost(postId) });

  if (isLoading) return <Page className="max-w-4xl" testId="post-detail-page"><DetailSkeleton /></Page>;
  if (!post) return <Page className="max-w-4xl" testId="post-detail-page"><EmptyState title="Post not found" message="It may have been deleted." actionLabel="Back to the board" actionTo="/community" /></Page>;

  const canDelete = user && (user.uid === post.author?.uid || isAdmin);
  const remove = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(postId);
      qc.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted');
      navigate('/community');
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  return (
    <Page className="max-w-4xl" testId="post-detail-page">
      <Link to="/community" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink"><ArrowLeft size={16} /> Community board</Link>
      <article className="rounded-2xl border border-line bg-panel p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge list={POST_CATEGORIES} value={post.category} />
          {post.isPinned && <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-my-red"><Pin size={11} /> Pinned</span>}
          <span className="inline-flex items-center gap-1 text-xs text-ink-muted"><MapPin size={12} /> {post.city}</span>
        </div>
        <h1 className="mt-3 font-heading text-2xl font-extrabold tracking-tight text-ink sm:text-4xl" data-testid="post-title">{post.title}</h1>
        <div className="mt-4 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-my-blue/10 text-sm font-bold text-my-blue dark:bg-my-yellow/15 dark:text-my-yellow">{initials(post.author?.name)}</span>
          <div className="text-sm">
            <Link to={`/profile/${post.author?.uid}`} className="font-semibold text-ink hover:underline">{post.author?.name}</Link>
            <p className="text-xs text-ink-muted">{timeAgo(post.createdAt)}</p>
          </div>
        </div>
        <div className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-ink sm:text-base" data-testid="post-content">{post.content}</div>
        {post.imageUrls?.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2" data-testid="post-images">
            {post.imageUrls.map((u) => <a key={u} href={u} target="_blank" rel="noreferrer"><img src={u} alt="" className="h-56 w-full rounded-xl object-cover ring-1 ring-line" /></a>)}
          </div>
        )}
        <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
          <VoteButtons collection="posts" item={post} />
          {canDelete && <button data-testid="delete-post-button" onClick={remove} className="inline-flex items-center gap-1.5 text-sm font-medium text-my-red hover:underline"><Trash2 size={14} /> Delete</button>}
        </div>
      </article>
      <div className="mt-6">
        <Comments parentType="post" parentId={postId} onAdded={() => { qc.invalidateQueries({ queryKey: ['post', postId] }); qc.invalidateQueries({ queryKey: ['posts'] }); }} />
      </div>
    </Page>
  );
}
