import { defineConfig } from "cypress";
import { getNumberOfTheDayForDateParam } from "./src/utils/numbers";

export default defineConfig({
  e2e: {
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
