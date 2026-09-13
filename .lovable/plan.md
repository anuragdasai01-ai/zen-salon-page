# Service card tap → booking form sync

## Goal
Tapping any service in the price list must instantly update the booking form's service dropdown and smooth-scroll straight to the date/time picker, with no visible lag or double scroll.

## Current state (verified by reading the code)
- `src/routes/index.tsx` already lifts `bookingServiceId` state and passes it to both `Services` and `Booking`.
- `src/components/salon/services.tsx` renders each service as a button whose `onClick` calls `onServiceSelect(service.id)` then `scrollIntoView({ behavior: "smooth" })` on `#booking`.
- `src/components/salon/booking.tsx` binds the Step 1 `<select>` to the same prop (`value={serviceId}`), so it should already reflect the tapped service.

So the wiring exists — this task is to verify it works end-to-end and remove anything that makes it feel delayed or broken.

## Steps
1. **Verify in the preview (Playwright)**: tap a service card (e.g. a haircut), confirm the booking `<select>` shows that exact service immediately, the tapped card gets its highlight, and the page smooth-scrolls so the booking form (Step 1 service dropdown and Step 2 day picker) is in view. Test with mouse and on a mobile-width viewport.
2. **Fix any issues found**, such as:
   - Scroll landing on the section heading instead of the form: scroll to the booking form card (or adjust the section's `scroll-margin`) so date selection is visible without a second scroll.
   - Delayed/janky scroll: ensure no competing scroll or re-render interrupts the smooth scroll; state update and scroll fire in the same tap handler.
   - Stale select value: confirm the select stays a controlled input bound to `selectedServiceId`.
3. **Re-run typecheck** (`bunx tsgo --noEmit`) and confirm `build-errors.log` shows "build OK", then re-verify the tap flow in the preview.

## Technical notes
- No new files or dependencies; changes confined to `services.tsx` / `booking.tsx` / `index.tsx` if any fix is needed.
- Keep existing plum/gold tokens and button semantics (`aria-pressed`).
