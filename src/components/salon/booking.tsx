import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CalendarCheck, CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { createBooking, getTakenSlots } from "@/lib/bookings.functions";
import { SALON, SERVICES, serviceById } from "@/lib/salon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const SLOT_STEP = 30;

function istToday() {
  const now = new Date();
  const ist = new Date(now.getTime() + (330 + now.getTimezoneOffset()) * 60000);
  return ist;
}

function toKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function minutesOf(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function label(minutes: number) {
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

const DAYS = 14;

export function Booking() {
  const today = istToday();
  const dates = useMemo(() => {
    const base = istToday();
    return Array.from({ length: DAYS }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  }, []);

  const [serviceId, setServiceId] = useState(SERVICES[0].id);
  const [dateKey, setDateKey] = useState(toKey(today));
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ date: string; time: string; service: string } | null>(null);

  const service = serviceById(serviceId)!;
  const fetchSlots = useServerFn(getTakenSlots);
  const submitBooking = useServerFn(createBooking);
  const queryClient = useQueryClient();

  const range = { from: toKey(dates[0]), to: toKey(dates[dates.length - 1]) };

  const { data: taken = [], isLoading } = useQuery({
    queryKey: ["taken-slots", range.from, range.to],
    queryFn: () => fetchSlots({ data: range }),
    staleTime: 30_000,
  });

  const slots = useMemo(() => {
    const open = SALON.openHour * 60;
    const close = SALON.closeHour * 60;
    const busy = taken
      .filter((t) => t.booking_date === dateKey)
      .map((t) => ({ start: minutesOf(t.start_time), end: minutesOf(t.start_time) + t.duration_min }));

    const nowMinutes = today.getHours() * 60 + today.getMinutes();
    const isToday = dateKey === toKey(today);

    const out: { time: string; minutes: number; available: boolean }[] = [];
    for (let m = open; m + service.duration <= close; m += SLOT_STEP) {
      const clash = busy.some((b) => m < b.end && m + service.duration > b.start);
      const tooLate = isToday && m < nowMinutes + 30;
      out.push({
        time: `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`,
        minutes: m,
        available: !clash && !tooLate,
      });
    }
    return out;
  }, [taken, dateKey, service.duration, today]);

  const mutation = useMutation({
    mutationFn: () =>
      submitBooking({
        data: {
          serviceId: service.id,
          serviceName: service.name,
          durationMin: service.duration,
          date: dateKey,
          time: time!,
          name,
          phone,
          email,
        },
      }),
    onSuccess: (result) => {
      if (!result.ok) {
        setFormError(result.error);
        queryClient.invalidateQueries({ queryKey: ["taken-slots"] });
        return;
      }
      setConfirmed({ date: dateKey, time: time!, service: service.name });
      setFormError(null);
      queryClient.invalidateQueries({ queryKey: ["taken-slots"] });
    },
    onError: () => setFormError("Something went wrong. Please try again or message us on WhatsApp."),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!time) return setFormError("Please pick a time slot.");
    if (name.trim().length < 2) return setFormError("Please enter your name.");
    if (!/^(\+91)?[6-9]\d{9}$/.test(phone.replace(/[\s-]/g, "")))
      return setFormError("Please enter a valid 10-digit mobile number.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return setFormError("Please enter a valid email address.");
    mutation.mutate();
  }

  if (confirmed) {
    const waText = `Hi Enrich Salon, I have booked ${confirmed.service} on ${confirmed.date} at ${label(
      minutesOf(confirmed.time),
    )}. Name: ${name}, Phone: ${phone}.`;
    return (
      <section id="booking" className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-xl px-4 text-center">
          <CheckCircle2 className="mx-auto size-12 text-primary" />
          <h2 className="mt-4 text-3xl font-semibold">Slot confirmed</h2>
          <p className="mt-3 text-muted-foreground">
            {confirmed.service} on{" "}
            {new Date(`${confirmed.date}T00:00:00`).toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}{" "}
            at {label(minutesOf(confirmed.time))}. Please reach 5 minutes early.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild className="rounded-full">
              <a
                href={`https://wa.me/${SALON.whatsapp}?text=${encodeURIComponent(waText)}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="size-4" /> Send details on WhatsApp
              </a>
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                setConfirmed(null);
                setTime(null);
                setName("");
                setPhone("");
                setEmail("");
              }}
            >
              Book another slot
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="bg-secondary/50 py-20">
      <div className="mx-auto max-w-4xl px-4">
        <div className="max-w-2xl">
          <span className="text-xs tracking-widest text-muted-foreground uppercase">Booking</span>
          <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Pick your slot in 30 seconds</h2>
          <p className="mt-3 text-muted-foreground">
            Choose a service, a day in the next two weeks and a time that suits you.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-8 rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-7"
        >
          <div className="space-y-2">
            <Label htmlFor="service">1. Choose a service</Label>
            <select
              id="service"
              value={serviceId}
              onChange={(e) => {
                setServiceId(e.target.value);
                setTime(null);
              }}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              {SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} — ₹{s.price.toLocaleString("en-IN")} · {s.duration} min
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>2. Choose a day</Label>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
              {dates.map((d) => {
                const key = toKey(d);
                const active = key === dateKey;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setDateKey(key);
                      setTime(null);
                    }}
                    className={cn(
                      "min-w-16 shrink-0 rounded-xl border px-3 py-2 text-center transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-secondary",
                    )}
                  >
                    <span className="block text-[11px] uppercase opacity-80">
                      {d.toLocaleDateString("en-IN", { weekday: "short" })}
                    </span>
                    <span className="block text-lg leading-tight font-semibold">{d.getDate()}</span>
                    <span className="block text-[11px] opacity-80">
                      {d.toLocaleDateString("en-IN", { month: "short" })}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>3. Choose a time</Label>
            {isLoading ? (
              <p className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Checking availability…
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {slots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setTime(slot.time)}
                    className={cn(
                      "rounded-lg border px-2 py-2 text-sm transition-colors",
                      time === slot.time
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-secondary",
                      !slot.available && "cursor-not-allowed opacity-35 line-through hover:bg-background",
                    )}
                  >
                    {label(slot.minutes)}
                  </button>
                ))}
              </div>
            )}
            {!isLoading && slots.every((s) => !s.available) && (
              <p className="text-sm text-muted-foreground">
                No slots left for this day. Try the next date or message us on WhatsApp.
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="name">Your name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile number</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
                maxLength={20}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
                required
              />
            </div>
          </div>

          {formError && <p className="text-sm text-destructive">{formError}</p>}

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Button type="submit" size="lg" className="rounded-full" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <CalendarCheck className="size-4" />
              )}
              Confirm my slot
            </Button>
            <p className="text-sm text-muted-foreground">
              {service.name} · {service.duration} min · ₹{service.price.toLocaleString("en-IN")}
              {time ? ` · ${label(minutesOf(time))}` : ""}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
