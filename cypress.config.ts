import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,ts}",
    supportFile: "cypress/support/e2e.ts",
    chromeWebSecurity: false,
    video: false,
    defaultCommandTimeout: 10000,
  },

  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
