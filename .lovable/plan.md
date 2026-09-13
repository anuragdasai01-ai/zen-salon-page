# Clickable service cards → prefill booking

Make every service row in the Services section clickable: clicking it selects that service in the booking form's Step 1, smooth-scrolls to the booking section, and leaves the form ready for date/time selection.

## Current state (verified)

- `src/components/salon/services.tsx` renders each service as a static `<li>` (name, duration, price) — not interactive.
- `src/components/salon/booking.tsx` owns `const [serviceId, setServiceId] = useState(SERVICES[0]!.id)` internally and renders `#booking` in two branches (confirmed + form). Selecting a service already resets the chosen time to null.
- `src/routes/index.tsx` composes `<Services />` and `<Booking />` as siblings.

## Changes

### 1. Lift the selected service to the page (`src/routes/index.tsx`)

- Add `const [bookingServiceId, setBookingServiceId] = useState(SERVICES[0]!.id)` in `index.tsx`.
- Pass `selectedServiceId={bookingServiceId}` and `onServiceSelect={...}` to both `<Services />` and `<Booking />`.

### 2. Booking accepts controlled service (`src/components/salon/booking.tsx`)

- Props: `selectedServiceId: string`, `onServiceSelect: (id: string) => void`.
- Replace internal `serviceId` state with `selectedServiceId`; the existing `<select>` onChange calls `onServiceSelect` (time stays reset to null, as today).
- Add a small `useEffect` keyed on `selectedServiceId`: when it changes, clear the picked time; if the "Slot confirmed" screen is showing, dismiss it so the user lands back on the fresh form.

### 3. Services rows become buttons (`src/components/salon/services.tsx`)

- Each service `<li>` becomes a full-width `<button type="button">` (keeps the current layout: name + duration left, price right).
- On click: call `onServiceSelect(service.id)`, then scroll `document.getElementById("booking")` into view with `behavior: "smooth"` (CSS `scroll-margin` offset already exists for the sticky header).
- Visual feedback: the row for the currently selected service gets a subtle highlighted state (gold/plum accent token) and the whole row shows a hover/active affordance with an `aria-label` like "Book <service name>".
- Keyboard accessible by default since these are real buttons.

## What stays the same

- No changes to pricing data, booking storage, validation, or the slot grid.
- No new dependencies; plum/gold semantic tokens only.

## Verification

- `bunx tsgo --noEmit` and check `/tmp/observability/build-errors.log`.
- Playwright: click a service card, confirm the booking section's Step 1 select shows that service, the page scrolled to `#booking`, and no console errors.
