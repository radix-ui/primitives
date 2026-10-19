import { expect, test } from '@playwright/test';
import { visitStory } from './helpers';

test.describe('FocusScope after Suspense', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'dialog--suspense');
  });

  test('pauses a revealed dialog when a confirmation opens', async ({ page }) => {
    const field = page.getByLabel('Name', { exact: true });
    await expect(field).toBeFocused();
    await page.getByRole('button', { name: 'Suspend dialog', exact: true }).click();
    await page.getByText('Resume dialogs', { exact: true }).click();
    await expect(field).toBeVisible();
    // Let the previous effect's delayed cleanup run before opening another scope.
    await page.waitForTimeout(50);
    await page.getByRole('button', { name: 'Open confirmation' }).click();
    const cancel = page.getByRole('button', { name: 'Cancel', exact: true });
    await expect(cancel).toBeFocused();

    await field.evaluate((element) => element.focus());
    await expect(cancel).toBeFocused();
    await cancel.click();
    await expect(page.getByRole('button', { name: 'Open confirmation' })).toBeFocused();
  });

  test('keeps the top dialog active when both dialogs are revealed together', async ({ page }) => {
    await page.getByRole('button', { name: 'Open confirmation' }).click();
    await page.getByRole('button', { name: 'Suspend dialogs', exact: true }).click();
    await page.getByText('Resume dialogs', { exact: true }).click();
    const cancel = page.getByRole('button', { name: 'Cancel', exact: true });
    await expect(cancel).toBeVisible();
    await page.waitForTimeout(50);
    await cancel.focus();
    // The underlying dialog is aria-hidden while the confirmation is open.
    await page.getByLabel('Name', { exact: true }).evaluate((element) => element.focus());
    await expect(cancel).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByRole('button', { name: 'Suspend dialogs', exact: true })).toBeFocused();
  });
});
