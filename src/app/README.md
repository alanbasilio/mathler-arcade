# src/app/

Next.js App Router entry points.

## Files

- **`layout.tsx`** — Root layout. Wraps the app in `ThemeProvider` > `AudioProvider` > `GameProvider`. Loads `Press_Start_2P` font and the `Toaster`. No client-side logic here.
- **`page.tsx`** — Single route (`/`). Uses `"use client"` to consume game context. Renders `Start`, `GameContent`, and `GameOver` conditionally based on game state.
- **`globals.css`** — Tailwind 4 base imports, `@theme inline` token mappings, CSS variables for light/dark themes, and custom animations (`grid`, `shake`, `pop`).

## Provider Order

```
ThemeProvider (next-themes, attribute="class")
  AudioProvider  (audio playback state)
    GameProvider (all game logic and state)
      page content
```

## Theme Tokens

Custom colors defined as CSS variables in `:root` / `.dark` and mapped to Tailwind utilities via `@theme inline`:

- `--success` → `bg-success`, `text-success-foreground`
- `--warning` → `bg-warning`, `text-warning-foreground`
- `--foreground` / `--background` — adapts between light and dark automatically
