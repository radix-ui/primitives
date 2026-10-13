import { expect, test } from '@playwright/test';
import { visitStory } from './helpers';

test.describe('Tooltip within a popover', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'tooltip--within-popover');
  });

  test('does not open when the popover moves focus to the trigger after a mouse click', async ({
    page,
  }) => {
    await page.getByText('Open popover', { exact: true }).click();

    await expect(page.getByText('Close popover', { exact: true })).toBeVisible();
    await expect(page.getByText('Hover or Focus me', { exact: true })).toBeFocused();
    await expect(page.getByRole('tooltip')).toHaveCount(0);
  });

  test('opens when the trigger receives keyboard focus', async ({ page }) => {
    await page.getByText('Open popover', { exact: true }).click();
    await expect(page.getByText('Close popover', { exact: true })).toBeVisible();

    await page.keyboard.press('Tab');
    await page.keyboard.press('Shift+Tab');

    await expect(page.getByText('Hover or Focus me', { exact: true })).toBeFocused();
    await expect(page.getByRole('tooltip')).toBeVisible();
  });

  test('opens when the trigger is hovered', async ({ page }) => {
    await page.getByText('Open popover', { exact: true }).click();
    await expect(page.getByText('Close popover', { exact: true })).toBeVisible();

    await page.getByText('Hover or Focus me', { exact: true }).hover();

    await expect(page.getByRole('tooltip')).toBeVisible();
  });
});
