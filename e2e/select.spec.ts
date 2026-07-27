import { expect, test } from '@playwright/test';
import { touchSwipe, visitStory } from './helpers';

test.describe('Select', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'select--cypress');
  });

  test.describe('given a select inside a form', () => {
    test('should submit and react to changes', async ({ page }) => {
      // submit without change
      await page.getByText('buy', { exact: true }).click();
      await expect(page.getByText(/t-shirt size/)).toContainText('size M');

      // react to changes
      await page.getByLabel(/choose a size/).click();
      await page.getByRole('option', { name: /small/i }).click();
      await expect(page.getByText(/t-shirt size/)).toContainText('size S');
    });
  });

  test.describe('given a select with no value', () => {
    test('should display the placeholder', async ({ page }) => {
      await expect(page.getByText('…', { exact: true })).toBeAttached();
    });

    test('can be reset to the placeholder', async ({ page }) => {
      const modelTrigger = page.getByLabel(/choose a model/);
      await modelTrigger.click();
      await page.getByRole('option', { name: /model x/i }).click();
      await expect(page.getByRole('listbox')).toHaveCount(0);
      await expect(modelTrigger).toContainText('Model X');
      await page.getByText('unset', { exact: true }).click();
      await expect(modelTrigger).toContainText('…');
      await expect(modelTrigger).not.toContainText('Model X');
    });

    test('submits an empty value after being reset to the placeholder', async ({ page }) => {
      await page.getByLabel(/choose a model/).click();
      await page.getByRole('option', { name: /model x/i }).click();
      await page.getByText('unset', { exact: true }).click();
      await page.getByText('submit model', { exact: true }).click();
      await expect(page.getByText('Submitted model: empty', { exact: true })).toBeAttached();
    });
  });

  test.describe('given an open select whose value changes externally', () => {
    test('keeps the positioned content stable', async ({ page }) => {
      const colorTrigger = page.getByLabel(/choose an open color/);
      await colorTrigger.click();
      const listbox = page.getByRole('listbox');
      const before = await listbox.evaluate((el) => {
        const rect = el.parentElement!.getBoundingClientRect();
        return { left: rect.left, top: rect.top };
      });

      await page.getByText('toggle open color value', { exact: true }).evaluate((el) => {
        (el as HTMLElement).click();
      });

      await expect(listbox).toBeAttached();
      await expect(colorTrigger).toContainText('Pick a color');
      const after = await listbox.evaluate((el) => {
        const rect = el.parentElement!.getBoundingClientRect();
        return { left: rect.left, top: rect.top };
      });

      expect(Math.abs(after.left - before.left)).toBeLessThan(1);
      expect(Math.abs(after.top - before.top)).toBeLessThan(1);
    });
  });
});

test.describe('Select extension overlay interactions', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'select--with-extension-overlay');
  });

  test('closes when an external overlay stops later mouse events', async ({ page }) => {
    await page.getByText('Trigger overlay', { exact: true }).click();
    await expect(page.getByTestId('external-overlay')).toBeAttached();
    await page.getByText(/choose a number/i).click();
    await expect(page.getByRole('listbox')).toBeAttached();

    await page.getByTestId('external-overlay-button').click();

    await expect(page.getByRole('listbox')).toHaveCount(0);
  });
});

test.describe('Select nested in Dialog', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'select--dismisses-only-select-inside-dialog');
  });

  test('dismisses only the select when clicking inside dialog outside select', async ({ page }) => {
    await page.getByText('Open dialog', { exact: true }).click();
    await page.getByRole('combobox', { name: /choose a value/i }).click();

    await expect(page.getByText('Dialog with nested select', { exact: true })).toBeVisible();
    await expect(page.getByText('dialog: open | select: open', { exact: true })).toBeVisible();

    await page.getByText('Dialog with nested select', { exact: true }).click({ force: true });

    await expect(page.getByText('Dialog with nested select', { exact: true })).toBeVisible();
    await expect(page.getByText('dialog: open | select: closed', { exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'One' })).toHaveCount(0);
  });
});

test.describe('Select nested in Popover', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'select--dismisses-only-select-in-popover');
  });

  test('dismisses only the open select when clicking another select trigger', async ({ page }) => {
    await page.getByText('Open popover', { exact: true }).click();
    await page.getByTestId('first-trigger').click();

    await expect(
      page.getByText('popover: open | first: open | second: closed', { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('option', { name: 'One' })).toBeAttached();

    // Clicking the second trigger while the first select is open should close
    // the first select but keep the popover open.
    await page.getByTestId('second-trigger').click({ force: true });

    await expect(page.getByText(/^popover: open/)).toBeVisible();
    await expect(page.getByRole('option', { name: 'One' })).toHaveCount(0);
  });
});

test.describe('Select (shadow DOM)', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'select--cypress-shadow-dom');
  });

  test.describe('given a select with a shadow DOM portal', () => {
    test('should remain open after touch-scrolling and allow item selection', async ({ page }) => {
      const host = page.locator('.shadow-host');

      // open select with a touch event
      await host.getByLabel(/pick a food/i).tap();

      // wait for the content to be open and settled before interacting with it
      await expect(host.getByRole('listbox')).toBeVisible();

      // trigger a touch scroll, triggering the pointer move event and ensuring
      // we do not preventDefault on the upcoming pointer up event
      await touchSwipe(page, host.locator('[data-radix-select-viewport]'), 'toTop', 30);

      // assert the select content is still open after swiping
      await expect(host.getByRole('listbox')).toBeAttached();

      // Select an item after scrolling, ensuring it is scrolled into view and
      // visible so the touch reliably lands within the constrained viewport.
      const option = host.getByRole('option', { name: /Grapes/i });
      await option.scrollIntoViewIfNeeded();
      await expect(option).toBeVisible();

      // Retry until the option reports the same position on two consecutive
      // checks, i.e. any residual swipe momentum / scroll-into-view adjustment
      // has settled. Otherwise the row can shift by a few pixels between
      // computing the tap coordinates and dispatching the touch, landing it on
      // a neighbouring option.
      let previousTop = Number.NaN;
      await expect
        .poll(async () => {
          const box = await option.boundingBox();
          const currentTop = box?.y ?? Number.NaN;
          const isStable = currentTop === previousTop;
          previousTop = currentTop;
          return isStable;
        })
        .toBe(true);
      await option.tap();

      // selecting an item should close the content, which confirms the
      // selection registered before we assert on the bound value
      await expect(host.getByRole('listbox')).toHaveCount(0);

      // assert the select value has been updated.
      await expect(host.getByText('food: grapes')).toBeVisible();
    });
  });
});
