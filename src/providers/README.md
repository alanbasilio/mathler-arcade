# src/providers/

React Context providers. Mounted in `src/app/layout.tsx`.

## GameProvider

Manages all game state. Key details:

- `targetEquation` and `targetResult` are computed **once at module level** (not inside the component) to avoid recalculation on re-renders.
- `handleKeyPress(key)` is the single entry point for all input — keyboard events and on-screen button clicks both call this.
- `validateGuess()` is a pure module-level function that returns a `ValidationResult` union type. `handleSubmitGuess` calls it once and handles the error in a single `toast` call, rather than having per-validation toast blocks.
- `processValidGuessFeedback()` computes tile feedback and updates `guesses` and `keyboardFeedback` in one operation.
- `activeKey` auto-clears after `ACTIVE_KEY_TIMEOUT_MS` (100ms) to power the key press animation.

### Game State Flow

```
startGame() → gameStarted = true
handleKeyPress("Enter") → handleSubmitGuess()
  validateGuess() → if invalid: show toast, return
  isCumulativeSolution() → if exact match: gameWon = true, return
  processValidGuessFeedback() → add guess + update keyboard colors
  if MAX_GUESSES reached → gameOver = true
```

### GameMode

`GameMode = "normal" | "hard"` is exported from this file. In hard mode, the keyboard and tile colors are hidden.

## AudioProvider

Wraps `use-sound` for SFX and HLS ambient radio on `start`.

- `playSound("start")` plays the [Nightwave Plaza](https://plaza.one/) stream.
- Polls `PLAZA_STATUS_URL` for `nowPlaying` (title, artist, length, position, artwork).
- `RadioNowPlaying` shows the current track and progress bar.
