import { expect, test } from '@playwright/test';
import { visitStory } from './helpers';

test.describe('Popover', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'popover--with-extension-overlay');
  });

  test('keeps the popover open when an external overlay stops later mouse events', async ({
    page,
  }) => {
    await page.getByText('open', { exact: true }).click();
    await expect(page.getByText('close', { exact: true })).toBeVisible();
    await page.getByText('Trigger overlay', { exact: true }).click();
    await expect(page.getByTestId('external-overlay')).toBeAttached();

    await page.getByTestId('external-overlay-button').click();

    await expect(page.getByText('close', { exact: true })).toBeVisible();
  });
});

test.describe('non-modal popover nested in dialog', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'popover--dismisses-only-popover-inside-dialog');

    // click twice to ensure the popover is not modal
    await page.getByLabel('Modal').click();
    await page.getByLabel('Modal').click();
  });

  test('dismisses both the popover and the dialog when clicking outside both layers', async ({
    page,
  }) => {
    await page.getByText('Open dialog', { exact: true }).click();
    await page.getByText('Open popover', { exact: true }).click();

    await expect(page.getByText('dialog: open | popover: open', { exact: true })).toBeVisible();

    await page.locator('body').click({ position: { x: 5, y: 5 }, force: true });

    // The dialog closing unmounts its content (including the status text), so we
    // assert the dismissable affordances are gone and the trigger is back.
    await expect(page.getByText('Close popover', { exact: true })).toHaveCount(0);
    await expect(page.getByText('Close dialog', { exact: true })).toHaveCount(0);
    await expect(page.getByText('Open dialog', { exact: true })).toBeVisible();
  });
});

test.describe('modal popover nested in dialog', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'popover--dismisses-only-popover-inside-dialog');
    await page.getByLabel('Modal').click();
  });

  test('dismisses only the popover when clicking outside the popover', async ({ page }) => {
    await page.getByText('Open dialog', { exact: true }).click();
    await page.getByText('Open popover', { exact: true }).click();

    await expect(page.getByText('dialog: open | popover: open', { exact: true })).toBeVisible();

    // A modal popover shields the dialog, so an outside interaction dismisses
    // only the popover while the dialog stays open.
    await page.locator('body').click({ position: { x: 5, y: 5 }, force: true });

    await expect(page.getByText('dialog: open | popover: closed', { exact: true })).toBeVisible();
    await expect(page.getByText('Close popover', { exact: true })).toHaveCount(0);
    await expect(page.getByText('Close dialog', { exact: true })).toBeVisible();
  });
});
