import { BadgeCheck, Star } from "lucide-react";
import { BeforeAfterSlider } from "@/components/salon/before-after-slider";
import { BENEFITS, CERTIFICATIONS, REVIEWS } from "@/lib/salon";

export function Trust() {
  return (
    <section id="why-us" className="mx-auto max-w-6xl px-4 py-20">
      <div className="max-w-2xl">
        <span className="text-xs tracking-widest text-muted-foreground uppercase">Why Enrich</span>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
          Fifteen years of regulars who don't wait in line
        </h2>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((benefit) => (
          <div key={benefit.title} className="rounded-2xl border border-border bg-card p-5">
            <BadgeCheck className="size-6 text-primary" />
            <h3 className="mt-3 text-lg font-semibold">{benefit.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{benefit.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-2xl font-semibold">Before & after</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            A smoothening and blow-dry finish from our stylists.
          </p>
          <BeforeAfterSlider />
          <ul className="mt-6 space-y-2">
            {CERTIFICATIONS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-semibold">What guests say</h3>
          <p className="mt-2 text-sm text-muted-foreground">Rated 4.3★ by guests on Google.</p>
          <div className="mt-4 space-y-4">
            {REVIEWS.map((review) => (
              <blockquote key={review.name} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-1 text-gold">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm">"{review.text}"</p>
                <footer className="mt-3 text-xs tracking-wide text-muted-foreground uppercase">
                  {review.name}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
