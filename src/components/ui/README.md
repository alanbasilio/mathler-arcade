# src/components/ui/

Low-level UI primitives. Based on Shadcn/ui.

## Files

- **`button.tsx`** — CVA-based `Button` component with named variants and sizes.
- **`dialog.tsx`** — Thin wrapper over Radix UI Dialog.
- **`retro-grid.tsx`** — Animated pixel-grid background (uses `animate-grid` keyframe).
- **`sonner.tsx`** — Customised `Toaster` from Sonner for toast notifications.

## Button Variants

| Variant | Usage |
|---|---|
| `default` | Standard dark button |
| `outline` | Bordered, transparent background — used for unguessed keyboard keys |
| `warning` | Orange — correct character, wrong position |
| `success` | Green — correct character and position |
| `pixel` | 8-bit style: squared corners, thick border, offset shadow with press effect — used for the start screen |
| `destructive` | Red, for errors |
| `ghost` | No background |
| `link` | Text-only with underline hover |
| `secondary` | Light background |

## Adding a New Variant

Edit `buttonVariants` in `button.tsx` using CVA's `variants.variant` map. Use Tailwind theme tokens (`bg-*`, `text-*`) rather than arbitrary color values.
