export const inputCls =
  'w-full rounded-lg border border-line bg-panel px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 outline-none transition-[border-color,box-shadow] duration-200 focus:border-my-blue focus:ring-4 focus:ring-my-blue/10 dark:focus:border-my-yellow dark:focus:ring-my-yellow/10';

export const labelCls = 'mb-1.5 block text-sm font-medium text-ink';

export const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-[background-color,color,transform,box-shadow] duration-150 active:scale-95 disabled:pointer-events-none disabled:opacity-60';

export const btnPrimary = `${btnBase} bg-my-blue text-white hover:bg-[#02008f] shadow-sm dark:bg-my-yellow dark:text-[#010066] dark:hover:bg-[#ffdb33]`;
export const btnSecondary = `${btnBase} border border-line bg-panel text-ink hover:bg-surface`;
export const btnAccent = `${btnBase} bg-my-red text-white hover:bg-[#b00001]`;
export const btnGhost = `${btnBase} text-ink hover:bg-ink/5`;

export const cardCls = 'rounded-xl border border-line bg-panel shadow-card';
export const pillCls = (active) =>
  `rounded-full px-3.5 py-1.5 text-sm font-medium transition-[background-color,color] duration-150 active:scale-95 ${
    active ? 'bg-my-blue text-white dark:bg-my-yellow dark:text-[#010066]' : 'bg-panel border border-line text-ink-muted hover:text-ink hover:bg-surface'
  }`;

export const errorCls = 'mt-1 text-xs text-my-red';
