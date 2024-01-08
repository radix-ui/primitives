describe('Menu', () => {
  beforeEach(() => {
    cy.visitUtilityStory('menu--cypress');
  });

  describe('given a keyboard user', () => {
    it('should delete only the last character in typeahead on menu content when backspace pressed', () => {
      typeIntoMenu('cu');
      assertMenuItemHighlighted('Cut');
      typeIntoMenu('{backspace}u');
      assertMenuItemHighlighted('Cut');
    });

    it('should update typeahead correctly when backspace pressed on menu content', () => {
      typeIntoMenu('u');
      assertMenuItemHighlighted('Undo');
      typeIntoMenu('{backspace}r');
      assertMenuItemHighlighted('Redo');
      typeIntoMenu('{backspace}c');
      assertMenuItemHighlighted('Cut');
    });
  });

  /* ---------------------------------------------------------------------------------------------- */

  function typeIntoMenu(text: string) {
    cy.findByRole('menu').type(text);
  }

  function assertMenuItemHighlighted(text: string) {
    cy.findByRole('menuitem', { name: text }).should('have.attr', 'data-highlighted');
  }
});
