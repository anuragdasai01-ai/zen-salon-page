# Premium three-dot salon navigation

Add the selected sophisticated minimalist navigation to the existing sticky header, using Enrich Salon’s plum, gold, warm off-white, Cormorant Garamond, and Karla styling.

## Header and menu

- Keep the salon name and location line visible in the sticky header.
- Add a touch-friendly vertical three-dot button with an accessible label and clear open/close states.
- Open a polished warm-off-white menu directly beneath the header, with numbered editorial links:
  1. Home
  2. Booking
  3. Services
  4. Location
  5. Contact Us
- Use plum typography, restrained gold details, fine separators, and generous spacing to match the selected minimalist direction.
- Preserve the existing call and booking actions without crowding the mobile header; arrange controls responsively for wider screens.

## Interaction

- Smoothly scroll each item to its matching section.
- Give Location its own target at the map area, while Contact Us goes to the address and contact details.
- Close the menu after selecting a link, when tapping outside, or when pressing Escape.
- Lock focus appropriately, expose expanded state to screen readers, and keep all tap targets comfortably sized.
- Animate the menu and links with a short, calm reveal, while respecting reduced-motion preferences.

## Validation

- Check the closed and open header at mobile and desktop widths.
- Verify every destination scrolls correctly and the menu closes afterward.
- Confirm keyboard controls, outside-click dismissal, and no visual overlap with the page.
- Confirm the app remains error-free after the change.

## Technical details

- Implement the stateful menu inside the existing header component and continue using the shared Button component for the menu trigger.
- Add only the minimum location anchor needed in the footer; keep all existing page content and booking behavior unchanged.
- Use existing semantic design tokens and typography utilities rather than introducing hardcoded colors.
