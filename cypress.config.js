import { defineConfig } from 'cypress';

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000',
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
    },
    chromeWebSecurity: false,
    video: false,
    screenshotOnRunFailure: false,
  },
});