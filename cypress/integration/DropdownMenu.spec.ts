describe('DropdownMenu', () => {
  describe('Submenus', () => {
    beforeEach(() => {
      cy.visitStory('dropdownmenu--submenus');
    });

    describe('by default', () => {
      beforeEach(() => {
        cy.findByText('Open').click();
      });

      it('should scope typeahead behaviour to active submenu', () => {
        movePointerTo('Bookmarks →');
        movePointerTo('Modulz →');
        movePointerTo('Stitches').type('Inbox');
        cy.findByText('Inbox').should('not.have.focus');

        movePointerTo('Notion').type('Inbox');
        cy.findByText('Inbox').should('have.focus');
      });

      it('should not close when pointer moves to parent trigger', () => {
        movePointerTo('Bookmarks →');
        movePointerTo('Inbox');
        movePointerTo('Bookmarks →');
        cy.findByText('Inbox').should('exist');
      });

      it('should close when pointer moves to an item or sibling trigger in parent menu', () => {
        movePointerTo('Bookmarks →');
        movePointerTo('Inbox');
        movePointerTo('New Window');
        cy.findByText('Inbox').should('not.exist');

        movePointerTo('Bookmarks →');
        movePointerTo('Inbox');
        movePointerTo('Tools →');
        cy.findByText('Inbox').should('not.exist');
      });

      it('should remain open when clicking trigger but close when clicking item', () => {
        movePointerTo('Bookmarks →').click();
        cy.findByText('Inbox').click();
        cy.findByText('Inbox').should('not.exist');
      });

      it('should not open when trigger is disabled', () => {
        movePointerTo('History →');
        cy.findByText('Github').should('not.exist');

        cy.findByText('History →').trigger('keydown', { key: ' ' });
        cy.findByText('Github').should('not.exist');

        cy.findByText('History →').trigger('keydown', { key: 'Enter' });
        cy.findByText('Github').should('not.exist');
      });

      it('should open on space and enter key press', () => {
        cy.findByText('Bookmarks →').trigger('keydown', { key: ' ' });
        cy.findByText('Inbox').should('exist');

        movePointerTo('New Tab');

        cy.findByText('Bookmarks →').trigger('keydown', { key: 'Enter' });
        cy.findByText('Inbox').should('exist');
      });

      it('should close on escape key press', () => {
        movePointerTo('Bookmarks →');
        movePointerTo('Inbox').type('{esc}');
        cy.findByText('Inbox').should('not.exist');

        cy.findByText('Open').click();
        movePointerTo('Bookmarks →');
        movePointerTo('Modulz →').type('{esc}');
        cy.findByText('Inbox').should('not.exist');
      });

      it('should not focus first item when opening via pointer', () => {
        movePointerTo('Bookmarks →').then(($trigger) => {
          const associatedMenuId = $trigger.attr('aria-controls');
          cy.get(`[id="${associatedMenuId}"]`).children().first().should('not.be.focused');
        });
      });
    });

    describe('in LTR configuration', () => {
      it('should remain open when exiting trigger towards submenu', () => {
        cy.findByText('Open').click();

        movePointerTo('Bookmarks →');
        cy.findByText('Inbox').should('exist');

        exitPointerLeftToRight('Bookmarks →');
        cy.findByText('Inbox').should('exist');
      });

      it('should close when exiting trigger away from submenu', () => {
        cy.findByText('Open').click();

        movePointerTo('Bookmarks →');
        cy.findByText('Inbox').should('exist');

        exitPointerRightToLeft('Bookmarks →');
        cy.findByText('Inbox').should('not.exist');
      });

      it('should open and close via LTR keyboard control', () => {
        cy.findByText('Open').click();

        // Test opposite orientation is not bound
        cy.findByText('Bookmarks →').trigger('keydown', { key: 'ArrowLeft' });
        cy.findByText('Inbox').should('not.exist');

        // Test key bindings are orientated correctly
        // and that the first item in the associated submenu receives focus
        cy.findByText('Bookmarks →')
          .trigger('keydown', { key: 'ArrowRight' })
          .then(($trigger) => {
            const associatedMenuId = $trigger.attr('aria-controls');
            cy.get(`[id="${associatedMenuId}"]`)
              .children()
              .first()
              .should('be.focused')
              .trigger('keydown', { key: 'ArrowLeft' });
            cy.findByText('Inbox').should('not.exist');
          });
      });
    });

    describe('in RTL configuration', () => {
      it('should remain open when exiting trigger towards submenu', () => {
        cy.findByText('Right-to-left').click();
        cy.findByText('Open').click();

        movePointerTo('Bookmarks →');
        cy.findByText('Inbox').should('exist');

        exitPointerRightToLeft('Bookmarks →');
        cy.findByText('Inbox').should('exist');
      });

      it('should close when exiting trigger away from submenu', () => {
        cy.findByText('Right-to-left').click();
        cy.findByText('Open').click();

        movePointerTo('Bookmarks →');
        cy.findByText('Inbox').should('exist');

        exitPointerLeftToRight('Bookmarks →');
        cy.findByText('Inbox').should('not.exist');
      });

      it('should open and close via RTL keyboard control', () => {
        cy.findByText('Right-to-left').click();
        cy.findByText('Open').click();

        // Test reverse orientation is not applied
        cy.findByText('Bookmarks →').trigger('keydown', { key: 'ArrowRight' });
        cy.findByText('Inbox').should('not.exist');

        // Test key bindings are orientated correctly
        // and that the first item in the associated submenu receives focus
        cy.findByText('Bookmarks →')
          .trigger('keydown', { key: 'ArrowLeft' })
          .then(($trigger) => {
            const associatedMenuId = $trigger.attr('aria-controls');
            cy.get(`[id="${associatedMenuId}"]`)
              .children()
              .first()
              .should('be.focused')
              .trigger('keydown', { key: 'ArrowRight' });
            cy.findByText('Inbox').should('not.exist');
          });
      });
    });
  });
});

/* ---------------------------------------------------------------------------------------------- */

const mousePointerOptions = { pointerType: 'mouse' };

function exitPointerRightToLeft(text) {
  return cy
    .findByText(text)
    .trigger('pointermove', 'right', mousePointerOptions)
    .trigger('pointermove', 'bottomLeft', mousePointerOptions)
    .trigger('pointerout', 'bottomLeft', mousePointerOptions);
}

function exitPointerLeftToRight(text) {
  return cy
    .findByText(text)
    .trigger('pointermove', 'left', mousePointerOptions)
    .trigger('pointermove', 'bottomRight', mousePointerOptions)
    .trigger('pointerout', 'bottomRight', mousePointerOptions);
}

function movePointerTo(text) {
  return cy.findByText(text).trigger('pointermove', mousePointerOptions);
}
