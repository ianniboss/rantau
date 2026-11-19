# Phase 2 Verification

Date: 2026-11-19

Branch: `phase2-trae`, based on `6224da5`. All changes remain uncommitted.
Current checkout: `c:\Users\ianha\githubrepo\rantau`.
Development server: `http://localhost:3102`.

The implementation was initially made in the isolated `rantau-phase2-trae`
worktree, then transferred to the original checkout at the user's request.
The old worktree is clean and detached. Antigravity's uncommitted work remains
saved in the named stash `phase2-antigravity preserved before Trae transfer`;
a separate `phase2-trae transfer to original rantau checkout` stash retains
the pre-transfer Trae version. Neither branch received a new commit.

## Changes

- Replaced the expanding mobile menu with a right-side Radix modal drawer.
  It has a blurred/dimmed backdrop, a labelled dialog, a matching controlled
  id, initial focus, focus trapping, Escape/backdrop/close-button dismissal,
  focus return, background isolation, and body scroll locking.
- Preserved routes, theme switching, login/signup, profile, and logout.
  The drawer also exposes the existing authenticated create-event route.
  Logout failures retain a usable drawer and show the existing error toast.
- Desktop resize closes the drawer and releases scroll locking without
  focusing the hidden toggle. Short viewports can scroll the drawer.
- Reused focusRing across navbar and footer controls. Hero focus uses a
  2px yellow ring with a 2px blue offset. Solid-navbar focus retains blue
  in light mode and yellow in dark mode with panel-colored offsets.
- Replaced the switched navbar blur with a persistent background layer
  crossfading over 300ms. Foreground colors transition alongside it.
  Reduced motion disables drawer movement and the active-link spring.
- Tightened tablet navigation spacing to prevent account-label wrapping.
- Flattened the footer into explicit aligned columns with a full-width
  attribution row, shared link colors, and 44px link targets.
- Added 80px document scroll padding for the fixed header.
- Added six drawer regression tests and test-only CRACO mappings for the
  existing app alias and Router 7 exports.

Layout, card components, category tokens, manifests, and lockfiles were not
changed. No dependencies, backend changes, or remote test records were added.

## Files Touched

- `frontend/src/components/Navbar.jsx`
- `frontend/src/components/Footer.jsx`
- `frontend/src/index.css`
- `frontend/src/components/Navbar.test.jsx` (new)
- `frontend/craco.config.js`
- `docs/superpowers/specs/2026-11-19-phase2-navigation-design.md` (new)
- `docs/superpowers/plans/2026-11-19-phase2-navigation-plan.md` (new)
- `docs/phase2-verification.md` (this report)

## Responsive Measurements

Verified using headless Edge 157 and native browser keyboard/touch input.

| Width | Theme | Navbar Height | Shell Target Minimum | Horizontal Overflow |
| --- | --- | --- | --- | --- |
| 375px | Light | 64px | 44px | None |
| 375px | Dark | 64px | 44px | None |
| 768px | Light | 64px | 44px | None |
| 768px | Dark | 64px | 44px | None |
| 1280px | Light | 64px | 44px | None |
| 1280px | Dark | 64px | 44px | None |

Both navbar states and the footer were inspected at all six combinations.
Navbar opacity was between 0 and 1 during the measured transition and reached
1 at completion, with a computed duration of 0.3s and no height change.
At 375px the drawer is 327px wide, leaving a 48px backdrop interaction strip.
The backdrop blur is 4px. At a 320px viewport height its content measures
429px and the panel scrolls.

All 18 drawer browser assertions passed: initial focus, ARIA linkage,
background isolation, scroll lock, target size, Tab/Shift+Tab wrapping,
Escape and focus return, touch scroll blocking, backdrop/close-button taps
in both themes, resize cleanup, short-viewport scrolling, touch route
activation, and reduced motion. Reduced-motion animation/transition duration
computes to 0.00001s, retaining the Phase 1 global convention.

## Contrast Measurements

WCAG relative luminance was calculated from computed browser colors, with
translucent badge backgrounds composited over the dark panel.

| Text | Theme | Before | After | Result |
| --- | --- | --- | --- | --- |
| Social badge | Dark | 7.70:1 | 7.70:1 | Pass, unchanged |
| Living in France badge | Dark | 7.70:1 | 7.70:1 | Pass, unchanged |
| Marketplace badge | Dark | 7.70:1 | 7.70:1 | Pass, unchanged |
| Footer links | Light | 6.37:1 | 6.37:1 | Pass, shared token retained |
| Footer links | Dark | 6.84:1 | 6.84:1 | Pass, shared token retained |

Badge foreground: `rgb(253, 186, 116)`. Badge background:
`rgba(255, 107, 53, 0.2)` over `rgb(20, 27, 39)`, compositing to
`rgb(67, 43, 41.8)`. All three badge styles are identical and exceed 4.5:1.
No category-color correction was needed.

Footer links use `#506173` on `#FFFFFF` in light mode and `#98A4B5` on
`#141B27` in dark mode. The hero ring's `#FFD100` and blue offset's `#010066`
have 12.05:1 contrast with each other.

## Card Keyboard Checks and Data Limitation

The baseline has no Firebase environment configuration. Its development
fallback did not load any real EventCard, PostCard, or ResourceCard records;
live-data verification remains unavailable.

Supplementary tests rendered the actual app components using clearly
synthetic, browser-local React Query cache records. They were reached by
native Tab input, and their visible focus rings were inspected in both
themes. Focused targets were brought into view for capture. No source
fixture code or remote records were created. Remote Firebase requests were
blocked during these supplementary checks.

| Actual Component Target | Light Focus | Dark Focus | Enter |
| --- | --- | --- | --- |
| EventCard link | Blue ring visible | Yellow ring visible | Opened event detail route |
| PostCard title/content link | Blue ring visible | Yellow ring visible | Opened post detail route |
| ResourceCard open action | Blue ring visible | Yellow ring visible | Opened CAF in a new tab |

ResourceCard is not a whole-card link; its existing open action is the
keyboard target. That unchanged action measures 36px high, an existing
card-specific touch-target issue outside the navigation/footer changes.

## Build and Route Checks

- `npm test -- --watchAll=false --runInBand`: six tests passed.
- `npm run build` with temporary BUILD_PATH: compiled successfully.
- Public route shells `/`, `/events`, `/resources`, `/community`, `/cities`,
  `/login`, `/signup`, and the not-found route rendered.
- Internal event/post detail navigation and the external resource action
  passed with synthetic local data.
- Live authenticated flows, real Firebase content, and production Firebase
  initialization could not be verified without environment configuration.

The sandbox denied the default build output directory. Verification used
`BUILD_PATH=C:\Users\ianha\AppData\Local\Temp\rantau-phase2-tests\build`,
without changing application configuration. Intermediate browser scripts,
captures, and generated build files remain outside the source worktree.

No commit, push, PR, or Phase 3 work was performed.
