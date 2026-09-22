import { colorFor, labelFor } from '@/lib/constants';

export const CategoryBadge = ({ list, value, className = '' }) => (
  <span
    data-testid={`badge-${value}`}
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${colorFor(list, value)} ${className}`}
  >
    {labelFor(list, value)}
  </span>
);
