# Bookings in a Google Sheet + email confirmations

## Goal
1. Every booking is written as a row in a Google Sheet.
2. The Sheet decides which times are already taken, so times you block by hand in the Sheet disappear from the site.
3. Each booking sends two emails: one to you (anuragdas.ai.01@gmail.com) and one to the customer.

## What you'll be asked to approve
- Connecting your Google account so the site can create and update the Sheet. I'll create a new sheet named "Enrich Salon Bookings" in your Google Drive and share its link with you.
- Sending email from the site (a Lovable-managed sender address until you want emails from your own domain).

## How it will work
**On booking**
- The booking is saved as it is today, then appended to the Sheet with: date, time, service, duration, price, customer name, phone, email, status, and when it was booked.
- Owner email: service, day, time, customer name, phone, email, plus a WhatsApp link to the customer.
- Customer email: friendly confirmation with service, day, time, price, salon address, phone and hours.
- If the Sheet or an email hiccups, the booking is still confirmed on screen — nothing is lost. The failure is logged so it can be retried.

**On choosing a date/time**
- Taken times come from the Sheet: any row whose status isn't "cancelled" blocks its slot for that service's length.
- The Sheet is read at most once every 30 seconds and cached, so the picker stays fast and the Sheet's usage limits are respected.
- If the Sheet can't be reached, the picker falls back to the saved bookings so the site never shows every slot as free.
- Blocking a slot yourself: add a row in the Sheet with the date and time (service can be "Blocked") and that time disappears from the site.

## Sheet columns
`Booking date | Start time | Service | Duration (min) | Price | Customer name | Phone | Email | Status | Created at`

Row 1 is a frozen header row. Rows are appended newest-last.

## Technical notes
- Google Sheets connector via the Lovable connector gateway; the spreadsheet ID is stored as a project secret so the sheet is created once.
- New server functions in `src/lib/bookings.functions.ts` (or a new `sheets.functions.ts`): `appendBookingRow`, and `getTakenSlots` reads the Sheet (`values/Bookings!A2:J`) with an in-request cache, falling back to the existing Supabase query on error.
- Emails sent from the same server function as the insert, via the managed transactional email path; templates scaffolded with the email templates tool.
- No schema change needed; the existing `bookings` table stays the source of truth for the fallback and for the duplicate-slot guard.
- Booking flow UI is unchanged apart from availability now reflecting the Sheet.
