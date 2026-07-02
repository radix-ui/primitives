describe('ToggleGroup', () => {
  beforeEach(() => {
    cy.visitStory('togglegroup--cypress');
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/3077
  describe('given a ToggleGroup as the first focusable element inside a Dialog', () => {
    it('should move focus into the group when the dialog opens', () => {
      cy.findByText('open').click();
      // The group should hold focus (either the group wrapper itself or its
      // first roving item), rather than focus skipping past it to the close
      // button.
      cy.findByText('close').should('not.be.focused');
      cy.focused().closest('[role="radiogroup"]').should('exist');
    });
  });
});
