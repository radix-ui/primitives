import { expect, test } from '@playwright/test';
import { visitStory } from './helpers';

test.describe('RadioGroup', () => {
  test('quick arrow presses select the focused radio and wrap around', async ({ page }) => {
    await visitStory(page, 'radiogroup--parts');
    const radios = page.getByRole('radio');
    await radios.nth(0).click();

    await page.keyboard.press('ArrowDown');
    await expect(radios.nth(1)).toBeFocused();
    await expect(radios.nth(1)).toBeChecked();

    await page.keyboard.press('ArrowRight');
    await expect(radios.nth(2)).toBeFocused();
    await expect(radios.nth(2)).toBeChecked();

    await page.keyboard.press('ArrowDown');
    await expect(radios.nth(0)).toBeFocused();
    await expect(radios.nth(0)).toBeChecked();

    await page.keyboard.press('ArrowLeft');
    await expect(radios.nth(2)).toBeFocused();
    await expect(radios.nth(2)).toBeChecked();

    await page.keyboard.press('ArrowUp');
    await expect(radios.nth(1)).toBeFocused();
    await expect(radios.nth(1)).toBeChecked();
  });

  test('ordinary focus leaves selection alone and Space selects the focused radio', async ({
    page,
  }) => {
    await visitStory(page, 'radiogroup--parts');
    const radios = page.getByRole('radio');
    await radios.nth(1).focus();
    await expect(radios.nth(0)).toBeChecked();
    await expect(radios.nth(1)).not.toBeChecked();

    await page.keyboard.press('Space');
    await expect(radios.nth(1)).toBeChecked();
  });

  test('arrow navigation skips a disabled radio', async ({ page }) => {
    await visitStory(page, 'radiogroup--legacy-unset');
    const radios = page.getByRole('radio');
    await expect(radios.nth(1)).toBeDisabled();
    await radios.nth(0).click();

    await page.keyboard.press('ArrowDown');
    await expect(radios.nth(2)).toBeFocused();
    await expect(radios.nth(2)).toBeChecked();
    await expect(radios.nth(1)).not.toBeChecked();
  });
});
