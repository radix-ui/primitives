describe('DropdownMenu', () => {
  describe('Submenus', () => {
    beforeEach(() => {
      cy.visitStory('dropdownmenu--submenus');
    });

    describe('in LTR and RTL configurations', () => {
      beforeEach(() => {
        cy.findByText('Open').click();
      });

      it('should scope typeahead behaviour to active submenu', () => {
        pointerOverItem('Bookmarks →');
        pointerOverItem('Modulz →');
        pointerOverItem('Stitches').type('Inbox');
        cy.findByText('Inbox').should('not.have.focus');

        pointerOverItem('Notion').type('Inbox');
        cy.findByText('Inbox').should('have.focus');
      });

      it('should not close when pointer moves to parent trigger', () => {
        pointerOverItem('Bookmarks →');
        pointerOverItem('Inbox');
        pointerOverItem('Bookmarks →');
        cy.findByText('Inbox').should('exist');
      });

      it('should close when pointer moves to an item or sibling trigger in parent menu', () => {
        pointerOverItem('Bookmarks →');
        pointerOverItem('Inbox');
        pointerOverItem('New Window');
        cy.findByText('Inbox').should('not.exist');

        pointerOverItem('Bookmarks →');
        pointerOverItem('Inbox');
        pointerOverItem('Tools →');
        cy.findByText('Inbox').should('not.exist');
      });

      it('should remain open when clicking trigger but close when clicking item', () => {
        pointerOverItem('Bookmarks →').click();
        cy.findByText('Inbox').click();
        cy.findByText('Inbox').should('not.exist');
      });

      it.skip('should not open when trigger is disabled', () => {});

      it('should close when pressing escape key', () => {
        pointerOverItem('Bookmarks →');
        pointerOverItem('Inbox').type('{esc}');
        cy.findByText('Inbox').should('not.exist');

        cy.findByText('Open').click();
        pointerOverItem('Bookmarks →');
        pointerOverItem('Modulz →').type('{esc}');
        cy.findByText('Inbox').should('not.exist');
      });

      it('should not focus first item when opening via pointer', () => {
        pointerOverItem('Bookmarks →').then(($trigger) => {
          const associatedMenuId = $trigger.attr('aria-controls');
          cy.get(`[id="${associatedMenuId}"]`).children().first().should('not.be.focused');
        });
      });
    });

    describe('in LTR configuration', () => {
      it('should remain open when exiting trigger towards submenu', () => {
        cy.findByText('Open').click();

        pointerOverItem('Bookmarks →');
        cy.findByText('Inbox').should('exist');

        pointerExitLeftToRight('Bookmarks →');
        cy.findByText('Inbox').should('exist');
      });

      it('should close when exiting trigger away from submenu', () => {
        cy.findByText('Open').click();

        pointerOverItem('Bookmarks →');
        cy.findByText('Inbox').should('exist');

        pointerExitRightToLeft('Bookmarks →');
        cy.findByText('Inbox').should('not.exist');
      });

      it('should open and close via oriented LTR keyboard controls', () => {
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

        pointerOverItem('Bookmarks →');
        cy.findByText('Inbox').should('exist');

        pointerExitRightToLeft('Bookmarks →');
        cy.findByText('Inbox').should('exist');
      });

      it('should close when exiting trigger away from submenu', () => {
        cy.findByText('Right-to-left').click();
        cy.findByText('Open').click();

        pointerOverItem('Bookmarks →');
        cy.findByText('Inbox').should('exist');

        pointerExitLeftToRight('Bookmarks →');
        cy.findByText('Inbox').should('not.exist');
      });

      it('should open and close via oriented RTL keyboard controls', () => {
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

const mousePointerOptions = { pointerType: 'mouse' };

function pointerExitRightToLeft(text) {
  return cy
    .findByText(text)
    .trigger('pointermove', 'right', mousePointerOptions)
    .trigger('pointermove', 'bottomLeft', mousePointerOptions)
    .trigger('pointerout', 'bottomLeft', mousePointerOptions);
}

function pointerExitLeftToRight(text) {
  return cy
    .findByText(text)
    .trigger('pointermove', 'left', mousePointerOptions)
    .trigger('pointermove', 'bottomRight', mousePointerOptions)
    .trigger('pointerout', 'bottomRight', mousePointerOptions);
}

function pointerOverItem(text) {
  return cy.findByText(text).trigger('pointermove', mousePointerOptions);
}
