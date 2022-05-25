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
});
