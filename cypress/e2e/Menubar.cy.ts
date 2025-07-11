describe('Menubar', () => {
  beforeEach(() => {
    cy.visitStory('menubar--cypress');
  });

  describe('given a pointer user', () => {
    it('should open menu when pointer moves between triggers and not focus first item', () => {
      pointerOver('File');
      cy.findByText('New Tab').should('not.exist');

      cy.findByText('File').click();
      cy.findByText('New Tab').should('not.have.focus');

      pointerOver('Edit');
      cy.findByText('New Tab').should('not.exist');
      cy.findByText('Redo').should('not.have.focus');

      pointerOver('History');
      cy.findByText('Redo').should('not.exist');
      cy.findByText('Radix').should('not.have.focus');
    });

    it('should maintain the open state when pointer moves away from a trigger', () => {
      cy.findByText('File').click();
      pointerOver('File').trigger('pointerout', 'bottomRight', {
        pointerType: 'mouse',
        force: true,
      });
      cy.findByText('New Tab').should('be.visible');
    });

    it('should not close open submenu when moving pointer to submenu and back to parent trigger', () => {
      cy.findByText('Edit').click();
      pointerOver('Find');
      pointerOver('Find Next');
      pointerOver('Find');
      cy.findByText('Find Next').should('be.visible');
    });

    it('should close open submenu when moving pointer to any item in parent menu', () => {
      cy.findByText('Edit').click();
      // Item
      pointerOver('Find');
      pointerOver('Find Next');
      pointerOver('Redo');
      cy.findByText('Find Next').should('not.exist');

      // Disabled item
      pointerOver('Find');
      pointerOver('Find Next');
      pointerOver('Redo');
      cy.findByText('Find Next').should('not.exist');

      // Trigger item
      pointerOver('Find');
      pointerOver('Find Next');
      pointerOver('Substitutions');
      cy.findByText('Find Next').should('not.exist');

      // Disabled trigger item
      pointerOver('Find');
      pointerOver('Find Next');
      pointerOver('Speech');
      cy.findByText('Find Next').should('not.exist');
    });

    it('should close unassociated submenus when moving pointer back to the root trigger', () => {
      cy.findByText('Edit').click();
      // Open multiple nested submenus and back to trigger in root menu
      pointerOver('Find');
      pointerOver('Advanced');
      pointerOver('Regex');
      pointerOver('Find');

      cy.findByText('Find Next').should('be.visible');
      cy.findByText('Regex').should('not.exist');
    });

    it('should close all menus when clicking item in any menu, or clicking outside', () => {
      cy.findByText('Edit').click();

      // Root menu
      cy.findByText('Redo').click();
      cy.findByText('Redo').should('not.exist');

      // Submenu
      cy.findByText('Edit').click();
      pointerOver('Find');
      cy.findByText('Find Next').click();
      cy.findByText('Redo').should('not.exist');
      cy.findByText('Find Next').should('not.exist');

      // Click outside
      cy.findByText('Edit').click();
      cy.get('body').click();
      cy.findByText('Redo').should('not.exist');
    });
  });

  describe('given a keyboard user', () => {
    function shouldSupportArrowKeyNavigation(dir: 'ltr' | 'rtl') {
      const nextKey = dir === 'ltr' ? 'ArrowRight' : 'ArrowLeft';
      const prevKey = dir === 'ltr' ? 'ArrowLeft' : 'ArrowRight';

      // Moving forwards with menu closed
      cy.findByText('File').trigger('keydown', { key: nextKey });
      cy.findByText('Edit').should('be.focused').trigger('keydown', { key: nextKey });

      // Moving backwards with menu closed
      cy.findByText('History').should('be.focused').trigger('keydown', { key: prevKey });
      cy.findByText('Edit').should('be.focused').trigger('keydown', { key: prevKey });
      cy.findByText('File').should('be.focused');

      // End of list (should not loop)
      cy.findByText('File').trigger('keydown', { key: nextKey });
      cy.findByText('File').should('be.focused');

      // Open menu
      cy.findByText('File').click();

      // Moving forwards with menu open
      cy.findByText('New Tab').trigger('keydown', { key: nextKey });
      cy.findByText('New Tab').should('not.exist');

      // Moving backwards with menu open
      cy.findByText('Redo').trigger('keydown', { key: prevKey });
      cy.findByText('Redo').should('not.exist');

      // End of list (should not loop)
      cy.findByText('New Tab').trigger('keydown', { key: prevKey });
      cy.findByText('New Tab').should('be.visible');

      // Moving forwards at submenu edge
      cy.findByText('Share').trigger('keydown', { key: nextKey });
      cy.findByText('Email Link').trigger('keydown', { key: nextKey });
      cy.findByText('Redo').should('be.visible');

      // Moving backwards at submenu edge
      cy.findByText('Find').trigger('keydown', { key: nextKey });
      cy.findByText('Advanced').trigger('keydown', { key: nextKey });
      cy.findByText('Regex').trigger('keydown', { key: prevKey });
      cy.findByText('Advanced').trigger('keydown', { key: prevKey });
      cy.findByText('Find').trigger('keydown', { key: prevKey });
      cy.findByText('New Tab').should('be.visible');

      // Looping
      cy.findByText('Loop').click();
      cy.findByText('File').trigger('keydown', { key: prevKey });
      cy.findByText('History').should('be.focused').trigger('keydown', { key: nextKey });
      cy.findByText('File').should('be.focused');

      // Looping menu open
      cy.findByText('File').click();
      cy.findByText('New Tab').trigger('keydown', { key: prevKey });
      cy.findByText('Radix').trigger('keydown', { key: nextKey });
      cy.findByText('New Tab').should('be.visible');
    }

    it('should move to next menu using right arrow and previous menu with left arrow', () => {
      shouldSupportArrowKeyNavigation('ltr');
    });

    it('should not open submenu when moving focus to sub trigger', () => {
      cy.findByText('Edit').click();
      cy.findByText('Find').focus();
      cy.findByText('Find Next').should('not.exist');
    });

    it('should not open submenu when moving focus to sub trigger', () => {
      cy.findByText('Edit').click();
      cy.findByText('Find').focus();
      cy.findByText('Find Next').should('not.exist');
    });

    it('should open submenu and focus first item when pressing right arrow, enter or space key', () => {
      cy.findByText('Edit').click();

      function shouldOpenOnKeydown(key: string) {
        cy.findByText('Find').trigger('keydown', { key });
        cy.findByText('Search the web…')
          .should('be.focused')
          .trigger('keydown', { key: 'ArrowLeft' });
      }

      shouldOpenOnKeydown(' ');
      shouldOpenOnKeydown('Enter');
      shouldOpenOnKeydown('ArrowRight');
    });

    it('should close only the focused submenu when pressing left arrow key', () => {
      cy.findByText('Edit').click();

      cy.findByText('Find').type('{enter}');
      cy.findByText('Advanced').type('{enter}');
      cy.findByText('Regex').type('{leftarrow}');
      cy.findByText('Regex').should('not.exist');
      cy.findByText('Advanced').should('be.visible');
      cy.findByText('Redo').should('be.visible');
    });

    it('should focus first item when pressing right arrow key after opening submenu with pointer', () => {
      cy.findByText('Edit').click();

      pointerOver('Find');
      cy.findByText('Find Next').should('be.visible');
      cy.findByText('Find').type('{rightarrow}');
      cy.findByText('Search the web…').should('be.focused');
    });

    it('should close all menus when pressing escape, enter or space key on any item', () => {
      cy.findByText('Edit').click();

      // Test close on root menu
      cy.findByText('Redo').type('{esc}');
      cy.findByText('Redo').should('not.exist');

      // Reopen menu and test keys from within the submenu
      cy.findByText('Edit').click();
      cy.findByText('Find').type('{enter}');
      cy.findByText('Search the web…').type('{esc}');
      cy.findByText('Search the web…').should('not.exist');
      cy.findByText('Redo').should('not.exist');
    });

    it('should scope typeahead behaviour to the active menu', () => {
      cy.findByText('Edit').click();

      // Matching items outside of the active menu should not become focused
      pointerOver('Find');
      pointerOver('Advanced');
      cy.findByText('Regex').focus();
      cy.findByText('Regex').type('Find');
      cy.findByText('Find').should('not.have.focus');

      // Matching items inside of active menu should become focused
      pointerOver('Advanced').focus().type('Find Next');
      cy.findByText('Find Next').should('have.focus');
    });

    describe('with portals enabled', () => {
      it('should move to next menu using right arrow and previous menu with left arrow', () => {
        shouldSupportArrowKeyNavigation('ltr');
      });
    });

    describe('with RTL enabled', () => {
      beforeEach(() => {
        cy.findByText('Right-to-left').click();
      });

      it('should move to next menu using right arrow and previous menu with left arrow', () => {
        shouldSupportArrowKeyNavigation('rtl');
      });

      it('should open submenu and focus first item when pressing left arrow key but close when pressing right arrow key', () => {
        cy.findByText('Edit').click();
        cy.findByText('Find').trigger('keydown', { key: 'ArrowLeft' });
        cy.findByText('Search the web…').should('be.focused');
        cy.findByText('Search the web…').trigger('keydown', { key: 'ArrowRight' });
        cy.findByText('Search the web…').should('not.exist');

        // Root level menu should remain open
        cy.findByText('Redo').should('be.visible');
      });
    });
  });

  /* ---------------------------------------------------------------------------------------------- */

  function pointerOver(elementText: string) {
    return cy.findByText(elementText).should('be.visible').realHover();
  }
});
