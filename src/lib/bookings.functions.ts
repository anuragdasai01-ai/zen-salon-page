import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { serviceById } from "./salon";

type TakenSlot = { booking_date: string; start_time: string; duration_min: number };

function serverClient() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const rangeSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

async function takenFromDatabase(from: string, to: string): Promise<TakenSlot[]> {
  const supabase = serverClient();
  const { data: rows, error } = await supabase
    .from("bookings")
    .select("booking_date, start_time, duration_min")
    .eq("status", "confirmed")
    .gte("booking_date", from)
    .lte("booking_date", to);

  if (error) {
    console.error("Failed to load taken slots", error.message);
    return [];
  }

  return (rows ?? []).map((r) => ({
    booking_date: String(r.booking_date),
    start_time: String(r.start_time).slice(0, 5),
    duration_min: Number(r.duration_min),
  }));
}

// The Google Sheet is the master record of taken times, so rows the owner adds
// by hand also block slots. If the sheet is unreachable we fall back to the
// saved bookings rather than showing every slot as free.
export const getTakenSlots = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => rangeSchema.parse(data))
  .handler(async ({ data }): Promise<TakenSlot[]> => {
    const { readSheetSlots } = await import("./sheets.server");
    const sheetRows = await readSheetSlots();
    if (sheetRows) {
      return sheetRows.filter((r) => r.booking_date >= data.from && r.booking_date <= data.to);
    }
    return takenFromDatabase(data.from, data.to);
  });

const bookingSchema = z.object({
  serviceId: z.string().min(1).max(60),
  serviceName: z.string().min(1).max(120),
  durationMin: z.number().int().min(10).max(300),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine((v) => /^(\+91)?[6-9]\d{9}$/.test(v), "Enter a valid 10-digit Indian mobile number"),
  email: z.string().trim().email().max(255),
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bookingSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = serverClient();
    const { readSheetSlots, appendBookingRow } = await import("./sheets.server");
    const { sendBookingEmails } = await import("./booking-emails.server");

    const toMinutes = (t: string) => {
      const [h = 0, m = 0] = t.split(":").map(Number);
      return h * 60 + m;
    };
    const start = toMinutes(data.time);
    const end = start + data.durationMin;

    // The sheet is the master record of taken times.
    const sheetRows = await readSheetSlots();
    const sheetClash = (sheetRows ?? []).some((r) => {
      if (r.booking_date !== data.date) return false;
      const rStart = toMinutes(r.start_time);
      return start < rStart + r.duration_min && end > rStart;
    });
    if (sheetClash) {
      return { ok: false as const, error: "That slot was just taken. Please pick another time." };
    }

    const { data: existing } = await supabase
      .from("bookings")
      .select("booking_date, start_time")
      .eq("status", "confirmed")
      .eq("booking_date", data.date)
      .eq("start_time", data.time);

    if (existing && existing.length > 0) {
      return { ok: false as const, error: "That slot was just taken. Please pick another time." };
    }

    const { error } = await supabase.from("bookings").insert({
      service_id: data.serviceId,
      service_name: data.serviceName,
      duration_min: data.durationMin,
      booking_date: data.date,
      start_time: data.time,
      customer_name: data.name,
      customer_phone: data.phone,
      customer_email: data.email,
      status: "confirmed",
    });

    if (error) {
      console.error("Booking insert failed", error.message);
      const taken = error.code === "23505" || error.message.includes("duplicate");
      return {
        ok: false as const,
        error: taken
          ? "That slot was just taken. Please pick another time."
          : "We couldn't save your booking. Please try again or message us on WhatsApp.",
      };
    }

    // Sheet row + notification emails must never fail the confirmed booking.
    const price = serviceById(data.serviceId)?.price ?? 0;
    try {
      await appendBookingRow({
        date: data.date,
        time: data.time,
        serviceName: data.serviceName,
        durationMin: data.durationMin,
        price,
        name: data.name,
        phone: data.phone,
        email: data.email,
      });
    } catch (sheetError) {
      console.error("Sheet append threw", sheetError);
    }

    try {
      await sendBookingEmails({
        serviceName: data.serviceName,
        durationMin: data.durationMin,
        price,
        date: data.date,
        time: data.time,
        name: data.name,
        phone: data.phone,
        email: data.email,
      });
    } catch (mailError) {
      console.error("Booking emails threw", mailError);
    }

    return { ok: true as const };
  });
