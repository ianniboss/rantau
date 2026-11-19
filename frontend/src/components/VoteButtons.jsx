import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { castVote } from '@/lib/db';
import { friendlyError } from '@/lib/format';

export const VoteButtons = ({ collection, item, compact = false, onChange }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [state, setState] = useState({ upvotes: item.upvotes || 0, downvotes: item.downvotes || 0, votedBy: item.votedBy || {} });
  const [pulse, setPulse] = useState(0);
  const mine = user ? state.votedBy[user.uid] : null;
  const score = state.upvotes - state.downvotes;

  const vote = async (dir) => {
    if (!user) {
      toast.info('Log in to vote');
      return navigate('/login');
    }
    try {
      const next = await castVote(collection, item.id, user.uid, dir);
      setState(next);
      setPulse((p) => p + 1);
      onChange?.(next);
      toast.success(next.votedBy[user.uid] ? `Vote registered` : 'Vote removed');
    } catch (e) {
      toast.error(friendlyError(e));
    }
  };

  const btn = (dir, Icon, active) => (
    <button
      type="button"
      data-testid={`${dir}vote-button-${item.id}`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); vote(dir); }}
      aria-label={dir === 'up' ? 'Upvote' : 'Downvote'}
      className={`relative grid h-8 w-8 place-items-center rounded-lg transition-[background-color,color] duration-150 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-my-blue dark:focus-visible:ring-my-yellow before:absolute before:-inset-1.5 before:content-[''] ${
        active ? (dir === 'up' ? 'bg-success/15 text-emerald-600' : 'bg-my-red/10 text-my-red') : 'text-ink-muted hover:bg-ink/5 hover:text-ink'
      }`}
    >
      <Icon size={compact ? 18 : 20} fill={active ? 'currentColor' : 'none'} />
    </button>
  );

  return (
    <div className={`flex items-center rounded-lg border border-line bg-panel ${compact ? 'gap-1 p-0.5' : 'gap-1.5 p-1'}`} data-testid={`vote-widget-${item.id}`}>
      {btn('up', ArrowBigUp, mine === 'up')}
      <motion.span
        key={pulse}
        initial={{ scale: 1 }}
        animate={{ scale: shouldReduceMotion ? 1 : [1, 1.25, 1] }}
        transition={{ duration: 0.3 }}
        data-testid={`vote-score-${item.id}`}
        className={`pointer-events-none min-w-[1.5rem] select-none text-center text-sm font-bold tabular-nums ${score > 0 ? 'text-emerald-600' : score < 0 ? 'text-my-red' : 'text-ink'}`}
      >
        {score}
      </motion.span>
      {btn('down', ArrowBigDown, mine === 'down')}
    </div>
  );
};
