import { SERVICES, SERVICE_CATEGORIES } from "@/lib/salon";
import { cn } from "@/lib/utils";

interface ServicesProps {
  selectedServiceId: string;
  onServiceSelect: (id: string) => void;
}

function scrollToBooking() {
  document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Services({ selectedServiceId, onServiceSelect }: ServicesProps) {
  return (
    <section id="services" className="mx-auto max-w-6xl px-4 py-20">
      <div className="max-w-2xl">
        <span className="text-xs tracking-widest text-muted-foreground uppercase">Services & prices</span>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Everything, priced upfront</h2>
        <p className="mt-3 text-muted-foreground">
          Hair, skin, nails and grooming for men, women and kids. Tap any service to book it — prices are indicative
          and confirmed at the salon before your service begins.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {SERVICE_CATEGORIES.map((category) => (
          <div key={category} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h3 className="text-xl font-semibold text-primary">{category}</h3>
            <ul className="mt-4 divide-y divide-border">
              {SERVICES.filter((s) => s.category === category).map((service) => {
                const selected = service.id === selectedServiceId;
                return (
                  <li key={service.id} className="py-1">
                    <button
                      type="button"
                      aria-label={`Book ${service.name}`}
                      aria-pressed={selected}
                      onClick={() => {
                        onServiceSelect(service.id);
                        scrollToBooking();
                      }}
                      className={cn(
                        "flex w-full items-baseline justify-between gap-4 rounded-xl px-3 py-2 text-left transition-colors",
                        "hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                        selected && "bg-primary/10 ring-1 ring-gold/50",
                      )}
                    >
                      <span>
                        <span className={cn("block font-medium", selected && "text-primary")}>{service.name}</span>
                        <span className="block text-xs text-muted-foreground">{service.duration} min</span>
                      </span>
                      <span className="shrink-0 font-display text-lg font-semibold">
                        ₹{service.price.toLocaleString("en-IN")}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
