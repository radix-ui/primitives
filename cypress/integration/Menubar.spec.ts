import { TEXT } from '../../packages/react/menubar/src/Menubar.stories';

const FIRST_TAB = TEXT.FIRST_MENU_LETTER + TEXT.SEPARATOR + TEXT.FIRST_MENU;
const MIDDLE_TAB = TEXT.MIDDLE_MENU_LETTER + TEXT.SEPARATOR + TEXT.MIDDLE_MENU;
const LAST_TAB = TEXT.LAST_MENU_LETTER + TEXT.SEPARATOR + TEXT.LAST_MENU;

describe('DropdownMenu', () => {
  beforeEach(() => {
    cy.visitStory('menubar--submenus');
  });

  describe('When using keyboard', () => {
    beforeEach(() => {
      cy.findByText('A - Menu 1').focus();
    });
    it('should not open menubar menu when moving focus to trigger', () => {
      cy.findByText('Menu 1 - Item 1').should('not.exist');
    });

    it('should navigate the triggers on arrow press', () => {
      cy.findByText(FIRST_TAB).trigger('keydown', { key: 'ArrowRight' });
      cy.findByText(MIDDLE_TAB).should('have.focus');
      cy.findByText(LAST_TAB).focus().trigger('keydown', { key: 'ArrowRight' });
      cy.findByText(FIRST_TAB).should('have.focus').trigger('keydown', { key: 'ArrowLeft' });
      cy.findByText(LAST_TAB).should('have.focus');
    });

    it('should provide typeahead behaviour on trigger focus', () => {
      cy.findByText(FIRST_TAB).trigger('keydown', { key: TEXT.MIDDLE_MENU_LETTER });
      cy.findByText(MIDDLE_TAB).should('have.focus');
    });

    describe('Given a submenu user', () => {
      beforeEach(() => {
        cy.findByText(FIRST_TAB).focus().trigger('keydown', { key: 'Enter' });
      });

      it('should provide menubar menu navigation on arrow press', () => {
        cy.findByText('Menu 1 - Item 1').trigger('keydown', { key: 'ArrowRight' });
        cy.findByText('Menu 2 - Item 1')
          .should('have.focus')
          .trigger('keydown', { key: 'ArrowRight' });

        // navigate to first menu when arrow right on last menu item
        cy.findByText('Menu 3 - Item 1').trigger('keydown', { key: 'ArrowRight' });
        cy.findByText('Menu 1 - Item 1').should('have.focus');

        // navigate to last menu when arrow left on first menu item
        cy.findByText('Menu 1 - Nested Menu').trigger('keydown', { key: 'ArrowLeft' });
        cy.findByText('Menu 3 - Item 1').should('have.focus');

        // when item is nested
        cy.findByText('Menu 3 - Nested Menu').trigger('keydown', { key: 'ArrowRight' });
        cy.findByText('Menu 3 - Nested Menu Item')
          .should('have.focus')
          .trigger('keydown', { key: 'ArrowRight' });
        cy.findByText('Menu 1 - Item 1').should('have.focus');

        cy.findByText('Menu 1 - Nested Menu').trigger('keydown', { key: 'ArrowRight' });
        cy.findByText('Menu 1 - Nested Menu Item')
          .should('have.focus')
          .trigger('keydown', { key: 'ArrowLeft' }); // should close the submenu
        cy.findByText('Menu 1 - Nested Menu').should('have.focus');
      });
    });
  });

  /* ---------------------------------------------------------------------------------------------- */
});
