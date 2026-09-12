import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import { SALON } from "@/lib/salon";

export function SiteFooter() {
  return (
    <footer id="contact" className="bg-plum-gradient text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold">Visit us in Andheri East</h2>
          <ul className="mt-6 space-y-4 text-sm text-primary-foreground/85">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-gold" />
              <span>{SALON.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-5 shrink-0 text-gold" />
              <a href={SALON.phoneHref} className="hover:underline">
                {SALON.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <MessageCircle className="mt-0.5 size-5 shrink-0 text-gold" />
              <a
                href={`https://wa.me/${SALON.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline"
              >
                Message us on WhatsApp
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-gold" />
              <span>{SALON.hours}</span>
            </li>
          </ul>
          <a
            href={SALON.mapLink}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block text-sm text-gold hover:underline"
          >
            Open in Google Maps
          </a>
        </div>

        <div className="overflow-hidden rounded-2xl border border-primary-foreground/20">
          <iframe
            title="Map showing Enrich Salon at Tandon Mall, Andheri East"
            src={SALON.mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-72 w-full lg:h-full"
          />
        </div>
      </div>
      <div className="border-t border-primary-foreground/15 py-6 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} {SALON.name}, Andheri East. Prices indicative and confirmed at the salon.
      </div>
    </footer>
  );
}
