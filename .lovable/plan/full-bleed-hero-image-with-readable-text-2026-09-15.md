# Full-bleed hero image with readable text

Make the hero photograph the hero: no tint, no overlay — the salon interior shows at full strength. Text and buttons get a subtle drop shadow so the white heading, sub-headline, badge and outline button stay crisp and easy to read over the photo.

## Changes

`**src/components/salon/hero.tsx**`

- Show the background photo at full opacity (`opacity-30` removed) so it fills the section edge to edge.
- Remove the visible overlay treatment; keep the deep plum gradient only as a behind-the-image fallback (it never shows while the photo loads).
- Add a subtle drop shadow to the white content so it pops over the photo:
  - H1 headline and sub-headline: soft text shadow.
  - "15+ years · Unisex salon" badge text: same soft shadow.
  - "Book on WhatsApp" outline button: drop shadow on the button so its white text and border separate from the photo.
  - The gold "Book Your Slot" button already contrasts strongly; shadow kept light there.
  - The "Open …" hours line: same soft shadow.

`**src/styles.css**`

- Add one reusable text-shadow token in the design system (oklch-based dark shadow, soft blur, low offset) plus a `@utility` so the hero (and future sections) use a semantic class instead of hardcoded styles. Follows the existing `@utility shadow-soft` pattern.

## Verification

- Build check: `/tmp/observability/build-errors.log` shows "build OK".
- Playwright screenshot of the hero on desktop (1280px) and mobile (360px, the current preview) to confirm the photo is fully visible, the overlay is gone, and the white heading, badge, and both buttons are clearly readable — no console errors.