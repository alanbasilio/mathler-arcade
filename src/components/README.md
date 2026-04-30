# src/components/

UI components for the game. All are client components (`"use client"`).

## Component Hierarchy

```
page.tsx
├── Start             — launch screen with "PRESS TO START" button
├── GameContent       — main game UI (header, board, keyboard, footer)
│   ├── Tutorial      — info dialog explaining rules and color feedback
│   ├── Settings      — difficulty dialog (normal / hard mode)
│   ├── GameBoard     — 6×6 tile grid
│   │   └── GameBoardRow × 6
│   │       └── GameBoardTile × 6
│   └── Keyboard      — on-screen input buttons
│       └── KeyboardRow × 2
└── GameOver          — shown when all 6 guesses are exhausted
```

## Key Patterns

- All components read state through `useGame()` or `useAudio()` — never prop-drill context values
- `GameBoardRow` reads `mode` from context and passes it down to `GameBoardTile` as a prop (avoids 36 context subscriptions)
- Dialogs (`Tutorial`, `Settings`) use Radix UI via `@/components/ui/dialog`; `onOpenChange` is the single handler — do not also attach `onClick` to the `DialogTrigger`
- Feedback colors (`success`, `warning`, `outline`) are applied via Tailwind conditional classes using `cn()`

## Hard Mode

When `mode === "hard"`, `GameBoardTile` suppresses all color feedback (tiles stay unstyled) and `Keyboard` always uses the `default` button variant regardless of `keyboardFeedback` state.
