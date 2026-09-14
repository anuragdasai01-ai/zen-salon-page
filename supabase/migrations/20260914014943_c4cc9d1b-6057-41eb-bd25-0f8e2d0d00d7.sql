-- Restrict public reads on bookings to slot-availability columns only.
-- Customer PII (customer_name, customer_phone, customer_email, service_id, service_name, id, created_at)
-- must not be readable by anon/authenticated roles.

REVOKE SELECT ON public.bookings FROM anon, authenticated;

GRANT SELECT (booking_date, start_time, duration_min, status) ON public.bookings TO anon, authenticated;

-- INSERT policy/grants unchanged; service_role retains full access.
-- Existing RLS policy 'Anyone can see which slots are taken' still applies to the granted columns.