import { expect, test } from '@playwright/test';
import { visitStory } from './helpers';

test.describe('ScrollArea', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'scrollarea--cypress');
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/2383
  test.describe('given both scrollbars were visible and one becomes hidden', () => {
    test('resets the corner size CSS variables back to zero', async ({ page }) => {
      const root = page.getByTestId('root');

      // Both scrollbars overflow, so the corner appears and exposes its size.
      await expect
        .poll(async () =>
          root.evaluate((el) =>
            getComputedStyle(el).getPropertyValue('--radix-scroll-area-corner-width').trim(),
          ),
        )
        .toBe('8px');
      await expect
        .poll(async () =>
          root.evaluate((el) =>
            getComputedStyle(el).getPropertyValue('--radix-scroll-area-corner-height').trim(),
          ),
        )
        .toBe('8px');

      // Remove the horizontal overflow so the horizontal scrollbar goes away.
      await page.getByTestId('toggle-horizontal-overflow').click();

      // The corner variables should now be reset so the remaining vertical
      // scrollbar doesn't leave a gap at the bottom.
      await expect
        .poll(async () =>
          root.evaluate((el) =>
            getComputedStyle(el).getPropertyValue('--radix-scroll-area-corner-width').trim(),
          ),
        )
        .toBe('0px');
      await expect
        .poll(async () =>
          root.evaluate((el) =>
            getComputedStyle(el).getPropertyValue('--radix-scroll-area-corner-height').trim(),
          ),
        )
        .toBe('0px');
    });
  });
});
