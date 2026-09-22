import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useTheme } from '@/hooks/useTheme';

export const Layout = () => {
  const location = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <Navbar />
      <div className="flex flex-1 flex-col pt-16">
        <AnimatePresence mode="wait" initial={false}>
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </div>
      <Footer />
      <Toaster position="top-right" richColors closeButton theme={theme} toastOptions={{ duration: 3200 }} />
    </div>
  );
};
