# Phase 2: Navigation and Global Shell

## Scope and Constraints

Refine Navbar, Footer, and their integration in Layout, carrying forward the
three requested Phase 1 accessibility checks. Preserve the current branding,
copy, routes, authentication actions, theme toggle, color tokens, focusRing
utility, reduced-motion support, and touch-target conventions.

Work only on phase2-trae in the original checkout at
`c:\Users\ianha\githubrepo\rantau`, based on commit 6224da5.
The implementation was transferred here from the isolated worktree at the
user's request. Antigravity's work is preserved in a named stash.
Do not add dependencies, commit, push, open a PR, or begin Phase 3.
Documentation and implementation changes remain uncommitted.

## Approach

Use the already installed Radix Dialog primitives for a right-side modal
navigation drawer. This is preferred over a custom focus trap, which would
duplicate accessibility infrastructure, or the existing Vaul bottom drawer,
which would introduce a different navigation interaction.

Keep the drawer implementation local to navigation. Do not restyle shared
dialog primitives used by unrelated screens. Reuse existing utility classes
and focusRing rather than introducing a new design system.

## Mobile Drawer

- Keep the mobile breakpoint below 768px and the existing navigation routes.
- The menu toggle controls a stable `nav-mobile-menu` id and exposes its open
  state through aria-expanded and aria-controls.
- Render a labelled modal dialog in a portal, above the fixed navbar, with a
  dimmed, blurred backdrop and an opaque theme-aware panel.
- Move focus to the first navigation link on open. Trap Tab and Shift+Tab
  inside the drawer; prevent interaction with background content.
- Close on Escape, backdrop interaction, the explicit close button, or link
  activation. Return focus to the toggle when closing on mobile.
- Close when moving to desktop width, without focusing the now-hidden toggle.
  Restore background scrolling on every close and on unmount.
- Lock body scrolling while open; keep the drawer itself scrollable on short
  viewports, with safe-area spacing where appropriate.
- Preserve authenticated profile and logout actions and anonymous login and
  signup actions. Include the existing create-event route for authenticated
  users so it remains reachable in the drawer.
- Every navigation link, account action, and close button has an actual
  minimum height of 44px. Icon-only controls also have a minimum width of 44px.
- Preserve logout behavior and existing error handling conventions.

## Navbar Focus and Transition

Apply focusRing to all interactive navbar elements, including the logo,
desktop links, theme toggle, account actions, and drawer toggle.

On the transparent hero navbar, use the existing yellow token for a 2px ring
with a 2px blue offset. The two-color treatment must remain distinguishable
across the gradient; inspect it in the real browser. On the solid navbar,
retain the standard blue ring in light mode and yellow ring in dark mode,
with the panel-colored offset from focusRing.

Preserve the existing scroll trigger unless browser evidence shows that it
must change to meet the requested transition behavior. Fade a persistent
background layer, including its blur, border, and shadow, instead of toggling
the blur abruptly. Transition foreground colors alongside the background.
Do not change navbar height or layout during the transition.

Respect prefers-reduced-motion for CSS effects and the Framer Motion active
indicator. No sliding or spring movement is required under reduced motion.

## Footer and Layout

Use explicit, consistently aligned grid tracks for the brand, Explore, and
Official portals groups. Keep attribution and legal copy aligned without
squeezing the two link groups into a single narrow desktop grid track.
Use a stacked or two-column arrangement as space requires on mobile and
tablet. Preserve all existing text, destinations, and external-link behavior.

Use the existing ink-muted token for links in both themes and ink for their
hover state. Reuse focusRing, and give footer links actual 44px minimum-height
targets on mobile. Keep heading and link spacing consistent between groups.
Measure normal link contrast against the panel in light and dark mode.

Keep Layout's fixed-header spacing, route transitions, footer placement, and
toaster working. Change Layout only where necessary for drawer integration.

## Phase 1 Carryover Checks

Tab to a real rendered EventCard link, PostCard title/content link, and
ResourceCard open link. Inspect the visible focus treatment in both themes
and press Enter. Record the actual internal destination or external tab
opened. ResourceCard is not a whole-card link; its open action is the
appropriate keyboard target.

Use real app content where available. Do not seed, alter, approve, vote on,
or create remote records solely to facilitate testing. If the available data
does not contain a required card or category, explicitly report the gap;
do not claim a fixture test is a real-data test.

Measure Social, Living in France, and Marketplace badges in dark mode using
computed foreground and alpha-composited background colors. Account for the
underlying panel or surface color. Calculate WCAG relative luminance and
contrast ratio; fix only categories below 4.5:1 and measure again. Preserve
passing Phase 1 colors.

If card keyboard checks expose a focus defect, make the smallest correction
using focusRing. Do not redesign card content, voting, or resource behavior.

## Verification and Handoff

Run the development server from the isolated worktree on a port that does
not conflict with the other session. Do not add dependencies or modify
package manifests. Keep intermediate test scripts and captures outside
the source checkout.

Verify the shell at widths 375px, 768px, and 1280px, in light and dark mode.
Inspect navbar top and scrolled states, footer alignment, text wrapping,
horizontal overflow, and control bounds.

At 375px, verify the drawer using keyboard and touch emulation: opening,
initial focus, Tab wrapping, Escape, backdrop close, close-button behavior,
link navigation, focus return, and scroll lock/restoration. Also verify
closing the drawer by resizing to desktop and using a short viewport.

Check reduced-motion behavior and smoke-test the existing public routes and
authentication entry routes without modifying accounts. Run a production
build and available relevant tests, reporting pre-existing failures or
environmental limitations honestly.

Finish with a concise summary of implementation changes, exact touched files,
viewport/theme results, focus and Enter outcomes, touch-target measurements,
and before/after contrast ratios. Confirm changes are uncommitted on
phase2-trae, then stop for approval before Phase 3.

## Design Review

The design uses only installed libraries and existing tokens. All requested
behaviors and measurements are covered. No backend, data, route, content,
or unrelated component redesign is included.
