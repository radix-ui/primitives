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

  describe('given a select with a form attribute outside of a form', () => {
    it('should include the select value when submitting the form', () => {
      // submit without change
      cy.findByText('go to').click();
      cy.findByText(/You are going to/).should('include.text', 'Earth');

      // react to changes
      cy.findByLabelText(/choose a planet/).click();
      cy.findByRole('option', { name: /Jupiter/i }).click();
      cy.findByText('go to').click();
      cy.findByText(/You are going to/).should('include.text', 'Jupiter');
    });
  });
});
