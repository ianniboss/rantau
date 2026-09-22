import { motion } from 'framer-motion';

export const Page = ({ children, className = '', wide = false, testId = 'page' }) => (
  <motion.main
    data-testid={testId}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.18, ease: 'easeOut' }}
    className={wide ? className : `mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 ${className}`}
  >
    {children}
  </motion.main>
);

export const PageHeader = ({ eyebrow, title, subtitle, action }) => (
  <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
      {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-my-red">{eyebrow}</p>}
      <h1 className="font-heading text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-2xl text-sm text-ink-muted sm:text-base">{subtitle}</p>}
    </div>
    {action}
  </div>
);
