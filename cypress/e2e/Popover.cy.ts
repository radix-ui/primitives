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

describe('non-modal popover nested in dialog', () => {
  beforeEach(() => {
    cy.visitStory('popover--dismisses-only-popover-inside-dialog');

    // click twice to ensure the popover is not modal
    cy.findByLabelText('Modal').click();
    cy.findByLabelText('Modal').click();
  });

  it('dismisses both the popover and the dialog when clicking outside both layers', () => {
    cy.findByText('Open dialog').click();
    cy.findByText('Open popover').click();

    cy.findByText('dialog: open | popover: open').should('exist');

    cy.get('body').click(5, 5, { force: true });

    // The dialog closing unmounts its content (including the status text), so we
    // assert the dismissable affordances are gone and the trigger is back.
    cy.findByText('Close popover').should('not.exist');
    cy.findByText('Close dialog').should('not.exist');
    cy.findByText('Open dialog').should('be.visible');
  });
});

describe('modal popover nested in dialog', () => {
  beforeEach(() => {
    cy.visitStory('popover--dismisses-only-popover-inside-dialog');
    cy.findByLabelText('Modal').click();
  });

  it('dismisses only the popover when clicking outside the popover', () => {
    cy.findByText('Open dialog').click();
    cy.findByText('Open popover').click();

    cy.findByText('dialog: open | popover: open').should('exist');

    // A modal popover shields the dialog, so an outside interaction dismisses
    // only the popover while the dialog stays open.
    cy.get('body').click(5, 5, { force: true });

    cy.findByText('dialog: open | popover: closed').should('exist');
    cy.findByText('Close popover').should('not.exist');
    cy.findByText('Close dialog').should('be.visible');
  });
});
