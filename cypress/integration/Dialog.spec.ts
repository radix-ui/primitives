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
  function shouldNotAllowOutsideButtonAction(action: 'click' | 'touch') {
    cy.findByLabelText('count up')
      .invoke('text')
      .then((count) => {
        if (action === 'touch') {
          cy.findByLabelText('count up').realClick();
        } else {
          cy.findByLabelText('count up').realTouch();
        }
        cy.findByLabelText('count up').should('have.text', count);
      });
  }
  function shouldAllowOutsideButtonAction(action: 'click' | 'touch') {
    cy.findByLabelText('count up')
      .invoke('text')
      .then((count) => {
        if (action === 'touch') {
          cy.findByLabelText('count up').realClick();
        } else {
          cy.findByLabelText('count up').realTouch();
        }
        cy.findByLabelText('count up').should('not.eq', count);
      });
  }

  describe('given a modal dialog', () => {
    it('can be used with a keyboard', () => {
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

    it('can be used with a mouse', () => {
      // using mouse on open/close buttons
      cy.findByText('open').realClick();
      shouldBeOpen();
      cy.findByText('close').should('be.focused').realClick();
      shouldBeClosed();
      cy.findByText('open').should('be.focused');

      // using mouse inside dialog, then on a button outside
      cy.findByText('open').realClick();
      shouldBeOpen();
      cy.findByText('title').realClick();
      shouldBeOpen();
      shouldNotAllowOutsideButtonAction('click');
      shouldBeClosed();

      // using mouse on an input outside
      cy.findByText('open').realClick();
      shouldBeOpen();
      cy.findByPlaceholderText('name').realClick();
      cy.findByPlaceholderText('name').should('not.be.focused');
      shouldBeClosed();

      // using mouse on an input outside an animated dialog
      cy.findByLabelText('animated?').realClick();
      cy.findByText('open').realClick();
      shouldBeOpen();
      cy.findByPlaceholderText('name').realClick();
      cy.findByPlaceholderText('name').should('not.be.focused');
      shouldBeClosed();

      // finally, make sure that we have no pointer-events regression
      shouldAllowOutsideButtonAction('click');
    });

    it('can be used with touch', () => {
      // using touch on open/close buttons
      cy.findByText('open').realClick();
      shouldBeOpen();
      cy.findByText('close').should('be.focused').realClick();
      shouldBeClosed();
      cy.findByText('open').should('be.focused');

      // using touch inside dialog, then on a button outside
      cy.findByText('open').realClick();
      shouldBeOpen();
      cy.findByText('title').realClick();
      shouldBeOpen();
      shouldNotAllowOutsideButtonAction('touch');
      shouldBeClosed();

      // using touch on an input outside
      cy.findByText('open').realClick();
      shouldBeOpen();
      cy.findByPlaceholderText('name').realClick();
      cy.findByPlaceholderText('name').should('not.be.focused');
      shouldBeClosed();

      // using touch on an input outside an animated dialog
      cy.findByLabelText('animated?').realClick();
      cy.findByText('open').realClick();
      shouldBeOpen();
      cy.findByPlaceholderText('name').realClick();
      cy.findByPlaceholderText('name').should('not.be.focused');
      shouldBeClosed();

      // finally, make sure that we have no pointer-events regression
      shouldAllowOutsideButtonAction('touch');
    });
  });

  describe('given a non-modal dialog', () => {
    beforeEach(() => {
      cy.findByLabelText('modal?').realClick();
    });

    it('can be used with a keyboard', () => {
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

    it('can be used with a mouse', () => {
      // using mouse on open/close buttons
      cy.findByText('open').realClick();
      shouldBeOpen();
      cy.findByText('close').should('be.focused').realClick();
      shouldBeClosed();
      cy.findByText('open').should('be.focused');

      // using mouse inside dialog, then on a button outside
      cy.findByText('open').realClick();
      shouldBeOpen();
      cy.findByText('title').realClick();
      shouldBeOpen();
      shouldAllowOutsideButtonAction('click');
      shouldBeClosed();

      // using mouse on an input outside
      cy.findByText('open').realClick();
      shouldBeOpen();
      cy.findByPlaceholderText('name').realClick();
      cy.findByPlaceholderText('name').should('be.focused');
      shouldBeClosed();

      // using mouse on an input outside an animated dialog
      cy.findByLabelText('animated?').realClick();
      cy.findByText('open').realClick();
      shouldBeOpen();
      cy.findByPlaceholderText('name').realClick();
      cy.findByPlaceholderText('name').should('be.focused');
      shouldBeClosed();

      // finally, make sure that we have no pointer-events regression
      shouldAllowOutsideButtonAction('click');
    });

    it('can be used with touch', () => {
      // using touch on open/close buttons
      cy.findByText('open').realClick();
      shouldBeOpen();
      cy.findByText('close').should('be.focused').realClick();
      shouldBeClosed();
      cy.findByText('open').should('be.focused');

      // using touch inside dialog, then on a button outside
      cy.findByText('open').realClick();
      shouldBeOpen();
      cy.findByText('title').realClick();
      shouldBeOpen();
      shouldAllowOutsideButtonAction('touch');
      shouldBeClosed();

      // using touch on an input outside
      cy.findByText('open').realClick();
      shouldBeOpen();
      cy.findByPlaceholderText('name').realClick();
      cy.findByPlaceholderText('name').should('be.focused');
      shouldBeClosed();

      // using touch on an input outside an animated dialog
      cy.findByLabelText('animated?').realClick();
      cy.findByText('open').realClick();
      shouldBeOpen();
      cy.findByPlaceholderText('name').realClick();
      cy.findByPlaceholderText('name').should('be.focused');
      shouldBeClosed();

      // finally, make sure that we have no pointer-events regression
      shouldAllowOutsideButtonAction('touch');
    });
  });
});
