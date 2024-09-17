# Mathler Arcade

An Arcade-inspired math game.

## Stack

- **TypeScript**
- **React**
- **Next.js**
- **Node.js**
- **Tailwind CSS**
- **shadcn/ui** for pre-built React components
- **Radix UI** for accessible and customizable UI primitives
- **NES.css** for retro-style UI components
- **use-sound** for audio effects
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
   # or
   yarn install
   ```

3. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Scripts

- `dev`: Runs the development server.
- `build`: Builds the application for production.
- `start`: Starts the production server.
- `lint`: Runs ESLint to check for linting errors.
- `cypress:open`: Opens the Cypress test runner.
- `cypress:run`: Runs Cypress tests in headless mode.

## Curiosities

- **Numbers and operators can appear multiple times.**
- **Order of operation applies:** Multiplication and division are calculated before addition and subtraction.
- **Color feedback:** After each guess, the color of the tiles changes to reflect the status:
  - Green: Correct and in the right spot.
  - Yellow: Correct but in the wrong spot.
  - Grey: Not part of the equation.
- **Cumulative solutions:** The game accepts cumulative solutions (e.g., 1+5*15 === 15*5+1).

## Acknowledgements

I would like to express my gratitude to the following individuals and projects that have contributed to making this game possible:

- **Josh Comeau** ([@joshwcomeau](https://github.com/joshwcomeau)) - Creator of the [use-sound](https://github.com/joshwcomeau/use-sound) library, which greatly enhanced the audio experience in this game.
- **Rauno Freiberg** ([@raunofreiberg](https://github.com/raunofreiberg)) - Creator of the [UI Playbook](https://github.com/raunofreiberg/interfaces), which provided inspiring guidelines and best practices for creating intuitive user interfaces.
- [**shadcn/ui**](https://github.com/shadcn/ui) - For providing a fantastic collection of accessible and customizable React components that greatly enhanced the user interface of this game.
- The [**NES.css**](https://github.com/nostalgic-css/NES.css) team - For their nostalgic NES-style CSS Framework that added a delightful retro aesthetic to the game's design.

- All the open-source contributors whose libraries and tools were used in this project.

Your work and contributions to the developer community are greatly appreciated!
