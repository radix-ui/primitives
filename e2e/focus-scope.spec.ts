import { expect, test } from '@playwright/test';
import { visitStory } from './helpers';

// Regression test for https://github.com/radix-ui/primitives/issues/4261
test('a dialog in an unfocused iframe defers recovery after its popover unmounts', async ({
  page,
}) => {
  await visitStory(page, 'dialog--in-iframe');
  const dialogFrame = page.frameLocator('iframe[title="Dialog pane"]');
  const otherInput = page.frameLocator('iframe[title="Other pane"]').getByLabel('Other input');
  const dialog = dialogFrame.getByRole('dialog');
  const popoverInput = dialogFrame.getByLabel('Popover input');

  await dialogFrame.getByRole('button', { name: 'Open popover' }).click();
  await expect(popoverInput).toBeFocused();
  await otherInput.click();
  // Wait for Presence to remove the focused input after the exit animation.
  await expect(popoverInput).toHaveCount(0);
  await expect(page.locator('iframe[title="Other pane"]')).toBeFocused();
  await expect(otherInput).toBeFocused();
  await expect.poll(() => dialog.evaluate((node) => node.ownerDocument.hasFocus())).toBe(false);

  // Refocus the browsing context without selecting a control in it.
  await dialog.evaluate((node) => node.ownerDocument.defaultView!.focus());
  await expect(dialog).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialogFrame.getByRole('button', { name: 'Open popover' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialogFrame.getByLabel('Dialog input')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialogFrame.getByRole('button', { name: 'Close dialog' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(dialogFrame.getByRole('button', { name: 'Open popover' })).toBeFocused();
});
