declare namespace Cypress {
  interface Chainable<Subject> {
    visitStory(storyName: string, options?: Partial<Cypress.VisitOptions>): Chainable<any>;
  }
}
