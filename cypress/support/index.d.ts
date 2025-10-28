declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    visitStorybook(options?: Partial<Cypress.VisitOptions>): Cypress.Chainable<Cypress.AUTWindow>;
    visitStory(
      storyName: string,
      options?: Partial<Cypress.VisitOptions>,
    ): Cypress.Chainable<Cypress.AUTWindow>;
  }
}
