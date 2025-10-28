describe('Dialog', () => {
  beforeEach(() => {
    cy.visitStory('dialog--cypress');
  });

  function shouldBeOpen() {
    cy.findByText('title').should('exist');
  }
  function shouldBeClosed() {
    cy.findByText('title').should('not.exist');
  }
  function shouldNotAllowOutsideInteraction(action: 'realClick' | 'realTouch') {
    cy.findByLabelText('count up')
      .invoke('text')
      .then((count) => {
        if (action === 'realTouch') {
          cy.findByLabelText('count up').realClick();
        } else {
          cy.findByLabelText('count up').realTouch();
        }
        cy.findByLabelText('count up').should('have.text', count);
      });
  }
  function shouldAllowOutsideInteraction(action: 'realClick' | 'realTouch') {
    cy.findByLabelText('count up')
      .invoke('text')
      .then((count) => {
        if (action === 'realTouch') {
          cy.findByLabelText('count up').realClick();
        } else {
          cy.findByLabelText('count up').realTouch();
        }
        cy.findByLabelText('count up').should('not.have.text', count);
      });
  }

  describe('given a modal dialog', () => {
    it('can be open/closed with a keyboard', () => {
      // using keyboard on open/close buttons
      cy.findByText('open').focus();
      cy.realPress('Space');
      shouldBeOpen();
      cy.findByText('close').should('be.focused');
      cy.realPress('Space');
      shouldBeClosed();
      cy.findByText('open').should('be.focused');

      // using keyboard on open button and close with escape
      cy.realPress('Space');
      shouldBeOpen();
      cy.realPress('Escape');
      shouldBeClosed();
    });

    it('can be open/closed with a pointer', () => {
      // using pointer on open/close buttons
      cy.findByText('open').click();
      shouldBeOpen();
      cy.findByText('close').should('be.focused').click();
      shouldBeClosed();
      cy.findByText('open').should('be.focused');

      // using mouse inside dialog, then on a button outside
      cy.findByText('open').click();
      shouldBeOpen();
      cy.findByText('title').click();
      shouldBeOpen();
      shouldNotAllowOutsideInteraction('realClick');
      shouldBeClosed();

      // using touch on a button outside
      cy.findByText('open').click();
      shouldBeOpen();
      shouldNotAllowOutsideInteraction('realTouch');
      shouldBeClosed();

      // using mouse on an input outside
      cy.findByText('open').click();
      shouldBeOpen();
      cy.findByPlaceholderText('name').realClick();
      cy.findByPlaceholderText('name').should('not.be.focused');
      shouldBeClosed();

      // using touch on an input outside
      cy.findByText('open').click();
      shouldBeOpen();
      cy.findByPlaceholderText('name').realTouch();
      cy.findByPlaceholderText('name').should('not.be.focused');
      shouldBeClosed();

      // turn on animation
      cy.findByLabelText('animated').click();

      // using mouse on an input outside an animated dialog
      cy.findByText('open').click();
      shouldBeOpen();
      cy.findByPlaceholderText('name').realClick();
      cy.findByPlaceholderText('name').should('not.be.focused');
      shouldBeClosed();

      // finally, ensure that pointer-events have been reset and interactions restored
      shouldAllowOutsideInteraction('realClick');

      // using touch on an input outside an animated dialog
      cy.findByText('open').click();
      shouldBeOpen();
      cy.findByPlaceholderText('name').realTouch();
      cy.findByPlaceholderText('name').should('not.be.focused');
      shouldBeClosed();

      // finally, ensure that pointer-events have been reset and interactions restored
      shouldAllowOutsideInteraction('realTouch');
    });

    it('keeps focus trapped even if focused element is removed', () => {
      cy.findByText('open').click();
      cy.findByText('close').should('be.focused');
      cy.realPress('Tab');
      cy.findByText('destroy me').should('be.focused');
      cy.realPress('Space');
      cy.realPress('Tab');
      cy.findByText('close').should('be.focused');
    });
  });

  describe('given a non-modal dialog', () => {
    beforeEach(() => {
      cy.findByLabelText('modal').click();
    });

    it('can be open/closed with a keyboard', () => {
      // using keyboard on open/close buttons
      cy.findByText('open').focus();
      cy.realPress('Space');
      shouldBeOpen();
      cy.findByText('close').should('be.focused');
      cy.realPress('Space');
      shouldBeClosed();
      cy.findByText('open').should('be.focused');

      // using keyboard on open button and close with escape
      cy.realPress('Space');
      shouldBeOpen();
      cy.realPress('Escape');
      shouldBeClosed();
    });

    it('can be open/closed with a pointer', () => {
      // using pointer on open/close buttons
      cy.findByText('open').click();
      shouldBeOpen();
      cy.findByText('close').should('be.focused').click();
      shouldBeClosed();
      cy.findByText('open').should('be.focused');

      // using mouse inside dialog, then on a button outside
      cy.findByText('open').click();
      shouldBeOpen();
      cy.findByText('title').click();
      shouldBeOpen();
      shouldAllowOutsideInteraction('realClick');
      shouldBeClosed();

      // using touch on a button outside
      cy.findByText('open').click();
      shouldBeOpen();
      shouldAllowOutsideInteraction('realTouch');
      shouldBeClosed();

      // using mouse on an input outside
      cy.findByText('open').click();
      shouldBeOpen();
      cy.findByPlaceholderText('name').realClick();
      cy.findByPlaceholderText('name').should('be.focused');
      shouldBeClosed();

      // using touch on an input outside
      cy.findByText('open').click();
      shouldBeOpen();
      cy.findByPlaceholderText('name').realTouch();
      cy.findByPlaceholderText('name').should('be.focused');
      shouldBeClosed();

      // turn on animation
      cy.findByLabelText('animated').click();

      // using mouse on an input outside an animated dialog
      cy.findByText('open').click();
      shouldBeOpen();
      cy.findByPlaceholderText('name').realClick();
      cy.findByPlaceholderText('name').should('be.focused');
      shouldBeClosed();

      // finally, ensure that pointer-events have been reset and interactions restored
      shouldAllowOutsideInteraction('realClick');

      // using touch on an input outside an animated dialog
      cy.findByText('open').click();
      shouldBeOpen();
      cy.findByPlaceholderText('name').realTouch();
      cy.findByPlaceholderText('name').should('be.focused');
      shouldBeClosed();

      // finally, ensure that pointer-events have been reset and interactions restored
      shouldAllowOutsideInteraction('realTouch');
    });
  });
});
