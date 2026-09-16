import { useEffect, useRef, useState } from "react";
import { MoreVertical, Phone, X } from "lucide-react";
import { SALON } from "@/lib/salon";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { label: "Home", href: "#top" },
  { label: "Booking", href: "#booking" },
  { label: "Services", href: "#services" },
  { label: "Location", href: "#location" },
  { label: "Contact Us", href: "#contact" },
] as const;

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const firstLink = menuRef.current?.querySelector<HTMLAnchorElement>("a[href]");
    firstLink?.focus();

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = menuRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]");
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const goToSection = (href: string) => {
    setIsOpen(false);
    requestAnimationFrame(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <a href="#top" className="min-w-0" onClick={() => setIsOpen(false)}>
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
          <Button
            ref={triggerRef}
            type="button"
            variant="ghost"
            size="icon"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="salon-navigation"
            onClick={() => setIsOpen((open) => !open)}
            className="min-h-11 min-w-11 rounded-full text-primary hover:bg-secondary"
          >
            {isOpen ? <X className="size-5" /> : <MoreVertical className="size-5" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <>
          <div
            aria-hidden="true"
            className="fixed inset-x-0 bottom-0 top-[65px] -z-10 bg-foreground/20 backdrop-blur-[2px] motion-safe:animate-in motion-safe:fade-in"
          />
          <nav
            ref={menuRef}
            id="salon-navigation"
            aria-label="Salon navigation"
            className="absolute inset-x-0 top-full border-b border-border bg-background shadow-soft motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2"
          >
            <ol className="mx-auto max-w-6xl px-7 py-6 sm:px-8 sm:py-8">
              {NAV_ITEMS.map((item, index) => (
                <li key={item.href} className="border-b border-border/70 last:border-0">
                  <a
                    href={item.href}
                    onClick={(event) => {
                      event.preventDefault();
                      goToSection(item.href);
                    }}
                    className="group flex min-h-14 items-center justify-between py-3 text-muted-foreground outline-none transition-colors hover:text-primary focus-visible:text-primary"
                  >
                    <span className="text-xs font-medium tracking-widest text-gold">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-2xl italic group-hover:underline group-hover:underline-offset-8 group-focus-visible:underline group-focus-visible:underline-offset-8">
                      {item.label}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
            <div className="border-t border-border/70 px-4 py-4 text-center text-[10px] tracking-widest text-muted-foreground uppercase">
              Excellence in beauty
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
