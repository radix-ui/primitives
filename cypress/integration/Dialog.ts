describe('Dialog', () => {
  beforeEach(() => {
    cy.visitStory('dialog--styled');
  });

  it('should open and close correctly', () => {
    cy.findByText('open').click();
    cy.findByText('close').click();
    cy.findByText('close').should('not.exist');
  });
});
