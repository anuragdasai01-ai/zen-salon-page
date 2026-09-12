import { Phone } from "lucide-react";
import { SALON } from "@/lib/salon";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <a href="#top" className="min-w-0">
          <span className="block font-display text-lg leading-tight font-semibold text-primary">
            {SALON.name}
          </span>
          <span className="block truncate text-[11px] tracking-wide text-muted-foreground uppercase">
            Unisex Salon · Andheri East
          </span>
        </a>
        <div className="flex items-center gap-2">
          <a
            href={SALON.phoneHref}
            aria-label="Call the salon"
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-primary transition-colors hover:bg-secondary"
          >
            <Phone className="size-4" />
          </a>
          <Button asChild size="sm" className="rounded-full">
            <a href="#booking">Book Your Slot</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
