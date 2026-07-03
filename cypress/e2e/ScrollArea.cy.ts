describe('ScrollArea', () => {
  beforeEach(() => {
    cy.visitStory('scrollarea--cypress');
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/2383
  describe('given both scrollbars were visible and one becomes hidden', () => {
    it('resets the corner size CSS variables back to zero', () => {
      // Both scrollbars overflow, so the corner appears and exposes its size.
      cy.findByTestId('root').should(($root) => {
        const style = getComputedStyle($root[0]);
        expect(style.getPropertyValue('--radix-scroll-area-corner-width').trim()).to.equal('8px');
        expect(style.getPropertyValue('--radix-scroll-area-corner-height').trim()).to.equal('8px');
      });

      // Remove the horizontal overflow so the horizontal scrollbar goes away.
      cy.findByTestId('toggle-horizontal-overflow').click();

      // The corner variables should now be reset so the remaining vertical
      // scrollbar doesn't leave a gap at the bottom.
      cy.findByTestId('root').should(($root) => {
        const style = getComputedStyle($root[0]);
        expect(style.getPropertyValue('--radix-scroll-area-corner-width').trim()).to.equal('0px');
        expect(style.getPropertyValue('--radix-scroll-area-corner-height').trim()).to.equal('0px');
      });
    });
  });
});
