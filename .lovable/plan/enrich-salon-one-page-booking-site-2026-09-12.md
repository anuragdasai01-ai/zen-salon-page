# Enrich Salon — one-page booking site

A single scrolling page for Enrich Salon (Tandon Mall, Andheri East, Mumbai) where a visitor can pick a service, grab a time slot, and confirm in under a minute.

## Look and feel

Deep plum/wine as the main colour with soft gold accents on warm off-white. Mobile-first, generous spacing, one clear action on screen at all times, and smooth scrolling between sections.

## Sections, top to bottom

1. **Sticky top bar** — salon name, phone tap-to-call, and a "Book Your Slot" button.
2. **Hero** — "Tired of waiting 30 minutes just for a haircut?" with the sub-headline "Book your slot on WhatsApp or online in just 30 seconds", a primary "Book Your Slot" button that scrolls to booking, and a secondary WhatsApp button opening a chat with +91 87980 41014.
3. **Services and prices** — a clean table grouped into Hair, Skin & Beauty, Nails, and Threading & Waxing, each row showing the service, how long it takes, and the price. Prices use commonly published Enrich rates and carry a small note that they are indicative and confirmed at the salon, so you can correct them any time.
4. **Booking** — pick a service, then a date from the next 14 days, then a time slot from the salon's 10 AM–10 PM day. Slots already booked disappear. Then name, phone and email, and a confirmation message on screen with the option to also send the details to WhatsApp.
5. **Trust** — 15+ years of experience, expert stylists, hygiene and sanitised tools, L'Oréal professional products, unisex, and walk-in-free slot booking. Plus a review strip with star ratings and quotes drawn from the salon's public Google listing, and a simple before/after gallery.
6. **Footer** — full address, phone 87980 41014, hours 10 AM to 10 PM every day, WhatsApp link, and an embedded map of the Tandon Mall location.

## Bookings that are actually saved

Bookings are stored, so you can see who booked what and when, and a slot someone else already took stops showing as available. This needs the built-in backend (Lovable Cloud), which I'll switch on as the first step — no account or setup needed from you.

Anyone can create a booking; nobody can read other people's bookings from the site. Free slots are worked out from a safe count of taken slots, never by exposing customer details.

## Photos

Review avatars, before/after images and the section backdrops will be generated placeholders in the salon's colour palette. Send me real salon photos any time and I'll swap them in.

## Technical notes

- Enable Lovable Cloud; migration creates `public.bookings` (service, date, start time, duration, name, phone, email, status) with grants, RLS, an anon INSERT policy, and a unique constraint on (date, start time) to prevent double booking.
- Availability read through a public server function using the publishable key, returning only taken time slots for a date range — never customer rows.
- Booking write through a server function with Zod validation on name, phone (Indian 10-digit), email, and a re-check that the slot is still free.
- Slot grid generated client-side from opening hours (10:00–22:00) and the selected service duration, then filtered against taken slots via TanStack Query.
- Services and copy live in a typed data module so prices are easy to edit.
- Home page is `src/routes/index.tsx` with its own head() title/description/OG tags; plum palette added as oklch tokens in `src/styles.css`; smooth scroll via anchor scrolling with scroll-margin offsets for the sticky bar.
