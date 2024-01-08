// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('visitStory', (storyName, options) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  return cy.visit(`iframe.html?id=components-${storyName}`, options).wait(0);
});

Cypress.Commands.add('visitUtilityStory', (storyName, options) => {
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  return cy.visit(`iframe.html?id=utilities-${storyName}`, options).wait(0);
});
