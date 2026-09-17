import { useCallback, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import beforeImage from "@/assets/before-1.jpg";
import afterImage from "@/assets/after-1.jpg";
import { cn } from "@/lib/utils";

const MIN = 0;
const MAX = 100;
const KEYBOARD_STEP = 5;

export function BeforeAfterSlider({ className }: { className?: string }) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(MAX, Math.max(MIN, pct)));
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    updateFromClientX(event.clientX);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromClientX(event.clientX);
  };

  const endDrag = () => setDragging(false);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition((p) => Math.max(MIN, p - KEYBOARD_STEP));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition((p) => Math.min(MAX, p + KEYBOARD_STEP));
    } else if (event.key === "Home") {
      event.preventDefault();
      setPosition(MIN);
    } else if (event.key === "End") {
      event.preventDefault();
      setPosition(MAX);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative aspect-square w-full select-none overflow-hidden rounded-2xl",
        className,
      )}
    >
      <img
        src={afterImage}
        alt="Guest's hair after smoothening and styling at the salon"
        width={800}
        height={800}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <img
        src={beforeImage}
        alt="Guest's hair before the salon treatment"
        width={800}
        height={800}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: `inset(0 ${MAX - position}% 0 0)` }}
      />

      <span
        className={cn(
          "pointer-events-none absolute top-3 left-3 rounded-full bg-background/80 px-3 py-1 text-xs tracking-widest uppercase backdrop-blur-sm transition-opacity",
          position < 12 && "opacity-0",
        )}
      >
        Before
      </span>
      <span
        className={cn(
          "pointer-events-none absolute top-3 right-3 rounded-full bg-background/80 px-3 py-1 text-xs tracking-widest uppercase backdrop-blur-sm transition-opacity",
          position > 88 && "opacity-0",
        )}
      >
        After
      </span>

      <div
        className="absolute inset-y-0 w-6 -translate-x-1/2 cursor-ew-resize touch-none"
        style={{ left: `${position}%` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
      >
        <span className="pointer-events-none absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-gold" />
        <button
          type="button"
          role="slider"
          aria-label="Compare before and after"
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={Math.round(position)}
          onKeyDown={onKeyDown}
          className="absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-border bg-card shadow-soft transition-transform focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <ChevronLeft className="size-4 text-primary" />
          <ChevronRight className="size-4 text-primary" />
        </button>
      </div>
    </div>
  );
}
