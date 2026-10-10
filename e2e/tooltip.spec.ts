import { expect, test } from '@playwright/test';
import { visitStory } from './helpers';

test.describe('Tooltip extension overlay interactions', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'tooltip--with-extension-overlay');
  });

  test('keeps the tooltip open when an external overlay stops later mouse events', async ({
    page,
  }) => {
    await expect(page.getByTestId('tooltip-state')).toHaveText('open');
    await page.getByText('Trigger overlay', { exact: true }).click();
    await expect(page.getByTestId('external-overlay')).toBeAttached();

    await page.getByTestId('external-overlay-button').click();

    await expect(page.getByTestId('tooltip-state')).toHaveText('open');
  });
});
