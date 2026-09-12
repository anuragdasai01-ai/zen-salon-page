import { SERVICES, SERVICE_CATEGORIES } from "@/lib/salon";

export function Services() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-4 py-20">
      <div className="max-w-2xl">
        <span className="text-xs tracking-widest text-muted-foreground uppercase">Services & prices</span>
        <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Everything, priced upfront</h2>
        <p className="mt-3 text-muted-foreground">
          Hair, skin, nails and grooming for men, women and kids. Prices are indicative and confirmed at
          the salon before your service begins.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        {SERVICE_CATEGORIES.map((category) => (
          <div key={category} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <h3 className="text-xl font-semibold text-primary">{category}</h3>
            <ul className="mt-4 divide-y divide-border">
              {SERVICES.filter((s) => s.category === category).map((service) => (
                <li key={service.id} className="flex items-baseline justify-between gap-4 py-3">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.duration} min</p>
                  </div>
                  <p className="shrink-0 font-display text-lg font-semibold">
                    ₹{service.price.toLocaleString("en-IN")}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
