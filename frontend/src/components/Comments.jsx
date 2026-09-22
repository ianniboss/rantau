import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { addComment, fetchComments } from '@/lib/db';
import { friendlyError, initials, timeAgo } from '@/lib/format';
import { btnPrimary, inputCls } from '@/lib/ui';

export const Comments = ({ parentType, parentId, onAdded }) => {
  const { user, authorInfo } = useAuth();
  const qc = useQueryClient();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const { data: comments = [], isLoading } = useQuery({ queryKey: ['comments', parentId], queryFn: () => fetchComments(parentId) });

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await addComment({ parentType, parentId, author: authorInfo, content: text.trim() });
      setText('');
      qc.invalidateQueries({ queryKey: ['comments', parentId] });
      onAdded?.();
      toast.success('Comment posted');
    } catch (err) {
      toast.error(friendlyError(err));
    } finally {
      setSending(false);
    }
  };

  return (
    <section data-testid="comments-section" className="rounded-xl border border-line bg-panel p-5 sm:p-6">
      <h3 className="flex items-center gap-2 font-heading text-lg font-bold text-ink">
        <MessageCircle size={18} /> Comments <span className="text-sm font-medium text-ink-muted">({comments.length})</span>
      </h3>

      {user ? (
        <form onSubmit={submit} className="mt-4 flex gap-2">
          <input
            data-testid="comment-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share a thought, tip or question…"
            className={inputCls}
            maxLength={1000}
          />
          <button data-testid="comment-submit-button" disabled={sending || !text.trim()} className={btnPrimary}>
            <Send size={16} />
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-ink-muted">
          <Link to="/login" className="font-semibold text-my-blue underline dark:text-my-yellow">Log in</Link> to join the conversation.
        </p>
      )}

      <ul className="mt-6 space-y-4" data-testid="comments-list">
        {isLoading && [0, 1].map((i) => <li key={i} className="skeleton h-14 rounded-lg" />)}
        {!isLoading && comments.length === 0 && (
          <li className="text-sm text-ink-muted" data-testid="comments-empty">No comments yet — be the first.</li>
        )}
        {comments.map((c) => (
          <li key={c.id} className="flex gap-3" data-testid={`comment-${c.id}`}>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-my-blue/10 text-xs font-bold text-my-blue dark:bg-my-yellow/15 dark:text-my-yellow">
              {initials(c.author?.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm">
                <Link to={`/profile/${c.author?.uid}`} className="font-semibold text-ink hover:underline">{c.author?.name}</Link>
                <span className="ml-2 text-xs text-ink-muted">{timeAgo(c.createdAt)}</span>
              </p>
              <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-ink">{c.content}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
