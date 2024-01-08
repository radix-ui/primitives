describe('Select', () => {
  beforeEach(() => {
    cy.visitStory('select--cypress');
  });

  describe('given a select inside a form', () => {
    it('should submit and react to changes', () => {
      // submit without change
      cy.findByText('buy').click();
      cy.findByText(/t-shirt size/).should('include.text', 'size M');

      // react to changes
      cy.findByLabelText(/choose a size/).click();
      cy.findByRole('option', { name: /small/i }).click();
      cy.findByText(/t-shirt size/).should('include.text', 'size S');
    });
  });

  describe('given a select with no value', () => {
    it('should display the placeholder', () => {
      cy.findByText('…').should('exist');
    });

    it('can be reset to the placeholder', () => {
      cy.findByLabelText(/choose a model/).click();
      cy.findByRole('option', { name: /model x/i }).click();
      cy.findByText(/model y/i).should('not.exist');
      cy.findByText(/model x/i).should('exist');
      cy.findByText('unset').click();
      cy.findByText('…').should('exist');
    });
  });

  describe('given a keyboard user', () => {
    it('should delete only the last character in typeahead on select content when backspace pressed', () => {
      cy.findByLabelText(/choose a size/).click();
      typeIntoFocusedElement('sm');
      assertOptionHighlighted(/small/i);
      typeIntoFocusedElement('{backspace}m');
      assertOptionHighlighted(/small/i);
    });

    it('should update typeahead correctly when backspace pressed on select content', () => {
      cy.findByLabelText(/choose a size/).click();
      typeIntoFocusedElement('s');
      assertOptionHighlighted(/small/i);
      typeIntoFocusedElement('{backspace}m');
      assertOptionHighlighted(/medium/i);
      typeIntoFocusedElement('{backspace}l');
      assertOptionHighlighted(/large/i);
    });

    it('should delete only the last character in typeahead on select trigger when backspace pressed', () => {
      cy.findByLabelText(/choose a size/).focus();
      typeIntoFocusedElement('sm');
      assertSelectTriggerText('Small');
      typeIntoFocusedElement('{backspace}m');
      assertSelectTriggerText('Small');
    });

    it('should update typeahead correctly when backspace pressed on select trigger', () => {
      cy.findByLabelText(/choose a size/).focus();
      typeIntoFocusedElement('s');
      assertSelectTriggerText('Small');
      typeIntoFocusedElement('{backspace}m');
      assertSelectTriggerText('Medium');
      typeIntoFocusedElement('{backspace}l');
      assertSelectTriggerText('Large');
    });
  });

  /* ---------------------------------------------------------------------------------------------- */

  function typeIntoFocusedElement(text: string) {
    cy.focused().type(text);
  }

  function assertOptionHighlighted(textRegex: RegExp) {
    cy.findByRole('option', { name: textRegex }).should('have.attr', 'data-highlighted');
  }

  function assertSelectTriggerText(text: string) {
    cy.findByLabelText(/choose a size/).should('contain.text', text);
  }
});
