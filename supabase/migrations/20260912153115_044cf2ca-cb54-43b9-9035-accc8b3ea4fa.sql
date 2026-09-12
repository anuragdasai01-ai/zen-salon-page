DROP FUNCTION IF EXISTS public.taken_slots(DATE, DATE);

GRANT SELECT (booking_date, start_time, duration_min, status) ON public.bookings TO anon, authenticated;

CREATE POLICY "Anyone can see which slots are taken"
  ON public.bookings FOR SELECT TO anon, authenticated
  USING (status = 'confirmed');