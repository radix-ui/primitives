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

    it('should have no acessibility issues', () => {
      cy.injectAxe();
      cy.checkA11y('[aria-label="Notifications (F8)"]');
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

    it('should render announcements in document body by default', () => {
      // Add a toast to trigger announcement
      cy.findByText('Add toast').click();

      // Verify announcement is rendered in document body (default behavior)
      cy.get('body').within(() => {
        cy.get('[role="status"]')
          .should('exist')
          .and('contain.text', 'Notification')
          .and('contain.text', 'Toast 1 title')
          .and('contain.text', 'Toast 1 description');
      });

      // Wait for announcement cleanup
      cy.wait(1100);

      // Verify announcement is cleaned up
      cy.get('body [role="status"]').should('not.exist');
    });
  });

  describe('given custom announcer container', () => {
    beforeEach(() => {
      cy.visitStory('toast--custom-announcer-container');
    });

    it('should render announcements in the custom container', () => {
      // Initially, no announcements should be present
      cy.findByTestId('custom-announcer-container')
        .should('exist')
        .within(() => {
          cy.get('[role="status"]').should('not.exist');
        });

      // Open a toast
      cy.findByTestId('open-toast-button').click();

      // Verify the toast is visible
      cy.findByTestId('custom-container-toast').should('be.visible');

      // Verify the announcement is rendered in the custom container
      cy.findByTestId('custom-announcer-container').within(() => {
        cy.get('[role="status"]')
          .should('exist')
          .and('contain.text', 'Notification')
          .and('contain.text', 'Custom Container Toast')
          .and('contain.text', 'This toast\'s announcements are rendered in a custom container');
      });

      // Verify the announcement is NOT directly in the document body (default behavior)
      cy.get('body > [role="status"]').should('not.exist');
    });

    it('should clean up announcements after timeout', () => {
      // Open a toast
      cy.findByTestId('open-toast-button').click();

      // Verify announcement exists initially
      cy.findByTestId('custom-announcer-container').within(() => {
        cy.get('[role="status"]').should('exist');
      });

      // Wait for announcement cleanup (1000ms timeout)
      cy.wait(1100);

      // Verify announcement is cleaned up
      cy.findByTestId('custom-announcer-container').within(() => {
        cy.get('[role="status"]').should('not.exist');
      });
    });

  });

});
