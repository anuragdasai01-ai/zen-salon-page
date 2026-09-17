# Hero entrance animation with Framer Motion

Animate the hero content on load: the salon photo stays fully visible (no new overlay), while the badge, headline, sub-headline, buttons and hours line reveal in a calm, staggered sequence that fits the premium plum/gold aesthetic.

## Changes

**Install `motion`** (the current Framer Motion package, imported as `motion/react`) — supports React 19 and SSR, so it is safe in this TanStack Start setup.

**`src/components/salon/hero.tsx`**

- Wrap the text container elements in `motion` components with a shared staggered sequence:
  - Photo: slow, subtle scale-down from ~1.06 to 1 (gentle "settling" motion, no fade — the image stays full-strength).
  - Badge: fade + slight rise.
  - H1 headline: fade + rise, slightly larger travel and later start than the badge.
  - Sub-headline, button row, hours line: fade + rise in sequence.
- Timing: soft ease-out, total sequence under ~1 second, small delays between items so it feels composed, not flashy.
- Keep all existing classes (`text-shadow-photo`, `shadow-photo`, gold button styles) exactly as they are — animation adds transforms/opacity only, so the readability work is untouched.
- Add `whileHover` micro-interaction on the two CTA buttons (tiny lift) — subtle, optional flourish.
- Respect `useReducedMotion()`: when the user prefers reduced motion, elements appear immediately with no movement.

## Verification

- Build check: `/tmp/observability/build-errors.log` shows "build OK".
- Playwright screenshot of the hero mid-animation and after settling at desktop (1280px) and mobile (360px) to confirm the sequence plays, the photo has no tint, and text stays crisp — no console errors.
