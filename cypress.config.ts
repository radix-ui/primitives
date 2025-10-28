import { defineConfig } from 'cypress';

export default defineConfig({
  viewportWidth: 1024,
  viewportHeight: 768,
  fixturesFolder: false,
  defaultCommandTimeout: 20_000,
  e2e: {
    // TODO There is a bug (I think) in Cypress that results in the page
    // navigating to `about:blank` after certain tests run. Unclear why at this
    // stage. This is a hack that seems to prevent it, but unclear why. Debug
    // and remove this config option.
    // Possibly related: https://github.com/cypress-io/cypress/issues/28527
    testIsolation: false,
    setupNodeEvents(_on, _config) {},
    baseUrl: 'http://localhost:9009',
  },
});
