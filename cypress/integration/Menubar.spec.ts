const FIRST_MENU = 'Menu 1';
const MIDDLE_MENU = 'Menu 2';
const LAST_MENU = 'Menu 3';
const NESTED_MENU = 'Nested Menu';
const FIRST_ITEM = 'Item 1';
const SECOND_ITEM = 'Item 2';
const SEPARATOR = ' - ';
const FIRST_MENU_LETTER = 'A';
const MIDDLE_MENU_LETTER = 'B';
const LAST_MENU_LETTER = 'C';

const FIRST_TAB = FIRST_MENU_LETTER + SEPARATOR + FIRST_MENU;
const MIDDLE_TAB = MIDDLE_MENU_LETTER + SEPARATOR + MIDDLE_MENU;
const LAST_TAB = LAST_MENU_LETTER + SEPARATOR + LAST_MENU;

describe('Menubar', () => {
  beforeEach(() => {
    cy.visitStory('menubar--test');
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
      cy.findByText(FIRST_TAB).trigger('keydown', { key: MIDDLE_MENU_LETTER });
      cy.findByText(MIDDLE_TAB).should('have.focus');
    });

    describe('Given a submenu user', () => {
      beforeEach(() => {
        cy.findByText(FIRST_TAB).focus().trigger('keydown', { key: 'Enter' });
      });

      it('should provide menubar menu navigation on arrow press', () => {
        cy.findByText(FIRST_MENU + SEPARATOR + FIRST_ITEM).trigger('keydown', {
          key: 'ArrowRight',
        });
        // Menu should be open but focus has to stay in the top level trigger
        cy.findByText(MIDDLE_TAB).should('have.focus');
        // TODO cy.findByText(MIDDLE_MENU + SEPARATOR + FIRST_ITEM).should('be.visible');
        cy.findByText(FIRST_TAB).trigger('keydown', { key: 'Enter' }); // TODO Remove

        cy.findByText(FIRST_MENU + SEPARATOR + FIRST_ITEM).trigger('keydown', {
          key: 'ArrowRight',
        });
        // TODO it should be open
        cy.findByText(MIDDLE_TAB).should('have.focus');
      });
    });
  });

  /* ---------------------------------------------------------------------------------------------- */
});
