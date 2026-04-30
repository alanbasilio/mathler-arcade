import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(_on, _config) {},
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
