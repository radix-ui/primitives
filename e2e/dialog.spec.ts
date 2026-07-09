import { expect, test, type Page } from '@playwright/test';
import { visitStory } from './helpers';

test.describe('Dialog', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'dialog--cypress');
  });

  async function shouldBeOpen(page: Page) {
    await expect(page.getByText('title', { exact: true })).toBeAttached();
  }
  async function shouldBeClosed(page: Page) {
    await expect(page.getByText('title', { exact: true })).toHaveCount(0);
  }
  async function shouldNotAllowOutsideInteraction(page: Page, action: 'realClick' | 'realTouch') {
    const countUp = page.getByLabel('count up');
    const count = await countUp.textContent();
    // Let Dialog's dismiss/pointer-events effects settle after opening.
    await page.waitForTimeout(150);
    if (action === 'realTouch') {
      await countUp.click({ force: true });
    } else {
      await countUp.tap({ force: true });
    }
    await expect(countUp).toHaveText(count ?? '');
  }
  async function shouldAllowOutsideInteraction(page: Page, action: 'realClick' | 'realTouch') {
    const countUp = page.getByLabel('count up');
    const count = await countUp.textContent();
    await page.waitForTimeout(150);
    if (action === 'realTouch') {
      await countUp.click({ force: true });
    } else {
      await countUp.tap({ force: true });
    }
    await expect(countUp).not.toHaveText(count ?? '');
  }

  test.describe('given a modal dialog', () => {
    test('can be open/closed with a keyboard', async ({ page }) => {
      // using keyboard on open/close buttons
      await page.getByText('open', { exact: true }).focus();
      await page.keyboard.press('Space');
      await shouldBeOpen(page);
      await expect(page.getByText('close', { exact: true })).toBeFocused();
      await page.keyboard.press('Space');
      await shouldBeClosed(page);
      await expect(page.getByText('open', { exact: true })).toBeFocused();

      // using keyboard on open button and close with escape
      await page.keyboard.press('Space');
      await shouldBeOpen(page);
      await page.keyboard.press('Escape');
      await shouldBeClosed(page);
    });

    test('can be open/closed with a pointer', async ({ page }) => {
      // using pointer on open/close buttons
      await page.getByText('open', { exact: true }).click();
      await shouldBeOpen(page);
      await page.getByText('close', { exact: true }).click();
      await shouldBeClosed(page);
      await expect(page.getByText('open', { exact: true })).toBeFocused();

      // using mouse inside dialog, then on a button outside
      await page.getByText('open', { exact: true }).click();
      await shouldBeOpen(page);
      await page.getByText('title', { exact: true }).click();
      await shouldBeOpen(page);
      await shouldNotAllowOutsideInteraction(page, 'realClick');
      await shouldBeClosed(page);

      // using touch on a button outside
      await page.getByText('open', { exact: true }).click();
      await shouldBeOpen(page);
      await shouldNotAllowOutsideInteraction(page, 'realTouch');
      await shouldBeClosed(page);

      // using mouse on an input outside
      await page.getByText('open', { exact: true }).click();
      await shouldBeOpen(page);
      // Let Dialog's dismiss/pointer-events effects settle after opening.
      await page.waitForTimeout(150);
      await page.getByPlaceholder('name').click({ force: true });
      await expect(page.getByPlaceholder('name')).not.toBeFocused();
      await shouldBeClosed(page);

      // using touch on an input outside
      await page.getByText('open', { exact: true }).click();
      await shouldBeOpen(page);
      // Let Dialog's dismiss/pointer-events effects settle after opening.
      await page.waitForTimeout(150);
      await page.getByPlaceholder('name').tap({ force: true });
      await expect(page.getByPlaceholder('name')).not.toBeFocused();
      await shouldBeClosed(page);

      // turn on animation
      await page.getByLabel('animated').click();

      // using mouse on an input outside an animated dialog
      await page.getByText('open', { exact: true }).click();
      await shouldBeOpen(page);
      // Let Dialog's dismiss/pointer-events effects settle after opening.
      await page.waitForTimeout(150);
      await page.getByPlaceholder('name').click({ force: true });
      await expect(page.getByPlaceholder('name')).not.toBeFocused();
      await shouldBeClosed(page);

      // finally, ensure that pointer-events have been reset and interactions restored
      await shouldAllowOutsideInteraction(page, 'realClick');

      // using touch on an input outside an animated dialog
      await page.getByText('open', { exact: true }).click();
      await shouldBeOpen(page);
      // Let Dialog's dismiss/pointer-events effects settle after opening.
      await page.waitForTimeout(150);
      await page.getByPlaceholder('name').tap({ force: true });
      await expect(page.getByPlaceholder('name')).not.toBeFocused();
      await shouldBeClosed(page);

      // finally, ensure that pointer-events have been reset and interactions restored
      await shouldAllowOutsideInteraction(page, 'realTouch');
    });

    test('keeps focus trapped even if focused element is removed', async ({ page }) => {
      await page.getByText('open', { exact: true }).click();
      await expect(page.getByText('close', { exact: true })).toBeFocused();
      await page.keyboard.press('Tab');
      await expect(page.getByText('destroy me', { exact: true })).toBeFocused();
      await page.keyboard.press('Space');
      await page.keyboard.press('Tab');
      await expect(page.getByText('close', { exact: true })).toBeFocused();
    });
  });

  test.describe('given a non-modal dialog', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByLabel('modal').click();
    });

    test('can be open/closed with a keyboard', async ({ page }) => {
      // using keyboard on open/close buttons
      await page.getByText('open', { exact: true }).focus();
      await page.keyboard.press('Space');
      await shouldBeOpen(page);
      await expect(page.getByText('close', { exact: true })).toBeFocused();
      await page.keyboard.press('Space');
      await shouldBeClosed(page);
      await expect(page.getByText('open', { exact: true })).toBeFocused();

      // using keyboard on open button and close with escape
      await page.keyboard.press('Space');
      await shouldBeOpen(page);
      await page.keyboard.press('Escape');
      await shouldBeClosed(page);
    });

    test('can be open/closed with a pointer', async ({ page }) => {
      // using pointer on open/close buttons
      await page.getByText('open', { exact: true }).click();
      await shouldBeOpen(page);
      await page.getByText('close', { exact: true }).click();
      await shouldBeClosed(page);
      await expect(page.getByText('open', { exact: true })).toBeFocused();

      // using mouse inside dialog, then on a button outside
      await page.getByText('open', { exact: true }).click();
      await shouldBeOpen(page);
      await page.getByText('title', { exact: true }).click();
      await shouldBeOpen(page);
      await shouldAllowOutsideInteraction(page, 'realClick');
      await shouldBeClosed(page);

      // using touch on a button outside
      await page.getByText('open', { exact: true }).click();
      await shouldBeOpen(page);
      await shouldAllowOutsideInteraction(page, 'realTouch');
      await shouldBeClosed(page);

      // using mouse on an input outside
      await page.getByText('open', { exact: true }).click();
      await shouldBeOpen(page);
      // Let Dialog's dismiss/pointer-events effects settle after opening.
      await page.waitForTimeout(150);
      await page.getByPlaceholder('name').click();
      await expect(page.getByPlaceholder('name')).toBeFocused();
      await shouldBeClosed(page);

      // using touch on an input outside
      await page.getByText('open', { exact: true }).click();
      await shouldBeOpen(page);
      // Let Dialog's dismiss/pointer-events effects settle after opening.
      await page.waitForTimeout(150);
      await page.getByPlaceholder('name').tap();
      await expect(page.getByPlaceholder('name')).toBeFocused();
      await shouldBeClosed(page);

      // turn on animation
      await page.getByLabel('animated').click();

      // using mouse on an input outside an animated dialog
      await page.getByText('open', { exact: true }).click();
      await shouldBeOpen(page);
      // Let Dialog's dismiss/pointer-events effects settle after opening.
      await page.waitForTimeout(150);
      await page.getByPlaceholder('name').click();
      await expect(page.getByPlaceholder('name')).toBeFocused();
      await shouldBeClosed(page);

      // finally, ensure that pointer-events have been reset and interactions restored
      await shouldAllowOutsideInteraction(page, 'realClick');

      // using touch on an input outside an animated dialog
      await page.getByText('open', { exact: true }).click();
      await shouldBeOpen(page);
      // Let Dialog's dismiss/pointer-events effects settle after opening.
      await page.waitForTimeout(150);
      await page.getByPlaceholder('name').tap();
      await expect(page.getByPlaceholder('name')).toBeFocused();
      await shouldBeClosed(page);

      // finally, ensure that pointer-events have been reset and interactions restored
      await shouldAllowOutsideInteraction(page, 'realTouch');
    });
  });
});

test.describe('Dialog extension overlay interactions', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'dialog--with-extension-overlay');
  });

  test('keeps the dialog open when interacting with a shadow tree inside the dialog', async ({
    page,
  }) => {
    await page.getByText('open', { exact: true }).click();
    await expect(page.getByTestId('dialog-state')).toHaveText('open');

    const shadowButton = page.locator('[data-testid="inside-shadow-host"] button');
    await expect(shadowButton).toHaveText('inside shadow suggestion');
    await shadowButton.click();

    await expect(page.getByTestId('dialog-state')).toHaveText('open');
  });

  test('keeps the dialog open when an outside overlay stops later mouse events', async ({
    page,
  }) => {
    await page.getByText('open', { exact: true }).click();
    await expect(page.getByTestId('dialog-state')).toHaveText('open');
    await page.getByText('Trigger overlay', { exact: true }).click();
    await expect(page.getByTestId('external-overlay')).toBeAttached();

    await page.getByTestId('external-overlay-button').click();

    await expect(page.getByTestId('dialog-state')).toHaveText('open');
  });
});
