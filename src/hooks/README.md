# src/hooks/

Context consumer hooks. Each validates that its hook is used inside the correct provider and throws a descriptive error if not.

## Hooks

### `useGame()`
Returns the full `GameContextProps` from `GameProvider`. Use this in any component that needs:
- `mode`, `setMode` — difficulty setting
- `guesses`, `currentGuess` — guess history and active input
- `handleKeyPress(key)` — single entry point for all keyboard/button input
- `gameStarted`, `gameOver`, `gameWon` — game lifecycle flags
- `keyboardFeedback` — per-key color feedback `Record<string, FeedbackColor>`
- `targetResult`, `targetEquation` — the day's puzzle data
- `activeKey` — currently pressed key (cleared after 100ms, used for visual press animation)

### `useAudio()`
Returns audio controls from `AudioProvider`:
- `playSound(name)` — plays a named sound clip
- `toggleAudio()` — mute/unmute toggle
- `stopAudio` — current mute state (boolean)

## Pattern

```ts
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
};
```

All hooks follow this same pattern. Always use these hooks instead of importing contexts directly.
