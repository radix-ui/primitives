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

describe('Popover nested in Dialog', () => {
  beforeEach(() => {
    cy.visitStory('popover--dismisses-only-popover-inside-dialog');
  });

  describe('given a non-modal popover', () => {
    beforeEach(() => {
      // click twice to ensure the popover is not modal
      cy.findByLabelText('modal').click();
      cy.findByLabelText('modal').click();
    });

    it('dismisses both the popover and the dialog when clicking outside both layers', () => {
      cy.findByText('Open dialog').click();
      cy.findByText('Open popover').click();

      cy.findByText('Dialog with nested popover').should('be.visible');
      cy.findByText('dialog: open | popover: open').should('exist');

      cy.get('body').click(5, 5, { force: true });

      cy.findByText('dialog: closed | popover: closed').should('exist');
      cy.findByText('Close dialog').should('not.exist');
      cy.findByText('Close popover').should('not.exist');
    });
  });

  describe('given a modal popover', () => {
    beforeEach(() => {
      cy.findByLabelText('modal').click();
    });

    it('dismisses only the popover when clicking outside both layers', () => {
      cy.findByText('Open dialog').click();
      cy.findByText('Open popover').click();

      cy.findByText('Dialog with nested popover').should('be.visible');
      cy.findByText('dialog: open | popover: open').should('exist');

      cy.get('body').click(5, 5, { force: true });

      cy.findByText('Dialog with nested popover').should('be.visible');
      cy.findByText('dialog: open | popover: closed').should('exist');
      cy.findByText('Close popover').should('not.exist');
    });
  });
});
