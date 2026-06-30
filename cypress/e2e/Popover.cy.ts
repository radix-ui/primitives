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

  describe('given a popover inside a scrollable container', () => {
    beforeEach(() => {
      cy.visitStory('popover--in-scroll-container');
    });

    it('closes when the trigger scrolls out of view', () => {
      cy.findByTestId('trigger').click();
      cy.findByTestId('popover-state').should('have.text', 'open');

      cy.findByTestId('scroll-container').scrollTo(0, 200);

      cy.findByTestId('popover-state').should('have.text', 'closed');
    });
  });
});
