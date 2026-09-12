# Interactive Before/After Image Slider

An interactive comparison slider for the "Before & after" block in the trust section: a draggable vertical bar that wipes between the before and after photos, with touch and keyboard support.

## Component

Create `src/components/salon/before-after-slider.tsx`:

- Container with the after image as the base layer and the before image clipped on top via `clip-path: inset(0 X% 0 0)`, so dragging reveals one over the other with no layout shift.
- Both images share the container's aspect square, object-cover, rounded corners (existing card styling).
- Draggable vertical gold handle bar with a circular grip (left/right chevrons) centered on it, plus "Before" / "After" corner labels that fade based on reveal position.
- Pointer events (`pointerdown`/`pointermove`/`pointerup` with `setPointerCapture`) for smooth mouse + touch dragging; clamped 0–100%.
- Keyboard accessible: the handle is focusable (`role="slider"`, `aria-valuenow`), arrow keys adjust the position in 5% steps.
- Initial position at 50%.

## Integration

In `src/components/salon/trust.tsx`:

- Replace the static two-image before/after grid with the new slider, keeping the existing caption ("A smoothening and blow-dry finish from our stylists.").
- Keep the same image assets (`before-1.jpg`, `after-1.jpg`), alt text, and lazy loading inside the slider component.
- Keep the certifications list and reviews column unchanged.

## Notes

- Pure React + pointer events, no new dependencies.
- Plum/gold tokens only (no hardcoded colors); gold handle uses the existing `text-gold` / `bg-primary` tokens.
