import { motion, useReducedMotion } from 'framer-motion';

export const StaggerGrid = ({ children, className = 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3', testId }) => {
  const shouldReduceMotion = useReducedMotion();
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: shouldReduceMotion ? 0 : 0.04 } },
  };

  return (
    <motion.div data-testid={testId} variants={container} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className = '', hover = true }) => {
  const shouldReduceMotion = useReducedMotion();
  const item = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
    show: { opacity: 1, y: 0, transition: { duration: shouldReduceMotion ? 0.05 : 0.28, ease: 'easeOut' } },
  };

  return (
    <motion.div
      variants={item}
      whileHover={hover && !shouldReduceMotion ? { y: -4 } : undefined}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};
