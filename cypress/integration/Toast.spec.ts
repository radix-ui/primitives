describe('Toast', () => {
  beforeEach(() => {
    cy.visitStory('toast--cypress');
  });

  function actionIsFocused(identifier: number) {
    cy.findByText(`Toast ${identifier} action`).should('be.focused');
  }

  function closeIsFocused(identifier: number) {
    cy.findByText(`Toast ${identifier} close`).should('be.focused');
  }

  function toastIsFocused(identifier: number) {
    cy.get(`[data-cy="toast-${identifier}"]`).should('be.focused');
  }

  describe('given zero toasts', () => {
    it('should not interrupt natural tab order in the document', () => {
      cy.findByText('Focusable before viewport').focus();

      cy.realPress('Tab');
      cy.findByText('Focusable after viewport').should('be.focused');

      cy.realPress(['Shift', 'Tab']);
      cy.findByText('Focusable before viewport').should('be.focused');
    });
  });

  describe('given multiple toasts', () => {
    beforeEach(() => {
      cy.findByText('Add toast').click();
      cy.findByText('Add toast').click();
    });

    it('should reverse tab order from most recent to least', () => {
      cy.findByText('Focusable before viewport').focus();

      cy.realPress('Tab');
      toastIsFocused(2);

      // Forward tab
      cy.realPress('Tab');
      closeIsFocused(2);

      cy.realPress('Tab');
      actionIsFocused(2);

      cy.realPress('Tab');
      toastIsFocused(1);

      cy.realPress('Tab');
      closeIsFocused(1);

      cy.realPress('Tab');
      actionIsFocused(1);

      // End of viewport
      cy.realPress('Tab');
      cy.findByText('Focusable after viewport').should('be.focused');

      // Backwards tab
      cy.realPress(['Shift', 'Tab']);
      actionIsFocused(1);

      cy.realPress(['Shift', 'Tab']);
      closeIsFocused(1);

      cy.realPress(['Shift', 'Tab']);
      toastIsFocused(1);

      cy.realPress(['Shift', 'Tab']);
      actionIsFocused(2);

      cy.realPress(['Shift', 'Tab']);
      closeIsFocused(2);

      cy.realPress(['Shift', 'Tab']);
      toastIsFocused(2);

      // Start of viewport
      cy.realPress(['Shift', 'Tab']);
      cy.findByText('Focusable before viewport').should('be.focused');
    });

    it('should tab forwards from viewport to latest toast or backwards into the document', () => {
      // Tab forward from viewport
      cy.realPress('F8');
      cy.realPress('Tab');
      toastIsFocused(2);

      // Tab backward from viewport
      cy.realPress('F8');
      cy.realPress(['Shift', 'Tab']);
      cy.findByText('Focusable before viewport').should('be.focused');
    });
  });
});
