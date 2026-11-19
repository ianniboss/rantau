import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { toast } from 'sonner';
import { Navbar } from './Navbar';

const mockLogout = jest.fn(() => Promise.resolve());
let mockUser = null;
let mockDesktop = false;
let mockBreakpointChange;

jest.mock('react-router-dom', () => {
  global.TextEncoder = require('util').TextEncoder;
  return jest.requireActual('react-router-dom');
});

jest.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: mockUser,
    profile: null,
    logout: mockLogout,
  }),
}));
jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ theme: 'light', toggle: jest.fn() }),
}));
jest.mock('sonner', () => ({ toast: { error: jest.fn() } }));

describe('Navbar drawer', () => {
  let container;
  let root;

  beforeEach(async () => {
    global.IS_REACT_ACT_ENVIRONMENT = true;
    mockUser = null;
    mockDesktop = false;
    mockBreakpointChange = undefined;
    mockLogout.mockClear();
    toast.error.mockClear();
    window.matchMedia = jest.fn((query) => ({
      get matches() {
        return query === '(min-width: 768px)' && mockDesktop;
      },
      media: query,
      addEventListener: (_type, callback) => {
        if (query === '(min-width: 768px)') mockBreakpointChange = callback;
      },
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    await render();
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  async function render() {
    await act(async () => {
      root.render(<MemoryRouter><Navbar /></MemoryRouter>);
    });
  }

  async function click(element) {
    await act(async () => {
      element.click();
      await new Promise((resolve) => setTimeout(resolve, 25));
    });
  }

  const toggle = () => document.querySelector('[data-testid="nav-mobile-toggle"]');
  const drawer = () => document.querySelector('[data-testid="nav-mobile-menu"]');

  test('opens a labelled modal and moves focus to its first link', async () => {
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    await click(toggle());
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
    expect(drawer().id).toBe(toggle().getAttribute('aria-controls'));
    expect(drawer().getAttribute('role')).toBe('dialog');
    expect(drawer().getAttribute('aria-labelledby')).toBeTruthy();
    expect(document.activeElement).toBe(
      document.querySelector('[data-testid="mobile-nav-link-events"]'),
    );
  });

  test('Escape closes the drawer and restores toggle focus', async () => {
    await click(toggle());
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await new Promise((resolve) => setTimeout(resolve, 25));
    });
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle());
  });

  test('close button and same-route link both close the drawer', async () => {
    await click(toggle());
    await click(document.querySelector('[data-testid="nav-mobile-close"]'));
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    await click(toggle());
    await click(document.querySelector('[data-testid="mobile-nav-link-events"]'));
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    await click(toggle());
    await click(document.querySelector('[data-testid="mobile-nav-link-events"]'));
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });

  test('desktop resize closes the drawer without focusing the hidden toggle', async () => {
    await click(toggle());
    await act(async () => {
      mockDesktop = true;
      mockBreakpointChange();
      await new Promise((resolve) => setTimeout(resolve, 25));
    });
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).not.toBe(toggle());
    expect(document.body.style.pointerEvents).not.toBe('none');
  });

  test('preserves authenticated create, profile and logout actions', async () => {
    mockUser = { uid: 'test-user', displayName: 'Student' };
    await render();
    await click(toggle());
    expect(document.querySelector('[data-testid="mobile-nav-create-event"]').getAttribute('href')).toBe('/events/new');
    expect(document.querySelector('[data-testid="mobile-nav-profile"]').getAttribute('href')).toBe('/profile');
    await click(document.querySelector('[data-testid="mobile-nav-logout"]'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(toggle().getAttribute('aria-expanded')).toBe('false');
  });

  test('keeps the account drawer usable when logout fails', async () => {
    mockUser = { uid: 'test-user', displayName: 'Student' };
    mockLogout.mockRejectedValueOnce(new Error('Logout unavailable'));
    await render();
    await click(toggle());
    await click(document.querySelector('[data-testid="mobile-nav-logout"]'));
    expect(toast.error).toHaveBeenCalled();
    expect(toggle().getAttribute('aria-expanded')).toBe('true');
  });
});
