describe('Popover', () => {
  beforeEach(() => {
    cy.visitStory('popover--with-extension-overlay');
  });

  it('keeps the popover open when an external overlay stops later mouse events', () => {
    cy.findByText('open').click();
    cy.findByText('close').should('be.visible');
    cy.findByText('Trigger overlay').click();
    cy.findByTestId('external-overlay').should('exist');

    cy.findByTestId('external-overlay-button').realClick();

    cy.findByText('close').should('be.visible');
  });
});
