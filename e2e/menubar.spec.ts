import { expect, test, type Page } from '@playwright/test';
import { keydown, pointerOutAt, pointerOver, visitStory } from './helpers';

test.describe('Menubar', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'menubar--cypress');
  });

  test.describe('given a pointer user', () => {
    test('should open menu when pointer moves between triggers and not focus first item', async ({
      page,
    }) => {
      await pointerOver(page, 'File');
      await expect(page.getByText('New Tab', { exact: true })).toHaveCount(0);

      await page.getByText('File', { exact: true }).click();
      await expect(page.getByText('New Tab', { exact: true })).not.toBeFocused();

      await pointerOver(page, 'Edit');
      await expect(page.getByText('New Tab', { exact: true })).toHaveCount(0);
      await expect(page.getByText('Redo', { exact: true })).not.toBeFocused();

      await pointerOver(page, 'History');
      await expect(page.getByText('Redo', { exact: true })).toHaveCount(0);
      await expect(page.getByText('Radix', { exact: true })).not.toBeFocused();
    });

    test('should maintain the open state when pointer moves away from a trigger', async ({
      page,
    }) => {
      await page.getByText('File', { exact: true }).click();
      const file = await pointerOver(page, 'File');
      await pointerOutAt(file, 'bottomRight');
      await expect(page.getByText('New Tab', { exact: true })).toBeVisible();
    });

    test('should not close open submenu when moving pointer to submenu and back to parent trigger', async ({
      page,
    }) => {
      await page.getByText('Edit', { exact: true }).click();
      await pointerOver(page, 'Find →');
      await pointerOver(page, 'Find Next');
      await pointerOver(page, 'Find →');
      await expect(page.getByText('Find Next', { exact: true })).toBeVisible();
    });

    test('should close open submenu when moving pointer to any item in parent menu', async ({
      page,
    }) => {
      await page.getByText('Edit', { exact: true }).click();
      // Item
      await pointerOver(page, 'Find →');
      await pointerOver(page, 'Find Next');
      await pointerOver(page, 'Redo');
      await expect(page.getByText('Find Next', { exact: true })).toHaveCount(0);

      // Disabled item
      await pointerOver(page, 'Find →');
      await pointerOver(page, 'Find Next');
      await pointerOver(page, 'Redo');
      await expect(page.getByText('Find Next', { exact: true })).toHaveCount(0);

      // Trigger item
      await pointerOver(page, 'Find →');
      await pointerOver(page, 'Find Next');
      await pointerOver(page, 'Substitutions →');
      await expect(page.getByText('Find Next', { exact: true })).toHaveCount(0);

      // Disabled trigger item
      await pointerOver(page, 'Find →');
      await pointerOver(page, 'Find Next');
      await pointerOver(page, 'Speech →');
      await expect(page.getByText('Find Next', { exact: true })).toHaveCount(0);
    });

    test('should close unassociated submenus when moving pointer back to the root trigger', async ({
      page,
    }) => {
      await page.getByText('Edit', { exact: true }).click();
      // Open multiple nested submenus and back to trigger in root menu
      await pointerOver(page, 'Find →');
      await pointerOver(page, 'Advanced →');
      await pointerOver(page, 'Regex');
      await pointerOver(page, 'Find →');

      await expect(page.getByText('Find Next', { exact: true })).toBeVisible();
      await expect(page.getByText('Regex', { exact: true })).toHaveCount(0);
    });

    test('should close all menus when clicking item in any menu, or clicking outside', async ({
      page,
    }) => {
      await page.getByText('Edit', { exact: true }).click();

      // Root menu
      await page.getByText('Redo', { exact: true }).click();
      await expect(page.getByText('Redo', { exact: true })).toHaveCount(0);

      // Submenu
      await page.getByText('Edit', { exact: true }).click();
      await pointerOver(page, 'Find →');
      await page.getByText('Find Next', { exact: true }).click();
      await expect(page.getByText('Redo', { exact: true })).toHaveCount(0);
      await expect(page.getByText('Find Next', { exact: true })).toHaveCount(0);

      // Click outside
      await page.getByText('Edit', { exact: true }).click();
      await page.locator('body').click();
      await expect(page.getByText('Redo', { exact: true })).toHaveCount(0);
    });
  });

  test.describe('given a keyboard user', () => {
    async function shouldSupportArrowKeyNavigation(page: Page, dir: 'ltr' | 'rtl') {
      const nextKey = dir === 'ltr' ? 'ArrowRight' : 'ArrowLeft';
      const prevKey = dir === 'ltr' ? 'ArrowLeft' : 'ArrowRight';

      // Moving forwards with menu closed
      await keydown(page.getByText('File', { exact: true }), nextKey);
      await expect(page.getByText('Edit', { exact: true })).toBeFocused();
      await keydown(page.getByText('Edit', { exact: true }), nextKey);

      // Moving backwards with menu closed
      await expect(page.getByText('History', { exact: true })).toBeFocused();
      await keydown(page.getByText('History', { exact: true }), prevKey);
      await expect(page.getByText('Edit', { exact: true })).toBeFocused();
      await keydown(page.getByText('Edit', { exact: true }), prevKey);
      await expect(page.getByText('File', { exact: true })).toBeFocused();

      // End of list (should not loop). `File` is the first trigger, so pressing
      // towards the start must keep focus on it. (Radix moves roving focus in a
      // `setTimeout`, so asserting a *non-move* requires the boundary key here —
      // the original Cypress spec used `nextKey` and only passed because it
      // asserted focus before the async move fired.)
      await keydown(page.getByText('File', { exact: true }), prevKey);
      await expect(page.getByText('File', { exact: true })).toBeFocused();

      // Open menu
      await page.getByText('File', { exact: true }).click();

      // Moving forwards with menu open
      await keydown(page.getByText('New Tab', { exact: true }), nextKey);
      await expect(page.getByText('New Tab', { exact: true })).toHaveCount(0);

      // Moving backwards with menu open
      await keydown(page.getByText('Redo', { exact: true }), prevKey);
      await expect(page.getByText('Redo', { exact: true })).toHaveCount(0);

      // End of list (should not loop)
      await keydown(page.getByText('New Tab', { exact: true }), prevKey);
      await expect(page.getByText('New Tab', { exact: true })).toBeVisible();

      // Moving forwards at submenu edge
      await keydown(page.getByText('Share →', { exact: true }), nextKey);
      await keydown(page.getByText('Email Link', { exact: true }), nextKey);
      await expect(page.getByText('Redo', { exact: true })).toBeVisible();

      // Moving backwards at submenu edge
      await keydown(page.getByText('Find →', { exact: true }), nextKey);
      await keydown(page.getByText('Advanced →', { exact: true }), nextKey);
      await keydown(page.getByText('Regex', { exact: true }), prevKey);
      await keydown(page.getByText('Advanced →', { exact: true }), prevKey);
      await keydown(page.getByText('Find →', { exact: true }), prevKey);
      await expect(page.getByText('New Tab', { exact: true })).toBeVisible();

      // Looping
      await page.getByText('Loop', { exact: true }).click();
      await keydown(page.getByText('File', { exact: true }), prevKey);
      await expect(page.getByText('History', { exact: true })).toBeFocused();
      await keydown(page.getByText('History', { exact: true }), nextKey);
      await expect(page.getByText('File', { exact: true })).toBeFocused();

      // Looping menu open
      await page.getByText('File', { exact: true }).click();
      await keydown(page.getByText('New Tab', { exact: true }), prevKey);
      await keydown(page.getByText('Radix', { exact: true }), nextKey);
      await expect(page.getByText('New Tab', { exact: true })).toBeVisible();
    }

    test('should move to next menu using right arrow and previous menu with left arrow', async ({
      page,
    }) => {
      await shouldSupportArrowKeyNavigation(page, 'ltr');
    });

    test('should not open submenu when moving focus to sub trigger', async ({ page }) => {
      await page.getByText('Edit', { exact: true }).click();
      await page.getByText('Find →', { exact: true }).focus();
      await expect(page.getByText('Find Next', { exact: true })).toHaveCount(0);
    });

    test('should not open submenu when moving focus to sub trigger (again)', async ({ page }) => {
      await page.getByText('Edit', { exact: true }).click();
      await page.getByText('Find →', { exact: true }).focus();
      await expect(page.getByText('Find Next', { exact: true })).toHaveCount(0);
    });

    test('should open submenu and focus first item when pressing right arrow, enter or space key', async ({
      page,
    }) => {
      await page.getByText('Edit', { exact: true }).click();

      async function shouldOpenOnKeydown(key: string) {
        await keydown(page.getByText('Find →', { exact: true }), key);
        const searchTheWeb = page.getByText('Search the web…', { exact: true });
        await expect(searchTheWeb).toBeFocused();
        await keydown(searchTheWeb, 'ArrowLeft');
      }

      await shouldOpenOnKeydown(' ');
      await shouldOpenOnKeydown('Enter');
      await shouldOpenOnKeydown('ArrowRight');
    });

    test('should close only the focused submenu when pressing left arrow key', async ({ page }) => {
      await page.getByText('Edit', { exact: true }).click();

      await page.getByText('Find →', { exact: true }).press('Enter');
      await page.getByText('Advanced →', { exact: true }).press('Enter');
      await page.getByText('Regex', { exact: true }).press('ArrowLeft');
      await expect(page.getByText('Regex', { exact: true })).toHaveCount(0);
      await expect(page.getByText('Advanced →', { exact: true })).toBeVisible();
      await expect(page.getByText('Redo', { exact: true })).toBeVisible();
    });

    test('should focus first item when pressing right arrow key after opening submenu with pointer', async ({
      page,
    }) => {
      await page.getByText('Edit', { exact: true }).click();

      await pointerOver(page, 'Find →');
      await expect(page.getByText('Find Next', { exact: true })).toBeVisible();
      await page.getByText('Find →', { exact: true }).press('ArrowRight');
      await expect(page.getByText('Search the web…', { exact: true })).toBeFocused();
    });

    test('should close all menus when pressing escape, enter or space key on any item', async ({
      page,
    }) => {
      await page.getByText('Edit', { exact: true }).click();

      // Test close on root menu
      await page.getByText('Redo', { exact: true }).press('Escape');
      await expect(page.getByText('Redo', { exact: true })).toHaveCount(0);

      // Reopen menu and test keys from within the submenu
      await page.getByText('Edit', { exact: true }).click();
      await page.getByText('Find →', { exact: true }).press('Enter');
      await page.getByText('Search the web…', { exact: true }).press('Escape');
      await expect(page.getByText('Search the web…', { exact: true })).toHaveCount(0);
      await expect(page.getByText('Redo', { exact: true })).toHaveCount(0);
    });

    test('should scope typeahead behaviour to the active menu', async ({ page }) => {
      await page.getByText('Edit', { exact: true }).click();

      // Matching items outside of the active menu should not become focused
      await pointerOver(page, 'Find →');
      await pointerOver(page, 'Advanced →');
      await page.getByText('Regex', { exact: true }).focus();
      await page.getByText('Regex', { exact: true }).pressSequentially('Find');
      await expect(page.getByText('Find →', { exact: true })).not.toBeFocused();

      // Matching items inside of active menu should become focused
      const advanced = await pointerOver(page, 'Advanced →');
      await advanced.focus();
      await advanced.pressSequentially('Find Next');
      await expect(page.getByText('Find Next', { exact: true })).toBeFocused();
    });

    test.describe('with portals enabled', () => {
      test('should move to next menu using right arrow and previous menu with left arrow', async ({
        page,
      }) => {
        await shouldSupportArrowKeyNavigation(page, 'ltr');
      });
    });

    test.describe('with RTL enabled', () => {
      test.beforeEach(async ({ page }) => {
        await page.getByText('Right-to-left', { exact: true }).click();
      });

      test('should move to next menu using right arrow and previous menu with left arrow', async ({
        page,
      }) => {
        await shouldSupportArrowKeyNavigation(page, 'rtl');
      });

      test('should open submenu and focus first item when pressing left arrow key but close when pressing right arrow key', async ({
        page,
      }) => {
        await page.getByText('Edit', { exact: true }).click();
        await keydown(page.getByText('Find →', { exact: true }), 'ArrowLeft');
        await expect(page.getByText('Search the web…', { exact: true })).toBeFocused();
        await keydown(page.getByText('Search the web…', { exact: true }), 'ArrowRight');
        await expect(page.getByText('Search the web…', { exact: true })).toHaveCount(0);

        // Root level menu should remain open
        await expect(page.getByText('Redo', { exact: true })).toBeVisible();
      });
    });
  });
});

test.describe('Menubar extension overlay interactions', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'menubar--with-extension-overlay');
  });

  test('should close when an external overlay stops later mouse events', async ({ page }) => {
    await page.getByText('Trigger overlay', { exact: true }).click();
    await expect(page.getByTestId('external-overlay')).toBeAttached();
    await page.getByText('Edit', { exact: true }).click();
    await expect(page.getByText('Redo', { exact: true })).toBeVisible();

    await page.getByTestId('external-overlay-button').click();

    await expect(page.getByText('Redo', { exact: true })).toHaveCount(0);
  });
});
