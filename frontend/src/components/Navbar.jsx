import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X, Moon, Sun, LogOut, User, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { btnPrimary, btnGhost, focusRing } from '@/lib/ui';
import { friendlyError, initials } from '@/lib/format';

const LINKS = [
  { to: '/events', label: 'Events' },
  { to: '/resources', label: 'Resources' },
  { to: '/community', label: 'Community' },
  { to: '/cities', label: 'Cities' },
];

const Logo = ({ onHeroTop }) => (
  <Link to="/" data-testid="nav-logo" className={`flex min-h-[44px] shrink-0 items-center gap-2.5 rounded-lg ${focusRing}`}>
    <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-lg bg-my-blue font-heading text-lg font-extrabold text-white">
      R
      <span className="absolute -right-1 -top-1 h-4 w-4 rotate-45 bg-my-red" />
      <span className="absolute bottom-0 left-0 h-1 w-full bg-my-yellow" />
    </span>
    <span className={`font-heading text-xl font-extrabold tracking-tight transition-colors duration-300 ${onHeroTop ? 'text-white' : 'text-ink'}`}>Rantau</span>
  </Link>
);

export const Navbar = () => {
  const { user, profile, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef(null);
  const firstLinkRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    closeOnDesktop();
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  const solid = scrolled || pathname !== '/' || open;
  const onHeroTop = !solid;

  const logOut = async () => {
    try {
      await logout();
      setOpen(false);
      navigate('/');
    } catch (error) {
      toast.error(friendlyError(error));
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <header
        data-testid="navbar"
        className={`fixed inset-x-0 top-0 z-50 ${solid ? 'navbar-solid' : 'navbar-on-hero'}`}
      >
        <div aria-hidden="true" className="navbar-background pointer-events-none absolute inset-0 border-b border-line bg-panel/95 shadow-sm backdrop-blur-md" />
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo onHeroTop={onHeroTop} />

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} data-testid={`nav-link-${l.label.toLowerCase()}`} className={`relative inline-flex min-h-[44px] items-center rounded-full ${focusRing}`}>
                {({ isActive }) => (
                  <span
                    className={`relative flex min-h-[44px] items-center whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-medium transition-colors duration-300 lg:px-4 ${
                      isActive ? (onHeroTop ? 'text-white' : 'text-my-blue dark:text-my-yellow') : onHeroTop ? 'text-white/80 hover:text-white' : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={shouldReduceMotion ? undefined : 'nav-active'}
                        transition={shouldReduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 400, damping: 32 }}
                        className={`absolute inset-0 rounded-full ${onHeroTop ? 'bg-white/15' : 'bg-my-blue/10 dark:bg-my-yellow/15'}`}
                      />
                    )}
                    <span className="relative">{l.label}</span>
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              data-testid="theme-toggle"
              onClick={toggle}
              aria-label="Toggle dark mode"
              className={`relative grid h-11 w-11 place-items-center rounded-full transition-colors duration-300 active:scale-95 ${focusRing} ${onHeroTop ? 'text-white hover:bg-white/15' : 'text-ink-muted hover:bg-ink/5 hover:text-ink'}`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user ? (
              <div className="hidden items-center gap-2 md:flex">
                <Link to="/events/new" data-testid="nav-create-event" className={`${btnPrimary} min-h-[44px] !py-2`}>
                  <Plus size={16} /> Create
                </Link>
                <Link
                  to="/profile"
                  data-testid="nav-profile-link"
                  className={`grid h-11 w-11 place-items-center rounded-full bg-my-yellow text-sm font-bold text-[#010066] transition-shadow hover:shadow-card ${focusRing}`}
                  title={profile?.name}
                  aria-label="Profile"
                >
                  {initials(profile?.name || user.displayName)}
                </Link>
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link to="/login" data-testid="nav-login-link" className={`${btnGhost} min-h-[44px] whitespace-nowrap ${onHeroTop ? '!text-white hover:!bg-white/15' : ''}`}>
                  Log in
                </Link>
                <Link to="/signup" data-testid="nav-signup-link" className={`${btnPrimary} min-h-[44px] whitespace-nowrap !py-2`}>
                  Join Rantau
                </Link>
              </div>
            )}
            <Dialog.Trigger asChild>
              <button
                ref={toggleRef}
                type="button"
                data-testid="nav-mobile-toggle"
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                aria-controls="nav-mobile-menu"
                className={`grid h-11 w-11 place-items-center rounded-full transition-colors duration-300 md:hidden ${focusRing} ${onHeroTop ? 'text-white hover:bg-white/15' : 'text-ink hover:bg-ink/5'}`}
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </Dialog.Trigger>
          </div>
        </div>
      </header>

      <Dialog.Portal>
        <Dialog.Overlay data-testid="nav-mobile-backdrop" className="nav-drawer-backdrop fixed inset-0 z-[60] bg-black/45 backdrop-blur-sm" />
        <Dialog.Content
          id="nav-mobile-menu"
          data-testid="nav-mobile-menu"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            firstLinkRef.current?.focus();
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (!window.matchMedia('(min-width: 768px)').matches) {
              toggleRef.current?.focus();
            }
          }}
          className="nav-drawer-panel fixed inset-y-0 right-0 z-[70] flex w-[calc(100%-3rem)] max-w-sm flex-col overflow-y-auto overscroll-contain border-l border-line bg-panel text-ink shadow-xl"
        >
          <div className="flex min-h-16 shrink-0 items-center justify-between gap-4 border-b border-line px-5">
            <Dialog.Title className="font-heading text-lg font-extrabold">Rantau</Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" data-testid="nav-mobile-close" aria-label="Close menu" className={`grid h-11 w-11 place-items-center rounded-full text-ink-muted hover:bg-surface hover:text-ink ${focusRing}`}>
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">Main navigation and account actions</Dialog.Description>
          <nav aria-label="Mobile main" className="space-y-1 px-5 py-5">
            {LINKS.map((l, index) => (
              <NavLink
                ref={index === 0 ? firstLinkRef : undefined}
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                data-testid={`mobile-nav-link-${l.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `flex min-h-[44px] items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-surface ${focusRing} ${isActive ? 'bg-my-blue/10 text-my-blue dark:bg-my-yellow/15 dark:text-my-yellow' : 'text-ink'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="mx-5 mb-5 mt-auto flex shrink-0 flex-col gap-2 border-t border-line pt-5">
            {user ? (
              <>
                <Link to="/events/new" onClick={() => setOpen(false)} data-testid="mobile-nav-create-event" className={`${btnPrimary} min-h-[44px]`}>
                  <Plus size={16} /> Create event
                </Link>
                <Link to="/profile" onClick={() => setOpen(false)} data-testid="mobile-nav-profile" className={`${btnGhost} min-h-[44px] border border-line`}>
                  <User size={16} /> Profile
                </Link>
                <button
                  type="button"
                  data-testid="mobile-nav-logout"
                  onClick={logOut}
                  className={`${btnGhost} min-h-[44px] border border-line`}
                >
                  <LogOut size={16} /> Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} data-testid="mobile-nav-login" className={`${btnGhost} min-h-[44px] border border-line`}>Log in</Link>
                <Link to="/signup" onClick={() => setOpen(false)} data-testid="mobile-nav-signup" className={`${btnPrimary} min-h-[44px]`}>Join</Link>
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
