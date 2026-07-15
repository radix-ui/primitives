import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { visitStory } from './helpers';

test.describe('Toast', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'toast--cypress');
  });

  async function buttonIsFocused(page: Page, identifier: number) {
    await expect(page.getByText(`Toast button ${identifier}`, { exact: true })).toBeFocused();
  }

  async function toastIsFocused(page: Page, identifier: number) {
    await expect(page.getByTestId(`toast-${identifier}`)).toBeFocused();
  }

  test.describe('given zero toasts', () => {
    test('should not interrupt natural tab order in the document', async ({ page }) => {
      await page.getByText('Focusable before viewport', { exact: true }).focus();

      await page.keyboard.press('Tab');
      await expect(page.getByText('Focusable after viewport', { exact: true })).toBeFocused();

      await page.keyboard.press('Shift+Tab');
      await expect(page.getByText('Focusable before viewport', { exact: true })).toBeFocused();
    });
  });

  test.describe('given multiple toasts', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByText('Add toast', { exact: true }).click();
      await page.getByText('Add toast', { exact: true }).click();
    });

    test('should have no acessibility issues', async ({ page }) => {
      const results = await new AxeBuilder({ page })
        .include('[aria-label="Notifications (F8)"]')
        .analyze();
      expect(results.violations).toEqual([]);
    });

    test('should reverse tab order from most recent to least', async ({ page }) => {
      await page.getByText('Focusable before viewport', { exact: true }).focus();

      await page.keyboard.press('Tab');
      await toastIsFocused(page, 2);

      // Forward tab
      await page.keyboard.press('Tab');
      await buttonIsFocused(page, 2.1);

      await page.keyboard.press('Tab');
      await buttonIsFocused(page, 2.2);

      await page.keyboard.press('Tab');
      await toastIsFocused(page, 1);

      await page.keyboard.press('Tab');
      await buttonIsFocused(page, 1.1);

      await page.keyboard.press('Tab');
      await buttonIsFocused(page, 1.2);

      // End of viewport
      await page.keyboard.press('Tab');
      await expect(page.getByText('Focusable after viewport', { exact: true })).toBeFocused();

      // Backwards tab
      await page.keyboard.press('Shift+Tab');
      await buttonIsFocused(page, 1.2);

      await page.keyboard.press('Shift+Tab');
      await buttonIsFocused(page, 1.1);

      await page.keyboard.press('Shift+Tab');
      await toastIsFocused(page, 1);

      await page.keyboard.press('Shift+Tab');
      await buttonIsFocused(page, 2.2);

      await page.keyboard.press('Shift+Tab');
      await buttonIsFocused(page, 2.1);

      await page.keyboard.press('Shift+Tab');
      await toastIsFocused(page, 2);

      // Start of viewport
      await page.keyboard.press('Shift+Tab');
      await expect(page.getByText('Focusable before viewport', { exact: true })).toBeFocused();
    });

    test('should tab forwards from viewport to latest toast or backwards into the document', async ({
      page,
    }) => {
      // Tab forward from viewport
      await page.keyboard.press('F8');
      await page.keyboard.press('Tab');
      await toastIsFocused(page, 2);

      // Tab backward from viewport
      await page.keyboard.press('F8');
      await page.keyboard.press('Shift+Tab');
      await expect(page.getByText('Focusable before viewport', { exact: true })).toBeFocused();
    });

    test('should render announcements in document body by default', async ({ page }) => {
      // Add a toast to trigger announcement
      await page.getByText('Add toast', { exact: true }).click();

      // Verify announcement is rendered in document body (default behavior)
      const announcement = page
        .locator('body [role="status"]')
        .filter({ hasText: 'Toast 1 title' });
      await expect(announcement).toContainText('Notification');
      await expect(announcement).toContainText('Toast 1 title');
      await expect(announcement).toContainText('Toast 1 description');

      // Wait for announcement cleanup
      await page.waitForTimeout(1100);

      // Verify announcement is cleaned up
      await expect(page.locator('body [role="status"]')).toHaveCount(0);
    });
  });

  test.describe('given custom announcer container', () => {
    test.beforeEach(async ({ page }) => {
      await visitStory(page, 'toast--custom-announcer-container');
    });

    test('should render announcements in the custom container', async ({ page }) => {
      const container = page.getByTestId('custom-announcer-container');

      // Initially, no announcements should be present
      await expect(container).toBeAttached();
      await expect(container.locator('[role="status"]')).toHaveCount(0);

      // Open a toast
      await page.getByTestId('open-toast-button').click();

      // Verify the toast is visible
      await expect(page.getByTestId('custom-container-toast')).toBeVisible();

      // Verify the announcement is rendered in the custom container
      const announcement = container.locator('[role="status"]');
      await expect(announcement).toContainText('Notification');
      await expect(announcement).toContainText('Custom Container Toast');
      await expect(announcement).toContainText(
        "This toast's announcements are rendered in a custom container",
      );

      // Verify the announcement is NOT directly in the document body (default behavior)
      await expect(page.locator('body > [role="status"]')).toHaveCount(0);
    });

    test('should clean up announcements after timeout', async ({ page }) => {
      const container = page.getByTestId('custom-announcer-container');

      // Open a toast
      await page.getByTestId('open-toast-button').click();

      // Verify announcement exists initially
      await expect(container.locator('[role="status"]')).toHaveCount(1);

      // Wait for announcement cleanup (1000ms timeout)
      await page.waitForTimeout(1100);

      // Verify announcement is cleaned up
      await expect(container.locator('[role="status"]')).toHaveCount(0);
    });
  });
});
