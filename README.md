# Mathler Arcade

Daily math puzzle game in the style of Wordle. Players guess a hidden 6-character equation that evaluates to the day's target number.

## Stack

- **TypeScript** + **React 19** + **Next.js 16** (App Router)
- **Tailwind CSS 4** + **shadcn/ui** + **Radix UI**
- **use-sound** for audio effects
- **Framer Motion** + **tw-animate-css** for animations
- **Biome** for linting and formatting
- **Cypress** for end-to-end testing

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/alanbasilio/mathler-arcade.git
   cd mathler-arcade
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Biome check |
| `npm run format` | Biome format --write |
| `npm run cypress:open` | Open Cypress test runner |
| `npm run cypress:run` | Run Cypress tests headless |

## Game Rules

- Each guess must be exactly 6 characters
- Must include at least one operator (`+`, `-`, `*`, `/`)
- The equation must evaluate to the day's target number
- Standard operator precedence applies (`*` and `/` before `+` and `-`)
- Numbers and operators can appear more than once
- Commutative solutions (e.g. `1+5*15` and `15*5+1`) are both accepted and auto-aligned

## Override Daily Puzzle

Add `?date=YYYYMMDD` or `?date=YYYY-MM-DD` (ISO) to the URL to load a specific day's puzzle.

## Project Structure

```
src/
├── app/          # Next.js entry points (layout, page, globals.css)
├── components/   # UI components (game board, keyboard, dialogs)
├── hooks/        # Context consumer hooks (useGame, useAudio)
├── providers/    # Game and audio state (React Context)
├── utils/        # Pure business logic (validate, evaluate, feedback, numbers)
└── lib/          # Shared utilities (cn)
```

Each directory has a `README.md` with detailed documentation.

## Acknowledgements

- **Josh Comeau** ([@joshwcomeau](https://github.com/joshwcomeau)) — Creator of [use-sound](https://github.com/joshwcomeau/use-sound)
- **Rauno Freiberg** ([@raunofreiberg](https://github.com/raunofreiberg)) — Creator of [UI Playbook](https://github.com/raunofreiberg/interfaces)
- [**shadcn/ui**](https://github.com/shadcn/ui) — Accessible and customizable React components
- **Macintosh Plus** aka [Ramona Andra Langley](https://en.wikipedia.org/wiki/Ramona_Andra_Langley) — Thematic audio inspiration
