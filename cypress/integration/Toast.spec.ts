describe('Toast', () => {
  beforeEach(() => {
    cy.visitStory('toast--cypress');
  });

  function buttonIsFocused(identifier: number) {
    cy.findByText(`Toast button ${identifier}`).should('be.focused');
  }

  function toastIsFocused(identifier: number) {
    cy.findByTestId(`toast-${identifier}`).should('be.focused');
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
      buttonIsFocused(2.1);

      cy.realPress('Tab');
      buttonIsFocused(2.2);

      cy.realPress('Tab');
      toastIsFocused(1);

      cy.realPress('Tab');
      buttonIsFocused(1.1);

      cy.realPress('Tab');
      buttonIsFocused(1.2);

      // End of viewport
      cy.realPress('Tab');
      cy.findByText('Focusable after viewport').should('be.focused');

      // Backwards tab
      cy.realPress(['Shift', 'Tab']);
      buttonIsFocused(1.2);

      cy.realPress(['Shift', 'Tab']);
      buttonIsFocused(1.1);

      cy.realPress(['Shift', 'Tab']);
      toastIsFocused(1);

      cy.realPress(['Shift', 'Tab']);
      buttonIsFocused(2.2);

      cy.realPress(['Shift', 'Tab']);
      buttonIsFocused(2.1);

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
