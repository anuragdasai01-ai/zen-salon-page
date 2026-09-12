import { Clock, MessageCircle, Star } from "lucide-react";
import heroImage from "@/assets/hero-salon.jpg";
import { SALON } from "@/lib/salon";
import { Button } from "@/components/ui/button";

const whatsappLink = `https://wa.me/${SALON.whatsapp}?text=${encodeURIComponent(
  "Hi Enrich Salon, I'd like to book a slot.",
)}`;

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-plum-gradient">
      <img
        src={heroImage}
        alt="Interior of Enrich Salon in Andheri East with plum walls and gold-framed mirrors"
        width={1600}
        height={1104}
        className="absolute inset-0 size-full object-cover opacity-30"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 text-xs tracking-widest text-gold uppercase">
            <Star className="size-3 fill-current" /> 15+ years · Unisex salon
          </span>
          <h1 className="mt-6 text-4xl leading-[1.1] font-semibold text-primary-foreground sm:text-6xl">
            Tired of waiting 30 minutes just for a haircut?
          </h1>
          <p className="mt-5 text-lg text-primary-foreground/80">
            Book your slot on WhatsApp or online in just 30 seconds.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full bg-gold text-gold-foreground hover:bg-gold/90">
              <a href="#booking">Book Your Slot</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <a href={whatsappLink} target="_blank" rel="noreferrer">
                <MessageCircle className="size-4" /> Book on WhatsApp
              </a>
            </Button>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-primary-foreground/70">
            <Clock className="size-4" /> Open {SALON.hours}
          </p>
        </div>
      </div>
    </section>
  );
}
