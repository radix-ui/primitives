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

      // trigger a touch scroll, triggering the pointer move event and ensuring
      // we do not preventDefault on the upcoming pointer up event
      cy.get('.shadow-host').shadow().find('[data-radix-select-viewport]').realSwipe('toTop', {
        length: 30,
      });

      // assert the select content is still open after swiping
      cy.get('.shadow-host').shadow().findByRole('listbox').should('exist');

      // select an item after scrolling
      cy.get('.shadow-host')
        .shadow()
        .findByRole('option', { name: /Grapes/i })
        .realTouch();

      // assert the select value has been updated
      cy.get('.shadow-host').shadow().findByText(/food:/).should('include.text', 'grapes');
    });
  });
});
