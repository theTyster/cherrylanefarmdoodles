import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  specPattern: './test/test_E2E/cypress/component/**/*.cy.{ts,tsx}',
  },

  e2e: {
    specPattern: './test/test_E2E/cypress/e2e/**/*.cy.{ts,tsx}',
    supportFile: './test/test_E2E/cypress/support/e2e.ts',
    fixturesFolder: './test/test_E2E/cypress/fixtures',
    downloadsFolder: './test/test_E2E/cypress/downloads',
  },
  video: false,
  screenshotOnRunFailure: false
});
