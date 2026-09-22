import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, LogOut, User, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { btnPrimary, btnGhost } from '@/lib/ui';
import { initials } from '@/lib/format';

const LINKS = [
  { to: '/events', label: 'Events' },
  { to: '/resources', label: 'Resources' },
  { to: '/community', label: 'Community' },
  { to: '/cities', label: 'Cities' },
];

const Logo = () => (
  <Link to="/" data-testid="nav-logo" className="flex items-center gap-2.5">
    <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-lg bg-my-blue font-heading text-lg font-extrabold text-white">
      R
      <span className="absolute -right-1 -top-1 h-4 w-4 rotate-45 bg-my-red" />
      <span className="absolute bottom-0 left-0 h-1 w-full bg-my-yellow" />
    </span>
    <span className="font-heading text-xl font-extrabold tracking-tight text-ink">Rantau</span>
  </Link>
);

export const Navbar = () => {
  const { user, profile, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const solid = scrolled || pathname !== '/' || open;
  const onHeroTop = !solid;

  return (
    <header
      data-testid="navbar"
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ${
        solid ? 'border-b border-line bg-panel/85 shadow-sm backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className={onHeroTop ? '[&_span.text-ink]:text-white' : ''}>
          <Logo />
        </div>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} data-testid={`nav-link-${l.label.toLowerCase()}`} className="relative">
              {({ isActive }) => (
                <span
                  className={`relative block rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive ? (onHeroTop ? 'text-white' : 'text-my-blue dark:text-my-yellow') : onHeroTop ? 'text-white/80 hover:text-white' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      className={`absolute inset-0 rounded-full ${onHeroTop ? 'bg-white/15' : 'bg-my-blue/10 dark:bg-my-yellow/15'}`}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            data-testid="theme-toggle"
            onClick={toggle}
            aria-label="Toggle dark mode"
            className={`grid h-9 w-9 place-items-center rounded-full transition-colors duration-200 active:scale-95 ${onHeroTop ? 'text-white hover:bg-white/15' : 'text-ink-muted hover:bg-ink/5 hover:text-ink'}`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/events/new" data-testid="nav-create-event" className={`${btnPrimary} !py-2`}>
                <Plus size={16} /> Create
              </Link>
              <Link
                to="/profile"
                data-testid="nav-profile-link"
                className="grid h-9 w-9 place-items-center rounded-full bg-my-yellow text-sm font-bold text-[#010066] ring-2 ring-transparent transition-shadow hover:ring-my-yellow/50"
                title={profile?.name}
              >
                {initials(profile?.name || user.displayName)}
              </Link>
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login" data-testid="nav-login-link" className={`${btnGhost} ${onHeroTop ? 'text-white hover:bg-white/15' : ''}`}>
                Log in
              </Link>
              <Link to="/signup" data-testid="nav-signup-link" className={`${btnPrimary} !py-2`}>
                Join Rantau
              </Link>
            </div>
          )}
          <button
            data-testid="nav-mobile-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className={`grid h-9 w-9 place-items-center rounded-full md:hidden ${onHeroTop ? 'text-white' : 'text-ink'}`}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="nav-mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-line bg-panel md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? 'bg-my-blue/10 text-my-blue dark:bg-my-yellow/15 dark:text-my-yellow' : 'text-ink'}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="mt-3 flex gap-2 border-t border-line pt-3">
                {user ? (
                  <>
                    <Link to="/profile" data-testid="mobile-nav-profile" className={`${btnGhost} flex-1 border border-line`}>
                      <User size={16} /> Profile
                    </Link>
                    <button
                      data-testid="mobile-nav-logout"
                      onClick={async () => { await logout(); navigate('/'); }}
                      className={`${btnGhost} flex-1 border border-line`}
                    >
                      <LogOut size={16} /> Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" data-testid="mobile-nav-login" className={`${btnGhost} flex-1 border border-line`}>Log in</Link>
                    <Link to="/signup" data-testid="mobile-nav-signup" className={`${btnPrimary} flex-1`}>Join</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
