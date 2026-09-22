import { motion } from 'framer-motion';

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } } };

export const StaggerGrid = ({ children, className = 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3', testId }) => (
  <motion.div data-testid={testId} variants={container} initial="hidden" animate="show" className={className}>
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = '', hover = true }) => (
  <motion.div
    variants={item}
    whileHover={hover ? { y: -4 } : undefined}
    transition={{ duration: 0.2, ease: 'easeOut' }}
    className={`h-full ${className}`}
  >
    {children}
  </motion.div>
);
