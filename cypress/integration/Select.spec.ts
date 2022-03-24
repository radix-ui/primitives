describe('Select', () => {
  describe('with in a form', () => {
    beforeEach(() => {
      cy.visitStory('select--within-form');
    });

    describe('with defaultValue', () => {
      it('is present in form response', () => {
        cy.get('pre').contains('fr').should('not.exist');
        cy.get('input').type('Testing'); // 👈 Triggers form response to be printed to the DOM
        cy.get('pre').contains('fr');
      });

      it('remains uncontrolled', () => {
        cy.get('pre').contains('fr').should('not.exist');
        cy.get('pre').contains('es').should('not.exist');
        cy.get('input').type('Testing'); // 👈 Triggers form response to be printed to the DOM
        cy.get('pre').contains('fr');
        cy.get('select').select('es', { force: true });
        cy.get('pre').contains('es');
      });
    });
  });

  describe('controlled', () => {
    beforeEach(() => {
      cy.visitStory('select--controlled');
    });

    describe('with initial value', () => {
      it('is set as value', () => {
        cy.findByText('🇬🇧').should('be.visible');
        cy.findByText('🇪🇸').should('not.exist');
        cy.findByText('🇫🇷').should('not.exist');
      });

      it('sets new value when selected', () => {
        cy.get('[role="combobox"]').click();
        cy.findByText('United Kingdom').should('be.visible');
        cy.findByText('Spain').should('be.visible');
        cy.findByText('France').should('be.visible');
        cy.get('[role="option"]').contains('Spain').click();
        cy.findByText('🇪🇸').should('be.visible');
        cy.findByText('🇬🇧').should('not.exist');
        cy.findByText('🇫🇷').should('not.exist');
      });
    });
  });
});
