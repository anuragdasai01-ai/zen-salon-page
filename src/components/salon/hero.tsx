import { Clock, MessageCircle, Star } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import heroImage from "@/assets/hero-salon.jpg";
import { SALON } from "@/lib/salon";
import { Button } from "@/components/ui/button";

const whatsappLink = `https://wa.me/${SALON.whatsapp}?text=${encodeURIComponent(
  "Hi Enrich Salon, I'd like to book a slot.",
)}`;

const EASE = [0.22, 1, 0.36, 1] as const;

const rise = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

export function Hero() {
  const reduceMotion = useReducedMotion();

  const photo = {
    initial: reduceMotion ? false : { scale: 1.06 },
    animate: { scale: 1 },
    transition: { duration: reduceMotion ? 0 : 1.6, ease: EASE },
  };
  const group = {
    hidden: {},
    show: { transition: { staggerChildren: reduceMotion ? 0 : 0.12 } },
  };
  const item = reduceMotion
    ? {}
    : {
        variants: rise,
        transition: { duration: 0.55, ease: EASE },
      };

  return (
    <section id="top" className="relative overflow-hidden bg-plum-gradient">
      <motion.img
        src={heroImage}
        alt="Interior of Enrich Salon in Andheri East with plum walls and gold-framed mirrors"
        width={1600}
        height={1104}
        {...photo}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
        <motion.div
          className="max-w-2xl"
          initial={reduceMotion ? false : "hidden"}
          animate="show"
          variants={group}
        >
          <motion.span
            {...item}
            className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-3 py-1 text-xs tracking-widest text-gold uppercase text-shadow-photo"
          >
            <Star className="size-3 fill-current" /> 15+ years · Unisex salon
          </motion.span>
          <motion.h1
            {...item}
            className="mt-6 text-4xl leading-[1.1] font-semibold text-primary-foreground text-shadow-photo sm:text-6xl"
          >
            Tired of waiting 30 minutes just for a haircut?
          </motion.h1>
          <motion.p
            {...item}
            className="mt-5 text-lg text-primary-foreground/90 text-shadow-photo"
          >
            Book your slot on WhatsApp or online in just 30 seconds.
          </motion.p>
          <motion.div
            {...item}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <motion.div {...(reduceMotion ? {} : { whileHover: { y: -2 } })}>
              <Button
                asChild
                size="lg"
                className="rounded-full bg-gold text-gold-foreground hover:bg-gold/90"
              >
                <a href="#booking">Book Your Slot</a>
              </Button>
            </motion.div>
            <motion.div {...(reduceMotion ? {} : { whileHover: { y: -2 } })}>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-primary-foreground/40 bg-transparent text-primary-foreground shadow-photo hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <a href={whatsappLink} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-4" /> Book on WhatsApp
                </a>
              </Button>
            </motion.div>
          </motion.div>
          <motion.p
            {...item}
            className="mt-6 flex items-center gap-2 text-sm text-primary-foreground/80 text-shadow-photo"
          >
            <Clock className="size-4" /> Open {SALON.hours}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
