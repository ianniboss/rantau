# Phase 2 Navigation Implementation Plan

> **For agentic workers:** Execute inline on phase2-trae in
> `c:\Users\ianha\githubrepo\rantau`, following the user-approved transfer.
> The referenced superpowers execution skills are not installed. Do not spawn
> agents, commit changes, or modify the other checkout.

**Goal:** Ship an accessible mobile drawer, smooth navbar transition, aligned
footer, and verified Phase 1 carryover checks.

**Architecture:** Navbar owns controlled Radix Dialog state and breakpoint
cleanup. Local CSS handles background crossfade, hero focus overrides, and
drawer motion; Footer uses direct grid tracks and shared link styling.

**Tech Stack:** React 19, React Router 7, Tailwind 3, Radix Dialog, Framer Motion,
existing CRA/CRACO scripts and installed packages.

---

## Files and Responsibilities

- `frontend/src/components/Navbar.jsx`: drawer lifecycle, links, focus return,
  responsive cleanup, shared focusRing, reduced-motion active indicator.
- `frontend/src/index.css`: scoped navbar background and hero focus styles;
  drawer animation and reduced-motion behavior.
- `frontend/src/components/Footer.jsx`: explicit grid columns, shared focusRing
  and 44px footer links.
- `frontend/src/components/Navbar.test.jsx`: controlled drawer regression tests
  using React DOM and the installed Jest runner.
- `frontend/src/lib/constants.js`: change only if contrast is below 4.5:1.
- Card components: change only for a demonstrated keyboard focus defect.
- `frontend/src/components/Layout.jsx`: leave unchanged unless integration
  verification exposes a shell-specific defect.

## Task 1: Baseline and Runtime

- [x] Create clean phase2-trae worktree from 6224da5.
- [x] Read the baseline shell, tokens, cards, routes, theme, and data hooks.
- [x] Reuse installed node_modules through an ignored junction; no install.
- [x] Start server on port 3102, with browser auto-open disabled:

```powershell
$env:PORT='3102'
$env:BROWSER='none'
$env:DISABLE_EMERGENT_OVERLAY='true'
npm start
```

Expected: successful compilation and a reachable `http://localhost:3102`.
Firebase configuration is absent in the baseline; report real-data checks as
blocked if the development fallback cannot load records.

## Task 2: Drawer and Navbar

- [x] Write tests for toggle ARIA, initial focus, Escape, explicit close,
  route activation, desktop breakpoint cleanup, and account actions.
- [x] Run `npm test -- --watchAll=false --runInBand`; new tests fail against
  the baseline menu, specifically because the controlled dialog id and
  focus lifecycle are absent.
- [x] Use installed `@radix-ui/react-dialog` directly. Wrap the toggle in
  `Dialog.Trigger asChild`, portal overlay and content, use labelled title
  and description, and retain all existing test ids.
- [x] Store the toggle ref and first link ref. Set initial focus explicitly:

```jsx
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
```

- [x] Add breakpoint cleanup and retain pathname close:

```jsx
useEffect(() => {
  const desktop = window.matchMedia('(min-width: 768px)');
  const closeOnDesktop = () => {
    if (desktop.matches) setOpen(false);
  };
  closeOnDesktop();
  desktop.addEventListener('change', closeOnDesktop);
  return () => desktop.removeEventListener('change', closeOnDesktop);
}, []);
useEffect(() => setOpen(false), [pathname]);
```

- [x] Let the modal Radix overlay manage scroll lock and background isolation.
  Add `min-h-[44px]`, focusRing, explicit close controls, scrollable panel,
  route close handlers, and safe-area padding.
- [x] Add authenticated create-event access; preserve profile and logout.
  Catch logout failures with existing toast/friendlyError conventions.
- [x] Give every navbar link focusRing. For hero focus use scoped variables,
  without replacing the shared focus utility:

```css
.navbar-on-hero :focus-visible {
  --tw-ring-color: var(--primary-yellow);
  --tw-ring-offset-color: var(--primary-blue);
}
```

- [x] Replace switched backdrop classes with an always-present background
  layer and an opacity transition. Keep content above it:

```css
.navbar-background {
  opacity: 0;
  transition: opacity 300ms ease;
}
.navbar-solid .navbar-background { opacity: 1; }
```

Use panel background, existing border and shadow, and backdrop blur on the
layer. Use the existing global reduced-motion CSS plus useReducedMotion for
the active-link indicator.

## Task 3: Footer

- [x] Replace the nested cramped grid with direct brand and two link columns:

```jsx
className="mx-auto grid max-w-7xl grid-cols-2 items-start gap-x-6 gap-y-8 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] lg:px-8"
```

Brand spans two columns on mobile and one on tablet/desktop. Attribution uses
a full-width bottom row separated by the existing border token.
- [x] Reuse a single link class for internal and external links:

```jsx
const footerLink = `flex min-h-[44px] items-center rounded-md py-2 text-sm text-ink-muted transition-colors hover:text-ink ${focusRing}`;
```

Preserve all factual copy and hrefs. Inspect wrapping and measure contrast.

## Task 4: Verification

- [x] Run regression tests and a production build:

```powershell
npm test -- --watchAll=false --runInBand
npm run build
```

Expected: tests pass and build compiles. Distinguish failures from missing
Firebase production configuration from compilation errors.
- [x] Inspect real browser DOM before interaction. Verify 375px, 768px,
  1280px light/dark, including footer and both navbar states.
- [x] Test keyboard and touch drawer paths, focus wrapping/return,
  scroll lock/restoration, resize cleanup, and short viewport scrolling.
- [x] Emulate reduced motion and inspect layer transition and active marker.
- [x] Attempt real-record card checks and report missing Firebase data.
  Supplementary actual-component checks used synthetic browser-local cache
  records; Tab, visible focus, and Enter passed in both themes.
- [x] Read computed badge and footer colors; alpha-compose backgrounds and
  calculate WCAG luminance:

```js
const linear = (value) => {
  const channel = value / 255;
  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
};
const luminance = ([r, g, b]) =>
  0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
const contrast = (a, b) =>
  (Math.max(luminance(a), luminance(b)) + 0.05) /
  (Math.min(luminance(a), luminance(b)) + 0.05);
```

Only adjust badge colors if the result is below 4.5:1.
- [x] Perform one batched visual pass, fix demonstrated issues together, and
  run one confirmation pass. Save intermediate scripts/captures in Temp.
- [x] Record final results, touched files and uncommitted branch status.
  Stop before Phase 3.

## Execution Notes

Six regression tests and 18 drawer browser assertions passed. The production
build compiled successfully with BUILD_PATH directed to Temp because the
sandbox denied the default output directory. All six width/theme combinations
passed overflow, navbar-height, and shell-target checks.

All three dark orange badge categories measured 7.70:1 and were left unchanged.
Footer links measured 6.37:1 in light mode and 6.84:1 in dark mode. Full results
and the live-data limitation are recorded in `docs/phase2-verification.md`.

Added `frontend/craco.config.js` test-only alias/Router exports mappings because
the baseline Jest runner could not resolve the existing app imports.
