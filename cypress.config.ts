import { defineConfig } from "cypress";
import { getNumberOfTheDayForDateParam } from "./src/utils/numbers";

export default defineConfig({
  e2e: {
    specPattern: "src/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "src/cypress/support/e2e.ts",
    setupNodeEvents(on) {
      on("task", {
        getEquationForDate(dateParam: string) {
          return getNumberOfTheDayForDateParam(dateParam);
        },
      });
    },
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
