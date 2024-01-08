describe('Menu', () => {
  beforeEach(() => {
    cy.visitUtilityStory('menu--cypress');
  });

  describe('given a keyboard user', () => {
    it('should update typeahead correctly when backspace pressed on menu content', () => {
      typeIntoMenu('undo');
      assertMenuItemHighlighted('Undo');
      typeIntoMenu('{backspace}redo');
      assertMenuItemHighlighted('Redo');
      typeIntoMenu('{backspace}cut');
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
