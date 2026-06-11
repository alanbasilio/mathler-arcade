# Mathler Arcade

Daily math puzzle game in the style of Wordle. Players guess a hidden 6-character equation that evaluates to the day's target number — solo or in a real-time multiplayer duo — wrapped in a CRT-vaporwave arcade interface with a built-in lo-fi radio.

## Features

- **Daily puzzle** — a new equation every day, with color-coded feedback per tile
- **Multiplayer duo** — turn-based 1v1 over WebSockets (PartyKit), with live opponent cursor and chat
- **Nightwave Plaza radio** — ambient vaporwave stream with a Winamp-style player bar
- **Hard mode** — no visual feedback for an extra challenge
- **Light/dark themes** — dark CRT-vaporwave by default
- **Reduced motion** — all animations respect `prefers-reduced-motion`

## Stack

- **TypeScript** + **React 19** + **Next.js 16** (App Router)
- **Tailwind CSS 4** + **shadcn/ui** + **Radix UI**
- **PartyKit** + **partysocket** for real-time multiplayer
- **TanStack Query** (with persisted cache) for radio metadata polling
- **hls.js** for the radio stream + **use-sound** for game SFX
- **Framer Motion** + **tw-animate-css** for animations
- **next-themes** for theme switching
- **Biome** for linting and formatting
- **Cypress** for end-to-end testing

## Design

The UI follows a **CRT-vaporwave arcade** direction: a bluish near-black canvas with neon cyan/magenta accents (`--neon-cyan` / `--neon-magenta` design tokens), CRT scanline and vignette overlays calibrated per theme, and a glowing synthwave grid horizon. Typography pairs **Press Start 2P** for display (titles, tiles, keys) with **VT323** for body text and **Geist Mono** for tabular numbers. All tokens live in `src/app/globals.css` as oklch CSS variables.

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/alanbasilio/mathler-arcade.git
   cd mathler-arcade
   ```

2. Install dependencies:

   ```bash
   yarn
   ```

3. Run the development server:

   ```bash
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

To play **multiplayer locally**, also run the PartyKit dev server:

```bash
yarn party:dev
```

## Scripts

| Command | Description |
| --- | --- |
| `yarn dev` | Start development server |
| `yarn build` | Production build |
| `yarn start` | Start production server |
| `yarn lint` | Biome check |
| `yarn format` | Biome format --write |
| `yarn cypress:open` | Open Cypress test runner |
| `yarn cypress:run` | Run Cypress tests headless (requires dev server running) |
| `yarn party:dev` | Start PartyKit dev server (multiplayer) |
| `yarn party:deploy` | Deploy PartyKit server |

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

```text
src/
├── app/          # Next.js entry points (layout, page, globals.css with design tokens)
├── components/   # UI components (game board, keyboard, radio player, multiplayer, dialogs)
├── hooks/        # Context consumer hooks (useGame, useAudio, useMultiplayer)
├── providers/    # Game, audio and multiplayer state (React Context)
├── utils/        # Pure business logic (validate, evaluate, feedback, numbers, plaza-radio)
├── types/        # Shared TypeScript types (multiplayer, plaza)
├── cypress/      # E2E specs, support files and fixtures
└── lib/          # Shared utilities (cn)
```

The main directories have a `README.md` with detailed documentation.

## Acknowledgements

- **Josh Comeau** ([@joshwcomeau](https://github.com/joshwcomeau)) — Creator of [use-sound](https://github.com/joshwcomeau/use-sound)
- **Rauno Freiberg** ([@raunofreiberg](https://github.com/raunofreiberg)) — Creator of [UI Playbook](https://github.com/raunofreiberg/interfaces)
- [**shadcn/ui**](https://github.com/shadcn/ui) — Accessible and customizable React components
- [**Nightwave Plaza**](https://plaza.one/) — The vaporwave radio streamed in-game
- **Macintosh Plus** aka [Ramona Andra Langley](https://en.wikipedia.org/wiki/Ramona_Andra_Langley) — Thematic audio inspiration
