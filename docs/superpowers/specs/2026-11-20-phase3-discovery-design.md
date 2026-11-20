# Phase 3: Discovery and City Hubs

## Baseline and Boundaries

Work in `c:\Users\ianha\githubrepo\rantau` on `phase3-trae`, created directly
from Phase 2 commit `a0fb2ab` after confirming it in `git log --oneline -5`.
The starting working tree was clean.

Refine Home, WeeklyDigest, Cities, and CityHub. Preserve branding, factual
copy, images, data fetching, authentication, contributions, and routes.
Reuse the existing color tokens, focusRing, cards, and installed libraries.
Do not add dependencies, commit, push, open a PR, or begin Phase 4.

## Approved Direction

Focused refinement rather than a broader redesign:

- Replace the desktop hero's scattered decorative cards with one stable,
  balanced summary group using the existing Events, Guides, and Community
  labels and icons. Preserve the mobile-first hero and its calls to action.
  Remove the mobile Quick Links negative margin; retain a controlled overlap
  only at larger breakpoints where sufficient hero padding exists.
- Give WeeklyDigest's events column more space at tablet width, with
  independently shrinkable columns. Keep it stacked on mobile and balanced
  on desktop. Preserve event filtering, city persistence, and profile choice.
- Keep the native city selector and its keyboard behavior. Give it an
  accessible label, a minimum 44px height, distinct hover and focus styling,
  and a persistent selected-value treatment using text and weight as well
  as color. Rely on native selection semantics; do not add `aria-selected`
  or `aria-pressed` to the options or control.
  The selected city must match the heading, events, tips, and hub link.
- Keep Cities' one/two/three-column progression. Align image geometry,
  metadata, and arrow placement. Apply focusRing to the actual city links,
  with keyboard focus elevation equivalent to hover. Respect reduced motion.
- Change CityHub's places/tips layout to `lg:grid-cols-12`, with seven
  columns for places and five for tips. Stack below desktop and prevent
  long content from expanding either column.
- Give the CityHub MapView an explicit 320px minimum height and matching
  definite height at every tested width. Keep this sizing local to CityHub
  so EventDetail is unaffected. Keep map stacking below the navbar and
  mobile drawer without hiding attribution or controls.

Keep touched links and buttons at least 44px high. Use the shared focusRing
utility, including a readable yellow/blue treatment over the hero. Existing
loading and empty states remain usable. Do not redesign shared feed cards
or contribution forms, which belong to later phases.

## Verification

Run the existing six navbar regression tests from their current location.
Keep all new Phase 3 test scripts, screenshots, results, and builds outside
the repository; do not add test files to the source tree.
Run a production build and report configuration limitations separately.

Inspect `/`, `/cities`, and a valid `/cities/:cityId` at 375px, 768px, and
1280px in light and dark themes. Measure overflow, hero/Quick Links spacing,
digest column widths, city card geometry, touch targets, and map height.
Check city selection with keyboard and touch emulation, visible hover/focus,
native selected state, persistence, and corresponding content/link updates.

For the real Leaflet map, confirm successful tile responses and loaded tile
images, valid container dimensions, and correct rendering after changing
themes. Confirm map stacking stays below the navbar and open mobile drawer;
also recheck the drawer's focus management and scroll locking.
Resize from 1023px to 1024px and back, and switch themes after resizing.
Confirm loaded tiles cover the whole map without gray gaps. If sizing is
stale, synchronize it through the existing Leaflet instance, without adding
a dependency or remounting the map.

Do not create remote records to test content. If live Firebase data remains
unavailable, distinguish that limitation from clearly labelled local-fixture
checks. Keep intermediate scripts, screenshots, and builds outside the repo.

## Handoff

Leave changes uncommitted on `phase3-trae`. Report changed files, test results,
viewport/theme checks, measured dimensions, and any remaining limitations.
Stop and wait for the user's approval before Phase 4.
