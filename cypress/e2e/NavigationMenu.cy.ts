describe('NavigationMenu — click-after-hover sticks open', () => {
  beforeEach(() => {
    cy.visitStory('navigationmenu--basic');
  });

  it('hover → click on same trigger keeps dropdown open', () => {
    cy.findByText('Products').realHover();
    cy.findByText('Products').should('have.attr', 'data-state', 'open');
    cy.findByText('Products').realClick();
    cy.findByText('Products').should('have.attr', 'data-state', 'open');
  });

  it('click on closed trigger opens it (regression)', () => {
    cy.findByText('Products').should('have.attr', 'data-state', 'closed');
    cy.findByText('Products').realClick();
    cy.findByText('Products').should('have.attr', 'data-state', 'open');
  });

  it('click on click-opened trigger toggles closed (regression)', () => {
    cy.findByText('Products').realClick();
    cy.findByText('Products').should('have.attr', 'data-state', 'open');
    cy.findByText('Products').realClick();
    cy.findByText('Products').should('have.attr', 'data-state', 'closed');
  });

  it('hover A → hover B opens B and closes A (regression)', () => {
    cy.findByText('Products').realHover();
    cy.findByText('Products').should('have.attr', 'data-state', 'open');
    cy.findByText('Company').realHover();
    cy.findByText('Company').should('have.attr', 'data-state', 'open');
    cy.findByText('Products').should('have.attr', 'data-state', 'closed');
  });

  it('hover → leave → re-hover → click sticks open (ref reset)', () => {
    cy.findByText('Products').realHover();
    cy.findByText('Products').should('have.attr', 'data-state', 'open');
    cy.findByText('Link').realHover();
    cy.findByText('Products').should('have.attr', 'data-state', 'closed');
    cy.findByText('Products').realHover();
    cy.findByText('Products').should('have.attr', 'data-state', 'open');
    cy.findByText('Products').realClick();
    cy.findByText('Products').should('have.attr', 'data-state', 'open');
  });
});
