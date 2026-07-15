import { expect, test, type Page } from '@playwright/test';
import { visitStoryById } from './helpers';

// `Popper` stories live under the `Utilities/*` namespace, so they can't be
// reached through the `components-` prefixed `visitStory` helper.
function visitPopperStory(page: Page, storyName: string) {
  return visitStoryById(page, `utilities-popper--${storyName}`);
}

test.describe('Popper', () => {
  // Regression test for https://github.com/radix-ui/primitives/pull/3237
  test.describe('given hideWhenDetached and no explicit collisionBoundary', () => {
    test.beforeEach(async ({ page }) => {
      await visitPopperStory(page, 'hide-when-detached-in-scroll-container');
    });

    test('hides the content when the anchor is clipped by its scroll container but still within the viewport', async ({
      page,
    }) => {
      await expect(page.getByTestId('content')).toBeVisible();

      // Scroll the anchor out of the (200px tall) scroll container while keeping
      // it on screen. Detach detection must fall back to clipping ancestors, not
      // the viewport, otherwise the content would incorrectly stay visible.
      await page.getByTestId('scroll-container').evaluate((el) => el.scrollTo(0, 200));

      await expect(page.getByTestId('content')).not.toBeVisible();
    });
  });

  // Regression test for the 1.3.0 custom-portal regression.
  test.describe('given content in a transformed, overflow-clipping custom portal host', () => {
    test.beforeEach(async ({ page }) => {
      await visitPopperStory(page, 'available-size-with-custom-portal');
    });

    test('measures available size against the viewport, not the portal host', async ({ page }) => {
      // The portal host is only 120px tall. If the collision/size middlewares
      // clamped to it (the regression), available height would be <= ~120px.
      const wrapper = page.locator('[data-radix-popper-content-wrapper]');
      await expect
        .poll(async () =>
          wrapper.evaluate((el) =>
            parseFloat(getComputedStyle(el).getPropertyValue('--radix-popper-available-height')),
          ),
        )
        .toBeGreaterThan(300);
    });
  });
});
