# src/utils/

Pure utility functions. No React, no side effects.

## Modules

### `constants.ts`
All magic values in one place:
- `EQUATION_LENGTH = 6` — character width of every equation
- `MAX_GUESSES = 6` — maximum attempts
- `ACTIVE_KEY_TIMEOUT_MS = 100` — key press animation duration
- `GAME_START_DATE` — base date for daily puzzle index (2022-01-01)
- `MS_PER_DAY` — milliseconds per day
- `STANDARD_VOLUME / AMBIENT_VOLUME` — SFX and radio volume levels
- `NIGHTWAVE_PLAZA_STREAM_URL` / `PLAZA_STATUS_URL` — stream and now-playing API
- `plaza-radio.ts` — `fetchPlazaStatus`, time formatting, position interpolation
- `VALID_KEYS` — accepted keyboard inputs

### `evaluate.ts`
- `evaluate(equation)` — validates and evaluates a math string with correct operator precedence (`*`/`/` before `+`/`-`). Returns `null` for invalid input.
- `isCumulativeSolution(arr1, arr2)` — checks if two character arrays are permutations of each other (used for commutative equation acceptance).

### `feedback.ts`
- `getFeedback(guess, target)` — two-pass Wordle-style feedback. Returns `FeedbackColor[]`:
  - Pass 1: exact position matches → `"success"`
  - Pass 2: correct char, wrong position → `"warning"`
  - Remaining → `"outline"`
- `computeKeyboardFeedback(current, guess, feedback)` — merges new guess feedback into the keyboard color state, with priority: `success` > `warning` > `outline`.
- `getFeedbackColor(color?)` — null-coalesces `FeedbackColor | undefined` to `"default"`.

### `validation.ts`
- `validateGuessLength(guess)` — must be exactly `EQUATION_LENGTH`
- `validateHasOperator(guess)` — must contain at least one of `+`, `-`, `*`, `/`
- `isDuplicateGuess(guess, previousGuesses)` — checks guess against submitted history

### `numbers.ts`
- `getNumberOfTheDay()` — returns the daily equation for today (or `?date=YYYYMMDD` / ISO).
- `generateEquationForDay(dayIndex)` — deterministic `N1 op1 N2 op2 N3` equation (random ops/digits, validated by `evaluate`).
- `getDayIndex(referenceDate)` — day offset from `GAME_START_DATE`.
- `parseDateParam(dateParam)` — parses `YYYYMMDD` or ISO via moment (strict).
- `formatDateParam(date)` — formats a date as `YYYYMMDD` for the query param.
