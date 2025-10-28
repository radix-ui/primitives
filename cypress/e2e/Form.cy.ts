describe('Form', () => {
  before(() => {
    cy.visitStory('form--cypress');
  });

  beforeEach(() => {
    cy.findByText('reset').click();
  });

  function checkControlMessageAssociation() {
    cy.get('@control').should('have.attr', 'aria-describedby');
    cy.get('@control')
      .invoke('attr', 'aria-describedby')
      .then((ariaDescribedby) =>
        cy.get('@message').invoke('attr', 'id').should('equal', ariaDescribedby)
      );
  }

  describe('given a form', () => {
    it('should associate label and control', () => {
      cy.findByText(/email/i).click();
      cy.findByLabelText(/email/i).should('be.focused');
    });

    it('allows custom label and control association', () => {
      cy.findByText(/country/i).click();
      cy.findByLabelText(/country/i).should('be.focused');
    });
  });

  describe('given a form with client-side validation', () => {
    it('should prevent submitting when there are errors', () => {
      cy.findByText('submit').click();
      cy.findByText(/data/i).should('include.text', '{}');
    });

    it('should focus the first control with an error', () => {
      cy.findByText('submit').click();
      cy.findByLabelText(/name/i).should('be.focused');
    });

    it('should handle `valueMissing` validity', () => {
      cy.findByLabelText(/name/i).as('control');
      cy.findByText('submit').click();
      cy.findByText(/missing/).as('message');
      checkControlMessageAssociation();

      cy.get('@control').focus();
      cy.get('@control').realType('John');
      cy.realPress('Tab');
      cy.findByText(/missing/).should('not.exist');
    });

    it('should handle `valid` validity', () => {
      cy.findByLabelText(/name/i).as('control').focus();
      cy.get('@control').realType('John');
      cy.realPress('Tab');
      cy.findByText('valid!').as('message');
      checkControlMessageAssociation();

      cy.findByText('submit').click();
      cy.findByText(/data/i).should('include.text', '"name": "John"');
    });

    it('should handle `rangeOverflow` validity', () => {
      cy.findByLabelText(/age/i).as('control').focus();
      cy.get('@control').realType('200');
      cy.realPress('Tab');
      cy.findByText(/too large/).as('message');
      checkControlMessageAssociation();

      cy.get('@control').focus();
      cy.get('@control').clear();
      cy.get('@control').realType('50');
      cy.realPress('Tab');
      cy.findByText(/does not match the required step/).should('not.exist');
    });

    it('should handle `rangeUnderflow` validity', () => {
      cy.findByLabelText(/age/i).as('control').focus();
      cy.get('@control').realType('-50');
      cy.realPress('Tab');
      cy.findByText(/too small/).as('message');
      checkControlMessageAssociation();

      cy.get('@control').focus();
      cy.get('@control').clear();
      cy.get('@control').realType('50');
      cy.realPress('Tab');
      cy.findByText(/does not match the required step/).should('not.exist');
    });

    it('should handle `stepMismatch` validity', () => {
      cy.findByLabelText(/age/i).as('control').focus();
      cy.get('@control').realType('10.5');
      cy.realPress('Tab');
      cy.findByText(/does not match the required step/).as('message');
      checkControlMessageAssociation();

      cy.get('@control').focus();
      cy.get('@control').clear();
      cy.get('@control').realType('50');
      cy.realPress('Tab');
      cy.findByText(/does not match the required step/).should('not.exist');
    });

    it('should handle `typeMismatch` validity', () => {
      cy.findByLabelText(/email/i).as('control').focus();
      cy.get('@control').realType('john.doe');
      cy.realPress('Tab');
      cy.findByText(/does not match the required type/).as('message');
      checkControlMessageAssociation();

      cy.get('@control').focus();
      cy.get('@control').realType('@gmail.com');
      cy.realPress('Tab');
      cy.findByText(/does not match the required type/).should('not.exist');
    });

    it('should handle `tooShort` validity', () => {
      cy.findByLabelText(/password/i)
        .as('control')
        .focus();
      cy.get('@control').realType('pass');
      cy.realPress('Tab');
      cy.findByText(/too short/).as('message');
      checkControlMessageAssociation();

      cy.get('@control').focus();
      cy.get('@control').clear();
      cy.get('@control').realType('password');
      cy.realPress('Tab');
      cy.findByText(/too short/).should('not.exist');
    });

    // the browser makes it impossible to type too long
    it.skip('should handle `tooLong` validity', () => {
      cy.findByLabelText(/password/i)
        .as('control')
        .focus();
      cy.get('@control').realType('password is way too long');
      cy.realPress('Tab');
      cy.findByText(/too long/).as('message');
      checkControlMessageAssociation();
    });

    it('should handle `patternMismatch` validity', () => {
      cy.findByLabelText(/pin/i).as('control').focus();
      cy.get('@control').realType('pin');
      cy.realPress('Tab');
      cy.findByText(/does not match the required pattern/).as('message');
      checkControlMessageAssociation();

      cy.get('@control').focus();
      cy.get('@control').clear();
      cy.get('@control').realType('1234');
      cy.realPress('Tab');
      cy.findByText(/does not match the required pattern/).should('not.exist');
    });

    it('should handle custom validity (sync custom validator)', () => {
      cy.findByLabelText(/secret 1/i)
        .as('control')
        .focus();
      cy.get('@control').realType('secret');
      cy.realPress('Tab');
      cy.findByText(/not valid/).as('message');
      checkControlMessageAssociation();

      cy.get('@control').focus();
      cy.get('@control').clear();
      cy.get('@control').realType('shush');
      cy.realPress('Tab');
      cy.findByText(/not valid/).should('not.exist');
    });

    it('should handle custom validity (async custom validator)', () => {
      cy.findByLabelText(/secret 2/i)
        .as('control')
        .focus();
      cy.get('@control').realType('secret');
      cy.realPress('Tab');
      cy.findByText(/not valid/).as('message');
      checkControlMessageAssociation();

      cy.get('@control').focus();
      cy.get('@control').clear();
      cy.get('@control').realType('shush');
      cy.realPress('Tab');
      cy.findByText(/not valid/).should('not.exist');
    });

    it('should allow custom error messages', () => {
      cy.findByLabelText(/country/i)
        .as('control')
        .focus();
      cy.get('@control').realType('Portugal');
      cy.realPress('Tab');
      cy.findByText(/country should be "france" or "spain"/i).as('message');
      checkControlMessageAssociation();
    });
  });

  describe('given a form with server-side validation', () => {
    before(() => {
      cy.findByLabelText(/simulate server errors/i).click();
    });

    beforeEach(() => {
      cy.findByLabelText(/name/i).focus();
      cy.findByLabelText(/name/i).realType('John');
      cy.findByText(/submit/i).click();
    });

    it('should focus the first control with a server error', () => {
      cy.findByLabelText(/email/i).should('be.focused');
    });

    it('allows showing custom server error messages per-field', () => {
      cy.findByLabelText(/email/i).as('control');
      cy.findByText(/email is actually required server side/i).as('message');
      checkControlMessageAssociation();
    });

    it('allows re-using client-side matchers for server errors', () => {
      cy.findByLabelText(/pin/i).as('control');
      cy.findByText(/does not match the required pattern/).as('message');
      checkControlMessageAssociation();
    });

    it('allows re-submitting the form with server errors', () => {
      cy.findByLabelText(/email/i).focus();
      cy.findByLabelText(/email/i).realType('john.doe@gmail.com').realPress('Enter');
      cy.findByLabelText(/email/i).should('be.focused');
    });
  });
});
