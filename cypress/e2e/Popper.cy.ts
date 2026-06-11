// `Popper` stories live under the `Utilities/*` namespace, so they can't be
// reached through the `components-` prefixed `cy.visitStory` helper.
function visitPopperStory(storyName: string) {
  return cy.visit(`iframe.html?id=utilities-popper--${storyName}`);
}

describe('Popper', () => {
  // Regression test for https://github.com/radix-ui/primitives/pull/3237
  describe('given hideWhenDetached and no explicit collisionBoundary', () => {
    beforeEach(() => {
      visitPopperStory('hide-when-detached-in-scroll-container');
    });

    it('hides the content when the anchor is clipped by its scroll container but still within the viewport', () => {
      cy.findByTestId('content').should('be.visible');

      // Scroll the anchor out of the (200px tall) scroll container while keeping
      // it on screen. Detach detection must fall back to clipping ancestors, not
      // the viewport, otherwise the content would incorrectly stay visible.
      cy.findByTestId('scroll-container').scrollTo(0, 200);

      cy.findByTestId('content').should('not.be.visible');
    });
  });

  // Regression test for the 1.3.0 custom-portal regression.
  describe('given content in a transformed, overflow-clipping custom portal host', () => {
    beforeEach(() => {
      visitPopperStory('available-size-with-custom-portal');
    });

    it('measures available size against the viewport, not the portal host', () => {
      // The portal host is only 120px tall. If the collision/size middlewares
      // clamped to it (the regression), available height would be <= ~120px.
      cy.get('[data-radix-popper-content-wrapper]').should(($wrapper) => {
        const availableHeight = parseFloat(
          getComputedStyle($wrapper[0]).getPropertyValue('--radix-popper-available-height'),
        );
        expect(availableHeight).to.be.greaterThan(300);
      });
    });
  });
});
