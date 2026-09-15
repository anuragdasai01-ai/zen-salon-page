# Finish and verify the sheet + email bookings

The code is complete and the site now builds cleanly with no errors. What's left is proving it works with a real test booking.

## Verification steps

1. Make a test booking on the live preview (a test service, a date a few days out, a test name/phone and your email address).
2. Check the Enrich Salon Bookings sheet has a new row with date, time, service, duration, price, name, phone, email, status and created-at.
3. Confirm two emails went out: the customer confirmation (to the test email) and the owner notification to anuragdas.ai.01@gmail.com.
4. Reload the booking picker and confirm the time just booked no longer appears as free.
5. Add a row by hand in the sheet (service "Blocked") and confirm that time disappears from the site within about half a minute.
6. Clean up: mark the test row's status as "cancelled" so the slot frees up again.

## If something fails

- No sheet row: read the server logs for the sheet error and fix the request or reconnect the Google account.
- No email: read the send error; the most likely cause is a missing send permission on the connected Gmail account, which needs a quick reconnect approval from you.
- Booking still saves and confirms on screen even if the sheet or email fails, so no customer request is ever lost.

## Technical notes

- Test drives the real preview at localhost with Playwright; sheet and email checks go through the connector gateway.
- No code changes are expected unless a step fails.
