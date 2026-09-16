# Constrain the Before/After Slider Drag Area

Update the existing comparison slider so the photos remain still when users click or drag anywhere except the center control.

## Changes

- Remove pointer-drag handling from the full image container.
- Attach the drag interaction only to the vertical dividing line and its circular handle, while preserving smooth mouse and touch movement through pointer capture.
- Keep the existing keyboard controls and accessibility values on the handle.
- Retain the slider's rounded corners and ensure both images and the moving divider remain clipped cleanly inside the rounded container.

## Verification

- Confirm dragging the handle or divider changes the comparison position.
- Confirm clicking or dragging elsewhere on either image does not move the divider.
- Check the rounded corners and interaction behavior on phone and desktop sizes.
