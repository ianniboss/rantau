import { Link } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import { btnPrimary } from '@/lib/ui';

export const EmptyState = ({ icon: Icon = Inbox, title, message, actionLabel, actionTo, onAction, testId = 'empty-state' }) => (
  <div data-testid={testId} className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-panel/60 px-6 py-14 text-center">
    <div className="relative mb-5">
      <span className="absolute -inset-3 rounded-full bg-my-yellow/25 blur-lg" />
      <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-panel shadow-card ring-1 ring-line">
        <Icon size={28} className="text-my-blue dark:text-my-yellow" />
      </span>
    </div>
    <h3 className="font-heading text-lg font-bold text-ink">{title}</h3>
    <p className="mt-1.5 max-w-sm text-sm text-ink-muted">{message}</p>
    {actionLabel && (actionTo ? (
      <Link to={actionTo} data-testid={`${testId}-action`} className={`${btnPrimary} mt-6`}>{actionLabel}</Link>
    ) : (
      <button onClick={onAction} data-testid={`${testId}-action`} className={`${btnPrimary} mt-6`}>{actionLabel}</button>
    ))}
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div data-testid="error-state" className="rounded-xl border border-my-red/30 bg-my-red/5 p-5 text-sm text-my-red">
    <p className="font-medium">Couldn't load this right now.</p>
    <p className="mt-1 opacity-80">{message}</p>
    {onRetry && <button onClick={onRetry} className="mt-3 font-semibold underline">Try again</button>}
  </div>
);
