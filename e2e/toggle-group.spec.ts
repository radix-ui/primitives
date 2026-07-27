import { expect, test } from '@playwright/test';
import { visitStory } from './helpers';

test.describe('ToggleGroup', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'togglegroup--cypress');
  });

  // Regression test for https://github.com/radix-ui/primitives/issues/3077
  test.describe('given a ToggleGroup as the first focusable element inside a Dialog', () => {
    test('should move focus into the group when the dialog opens', async ({ page }) => {
      await page.getByText('open', { exact: true }).click();
      // The group should hold focus (either the group wrapper itself or its
      // first roving item), rather than focus skipping past it to the close
      // button.
      await expect(page.getByText('close', { exact: true })).not.toBeFocused();
      await expect
        .poll(async () =>
          page.evaluate(() => !!document.activeElement?.closest('[role="radiogroup"]')),
        )
        .toBe(true);
    });
  });
});
