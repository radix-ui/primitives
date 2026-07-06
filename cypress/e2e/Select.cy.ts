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
      cy.findByLabelText(/choose a model/).as('modelTrigger');
      cy.get('@modelTrigger').click();
      cy.findByRole('option', { name: /model x/i }).click();
      cy.findByRole('listbox').should('not.exist');
      cy.get('@modelTrigger').should('include.text', 'Model X');
      cy.findByText('unset').click();
      cy.get('@modelTrigger').should('include.text', '…').and('not.include.text', 'Model X');
    });

    it('submits an empty value after being reset to the placeholder', () => {
      cy.findByLabelText(/choose a model/).click();
      cy.findByRole('option', { name: /model x/i }).click();
      cy.findByText('unset').click();
      cy.findByText('submit model').click();
      cy.findByText('Submitted model: empty').should('exist');
    });
  });

  describe('given an open select whose value changes externally', () => {
    it('keeps the positioned content stable', () => {
      cy.findByLabelText(/choose an open color/).as('colorTrigger');
      cy.get('@colorTrigger').click();
      cy.findByRole('listbox').then(($content) => {
        const before = $content[0].parentElement!.getBoundingClientRect();

        cy.findByText('toggle open color value').then(($button) => {
          $button[0].click();
        });

        cy.findByRole('listbox').should('exist');
        cy.get('@colorTrigger').should('include.text', 'Pick a color');
        cy.findByRole('listbox').then(($updatedContent) => {
          const after = $updatedContent[0].parentElement!.getBoundingClientRect();

          expect(Math.abs(after.left - before.left)).to.be.lessThan(1);
          expect(Math.abs(after.top - before.top)).to.be.lessThan(1);
        });
      });
    });
  });
});

describe('Select extension overlay interactions', () => {
  beforeEach(() => {
    cy.visitStory('select--with-extension-overlay');
  });

  it('closes when an external overlay stops later mouse events', () => {
    cy.findByText('Trigger overlay').click();
    cy.findByTestId('external-overlay').should('exist');
    cy.findByText(/choose a number/i).click();
    cy.findByRole('listbox').should('exist');

    cy.findByTestId('external-overlay-button').realClick();

    cy.findByRole('listbox').should('not.exist');
  });
});

describe('Select nested in Dialog', () => {
  beforeEach(() => {
    cy.visitStory('select--dismisses-only-select-inside-dialog');
  });

  it('dismisses only the select when clicking inside dialog outside select', () => {
    cy.findByText('Open dialog').click();
    cy.findByRole('combobox', { name: /choose a value/i }).click();

    cy.findByText('Dialog with nested select').should('be.visible');
    cy.findByText('dialog: open | select: open').should('exist');

    cy.findByText('Dialog with nested select').realClick();

    cy.findByText('Dialog with nested select').should('be.visible');
    cy.findByText('dialog: open | select: closed').should('exist');
    cy.findByRole('option', { name: 'One' }).should('not.exist');
  });
});

describe('Select nested in Popover', () => {
  beforeEach(() => {
    cy.visitStory('select--dismisses-only-select-in-popover');
  });

  it('dismisses only the open select when clicking another select trigger', () => {
    cy.findByText('Open popover').click();
    cy.findByTestId('first-trigger').click();

    cy.findByText('popover: open | first: open | second: closed').should('exist');
    cy.findByRole('option', { name: 'One' }).should('exist');

    // Clicking the second trigger while the first select is open should close
    // the first select but keep the popover open.
    cy.findByTestId('second-trigger').realClick();

    cy.findByText(/^popover: open/).should('exist');
    cy.findByRole('option', { name: 'One' }).should('not.exist');
  });
});

describe('Select (shadow DOM)', () => {
  beforeEach(() => {
    cy.visitStory('select--cypress-shadow-dom');
  });

  describe('given a select with a shadow DOM portal', () => {
    it('should remain open after touch-scrolling and allow item selection', () => {
      // open select with a touch event
      cy.get('.shadow-host')
        .shadow()
        .findByLabelText(/pick a food/i)
        .realTouch();

      // wait for the content to be open and settled before interacting with it
      cy.get('.shadow-host').shadow().findByRole('listbox').should('be.visible');

      // trigger a touch scroll, triggering the pointer move event and ensuring
      // we do not preventDefault on the upcoming pointer up event
      cy.get('.shadow-host').shadow().find('[data-radix-select-viewport]').realSwipe('toTop', {
        length: 30,
      });

      // assert the select content is still open after swiping
      cy.get('.shadow-host').shadow().findByRole('listbox').should('exist');

      // Select an item after scrolling, ensuring it is scrolled into view and
      // visible so the touch reliably lands within the constrained viewport.
      cy.get('.shadow-host')
        .shadow()
        .findByRole('option', { name: /Grapes/i })
        .scrollIntoView()
        .should('be.visible')
        .then(($option) => {
          const option = $option[0]!;
          let previousTop = Number.NaN;
          // Retry until the option reports the same position on two consecutive
          // checks, i.e. any residual swipe momentum / scroll-into-view
          // adjustment has settled. Otherwise the row can shift by a few pixels
          // between computing the tap coordinates and dispatching the touch,
          // landing it on a neighbouring option.
          cy.wrap(null)
            .should(() => {
              const currentTop = option.getBoundingClientRect().top;
              const isStable = currentTop === previousTop;
              previousTop = currentTop;
              expect(isStable, 'option position has settled').to.equal(true);
            })
            .then(() => cy.wrap(option).realTouch());
        });

      // selecting an item should close the content, which confirms the
      // selection registered before we assert on the bound value
      cy.get('.shadow-host').shadow().findByRole('listbox').should('not.exist');

      // assert the select value has been updated. We query the element directly
      // rather than running `findByText` against the shadow root, which throws a
      // confusing "got ShadowRoot" error while retrying when the node is absent.
      cy.get('.shadow-host').shadow().find('p').should('include.text', 'food: grapes');
    });
  });
});

describe('Select (scroll buttons)', () => {
  beforeEach(() => {
    cy.visitStory('select--cypress-scroll-buttons');
  });

  // https://github.com/radix-ui/primitives/issues/3686
  it('does not snap the selected item back into view when a scroll button mounts mid-scroll', () => {
    cy.findByLabelText(/choose an item/i).click();
    cy.findByRole('listbox').should('be.visible');
    cy.get('[data-radix-select-viewport]').as('viewport');

    // Scroll to the very top so the up button unmounts and the selected item
    // (item 25) sits well below the visible area.
    cy.get('@viewport').scrollTo('top');

    // Scroll down a little so the up button mounts again. Before the fix, the
    // button's mount-time `scrollIntoView` yanked the viewport back to the
    // selected item; now it should stay where the user scrolled.
    cy.get('@viewport').scrollTo(0, 120);

    cy.get('@viewport').then(($viewport) => {
      const viewportRect = $viewport[0].getBoundingClientRect();
      cy.findByRole('option', { name: /^item 25$/i }).then(($item) => {
        const itemRect = $item[0].getBoundingClientRect();
        expect(itemRect.top, 'selected item stays below the viewport').to.be.greaterThan(
          viewportRect.bottom,
        );
      });
    });
  });

  it('keeps the focused item visible while navigating with the keyboard', () => {
    cy.findByLabelText(/choose an item/i).click();
    cy.findByRole('listbox').should('be.visible');

    // Walk focus up from the selected item; the scroll buttons mount/unmount as
    // we move, and the focused item must remain within the viewport.
    cy.realPress('ArrowUp');
    cy.realPress('ArrowUp');
    cy.realPress('ArrowUp');
    cy.realPress('ArrowUp');
    cy.realPress('ArrowUp');

    cy.get('[data-radix-select-viewport]').then(($viewport) => {
      const viewportRect = $viewport[0].getBoundingClientRect();
      cy.focused().then(($item) => {
        const itemRect = $item[0].getBoundingClientRect();
        expect(itemRect.bottom, 'focused item is below the viewport top').to.be.greaterThan(
          viewportRect.top,
        );
        expect(itemRect.top, 'focused item is above the viewport bottom').to.be.lessThan(
          viewportRect.bottom,
        );
      });
    });
  });
});
