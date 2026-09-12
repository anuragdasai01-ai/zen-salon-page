CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  duration_min INTEGER NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX bookings_slot_unique ON public.bookings (booking_date, start_time);

GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT ALL ON public.bookings TO service_role;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create a booking"
  ON public.bookings FOR INSERT TO anon, authenticated
  WITH CHECK (
    char_length(customer_name) BETWEEN 2 AND 100
    AND char_length(customer_phone) BETWEEN 8 AND 20
    AND char_length(customer_email) BETWEEN 5 AND 255
    AND booking_date >= (now() AT TIME ZONE 'Asia/Kolkata')::date
    AND booking_date <= ((now() AT TIME ZONE 'Asia/Kolkata')::date + 30)
    AND duration_min BETWEEN 10 AND 300
    AND status = 'confirmed'
  );

CREATE OR REPLACE FUNCTION public.taken_slots(from_date DATE, to_date DATE)
RETURNS TABLE (booking_date DATE, start_time TIME, duration_min INTEGER)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.booking_date, b.start_time, b.duration_min
  FROM public.bookings b
  WHERE b.status = 'confirmed'
    AND b.booking_date >= from_date
    AND b.booking_date <= to_date;
$$;

GRANT EXECUTE ON FUNCTION public.taken_slots(DATE, DATE) TO anon, authenticated, service_role;