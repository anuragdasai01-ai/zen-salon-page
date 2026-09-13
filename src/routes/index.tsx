import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/salon/site-header";
import { Hero } from "@/components/salon/hero";
import { Services } from "@/components/salon/services";
import { Booking } from "@/components/salon/booking";
import { Trust } from "@/components/salon/trust";
import { SiteFooter } from "@/components/salon/site-footer";
import { SERVICES } from "@/lib/salon";

const title = "Enrich Salon Andheri East | Book a Haircut Slot in 30 Seconds";
const description =
  "Unisex salon at Tandon Mall, Andheri East, Mumbai. See prices for haircuts, colour, facials and nails, and book your time slot online or on WhatsApp.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [bookingServiceId, setBookingServiceId] = useState(SERVICES[0]!.id);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <Services
          selectedServiceId={bookingServiceId}
          onServiceSelect={setBookingServiceId}
        />
        <Booking
          selectedServiceId={bookingServiceId}
          onServiceSelect={setBookingServiceId}
        />
        <Trust />
      </main>
      <SiteFooter />
    </div>
  );
}
