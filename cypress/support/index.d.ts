declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    visitStory(storyName: string, options?: Partial<Cypress.VisitOptions>): Chainable<any>;
  }
}
