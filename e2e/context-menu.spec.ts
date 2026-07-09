import { expect, test } from '@playwright/test';
import {
  keydown,
  longTouch,
  pointerExitLeftToRight,
  pointerExitRightToLeft,
  pointerOver,
  visitStory,
} from './helpers';

test.describe('ContextMenu', () => {
  test.describe('given submenu user', () => {
    test.beforeEach(async ({ page }) => {
      await visitStory(page, 'contextmenu--submenus');
      await page.getByText('Right Click Here', { exact: true }).click({ button: 'right' });
    });

    test.describe('when using pointer', () => {
      test('should close open submenus and reopen the root menu when right clicking trigger', async ({
        page,
      }) => {
        await pointerOver(page, 'Bookmarks →');
        await expect(page.getByText('Inbox', { exact: true })).toBeVisible();
        await page
          .getByText('Right Click Here', { exact: true })
          .click({ button: 'right', force: true });
        await expect(page.getByText('New Tab', { exact: true })).toBeVisible();
        await expect(page.getByText('Inbox', { exact: true })).toHaveCount(0);
      });

      test('should open the root menu with a long touch interaction', async ({ page }) => {
        await page.getByText('New Tab', { exact: true }).click();
        await expect(page.getByText('New Tab', { exact: true })).toHaveCount(0);

        await longTouch(page, 'Right Click Here');

        await expect(page.getByText('New Tab', { exact: true })).toBeVisible();
      });

      test('should close open submenus and reopen the root menu when long touching trigger', async ({
        page,
      }) => {
        await pointerOver(page, 'Bookmarks →');
        await expect(page.getByText('Inbox', { exact: true })).toBeVisible();
        await longTouch(page, 'Right Click Here');
        await expect(page.getByText('New Tab', { exact: true })).toBeVisible();
        await expect(page.getByText('Inbox', { exact: true })).toHaveCount(0);
      });

      test('should open submenu and not focus first item when moving pointer over trigger', async ({
        page,
      }) => {
        await pointerOver(page, 'Bookmarks →');
        await expect(page.getByText('Inbox', { exact: true })).not.toBeFocused();
      });

      test('should not close when moving pointer to submenu and back to parent trigger', async ({
        page,
      }) => {
        await pointerOver(page, 'Bookmarks →');
        await pointerOver(page, 'Inbox');
        await pointerOver(page, 'Bookmarks →');
        await expect(page.getByText('Inbox', { exact: true })).toBeVisible();
      });

      test.describe('at a narrow viewport', () => {
        test.use({ viewport: { width: 550, height: 768 } });

        test('should close submenu when moving pointer away but remain open when moving towards', async ({
          page,
        }) => {
          // Moving away
          await pointerOver(page, 'Bookmarks →');
          await expect(page.getByText('Inbox', { exact: true })).toBeVisible();
          await pointerExitRightToLeft(page, 'Bookmarks →');
          await expect(page.getByText('Inbox', { exact: true })).toHaveCount(0);

          // Moving towards
          await pointerOver(page, 'Bookmarks →');
          await expect(page.getByText('Inbox', { exact: true })).toBeVisible();
          await pointerExitLeftToRight(page, 'Bookmarks →');
          await expect(page.getByText('Inbox', { exact: true })).toBeVisible();

          // Test at collision edge
          // Moving away
          await pointerOver(page, 'WorkOS →');
          await expect(page.getByText('Radix', { exact: true })).toBeVisible();
          await pointerExitLeftToRight(page, 'WorkOS →');
          await expect(page.getByText('Radix', { exact: true })).toHaveCount(0);

          // Moving towards
          await pointerOver(page, 'WorkOS →');
          await expect(page.getByText('Radix', { exact: true })).toBeVisible();
          await pointerExitRightToLeft(page, 'WorkOS →');
          await expect(page.getByText('Radix', { exact: true })).toBeVisible();
        });
      });

      test('should close open submenu when moving pointer to any item in parent menu', async ({
        page,
      }) => {
        // Item
        await pointerOver(page, 'Bookmarks →');
        await pointerOver(page, 'Inbox');
        await pointerOver(page, 'New Tab');
        await expect(page.getByText('Inbox', { exact: true })).toHaveCount(0);

        // Disabled item
        await pointerOver(page, 'Bookmarks →');
        await pointerOver(page, 'Inbox');
        await pointerOver(page, 'Print…');
        await expect(page.getByText('Inbox', { exact: true })).toHaveCount(0);

        // Trigger item
        await pointerOver(page, 'Bookmarks →');
        await pointerOver(page, 'Inbox');
        await pointerOver(page, 'Tools →');
        await expect(page.getByText('Inbox', { exact: true })).toHaveCount(0);

        // Disabled trigger item
        await pointerOver(page, 'Bookmarks →');
        await pointerOver(page, 'Inbox');
        await pointerOver(page, 'History →');
        await expect(page.getByText('Inbox', { exact: true })).toHaveCount(0);
      });

      test('should close unassociated submenus when moving pointer back to the root trigger', async ({
        page,
      }) => {
        // Open multiple nested submenus and back to trigger in root menu
        await pointerOver(page, 'Bookmarks →');
        await pointerOver(page, 'WorkOS →');
        await pointerOver(page, 'Radix');
        await pointerOver(page, 'Bookmarks →');

        await expect(page.getByText('Inbox', { exact: true })).toBeVisible();
        await expect(page.getByText('Radix', { exact: true })).toHaveCount(0);
      });

      test('should close all menus when clicking item in any menu, or clicking outside', async ({
        page,
      }) => {
        // Root menu
        await page.getByText('New Tab', { exact: true }).click();
        await expect(page.getByText('New Tab', { exact: true })).toHaveCount(0);

        // Submenu
        await page.getByText('Right Click Here', { exact: true }).click({ button: 'right' });
        await pointerOver(page, 'Bookmarks →');
        await page.getByText('Inbox', { exact: true }).click();
        await expect(page.getByText('New Tab', { exact: true })).toHaveCount(0);
        await expect(page.getByText('Inbox', { exact: true })).toHaveCount(0);

        // Click outside
        await page.getByText('Right Click Here', { exact: true }).click({ button: 'right' });
        await page.locator('body').click({ force: true });
        await expect(page.getByText('New Tab', { exact: true })).toHaveCount(0);
      });
    });

    test.describe('When using keyboard', () => {
      test('should not open submenu when moving focus to trigger', async ({ page }) => {
        await page.getByText('Bookmarks →', { exact: true }).focus();
        await expect(page.getByText('Inbox', { exact: true })).toHaveCount(0);
      });

      test('should open submenu and focus first item when pressing right arrow, enter or space key', async ({
        page,
      }) => {
        async function shouldOpenOnKeydown(key: string) {
          await keydown(page.getByText('Bookmarks →', { exact: true }), key);
          const inbox = page.getByText('Inbox', { exact: true });
          await expect(inbox).toBeFocused();
          await keydown(inbox, 'ArrowLeft');
        }

        await shouldOpenOnKeydown(' ');
        await shouldOpenOnKeydown('Enter');
        await shouldOpenOnKeydown('ArrowRight');
      });

      test('should close only the focused submenu when pressing left arrow key', async ({
        page,
      }) => {
        await page.getByText('Bookmarks →', { exact: true }).press('Enter');
        await page.getByText('WorkOS →', { exact: true }).press('Enter');
        await page.getByText('Stitches', { exact: true }).press('ArrowLeft');
        await expect(page.getByText('Stitches', { exact: true })).toHaveCount(0);
        await expect(page.getByText('WorkOS →', { exact: true })).toBeVisible();
        await expect(page.getByText('New Window', { exact: true })).toBeVisible();
      });

      test('should focus first item when pressing right arrow key after opening submenu with mouse', async ({
        page,
      }) => {
        await pointerOver(page, 'Bookmarks →');
        await expect(page.getByText('Inbox', { exact: true })).toBeVisible();
        await page.getByText('Bookmarks →', { exact: true }).press('ArrowRight');
        await expect(page.getByText('Inbox', { exact: true })).toBeFocused();
      });

      test('should close all menus when pressing escape, enter or space key on any item', async ({
        page,
      }) => {
        // Test close on root menu
        await page.getByText('Bookmarks →', { exact: true }).press('Escape');
        await expect(page.getByText('Bookmarks →', { exact: true })).toHaveCount(0);

        // Reopen menu and test keys from within the submenu
        await page.getByText('Right Click Here', { exact: true }).click({ button: 'right' });
        await page.getByText('Bookmarks →', { exact: true }).press('Enter');
        await page.getByText('Inbox', { exact: true }).press('Escape');
        await expect(page.getByText('Inbox', { exact: true })).toHaveCount(0);
        await expect(page.getByText('New Window', { exact: true })).toHaveCount(0);
      });

      test('should scope typeahead behaviour to the active menu', async ({ page }) => {
        // Matching items outside of the active menu should not become focused
        await pointerOver(page, 'Bookmarks →');
        await pointerOver(page, 'WorkOS →');
        await page.getByText('Stitches', { exact: true }).focus();
        await page.getByText('Stitches', { exact: true }).pressSequentially('Inbox');
        await expect(page.getByText('Inbox', { exact: true })).not.toBeFocused();

        // Matching items inside of active menu should become focused
        const notion = await pointerOver(page, 'Notion');
        await notion.focus();
        await notion.pressSequentially('Inbox');
        await expect(page.getByText('Inbox', { exact: true })).toBeFocused();
      });
    });

    test.describe('When using pointer in RTL', () => {
      test.use({ viewport: { width: 550, height: 768 } });

      test.beforeEach(async ({ page }) => {
        // Close the menu opened by the parent beforeEach so the RTL toggle is
        // interactable (an open menu makes outside content pointer-events: none).
        await page.keyboard.press('Escape');
        await page.getByText('Right-to-left', { exact: true }).click();
        await page.getByText('Right Click Here', { exact: true }).click({ button: 'right' });
      });

      test('should close submenu when pointer moves away but remain open when moving towards', async ({
        page,
      }) => {
        // Moving away
        await pointerOver(page, 'Bookmarks →');
        await expect(page.getByText('Inbox', { exact: true })).toBeVisible();
        await pointerExitLeftToRight(page, 'Bookmarks →');
        await expect(page.getByText('Inbox', { exact: true })).toHaveCount(0);

        // Moving towards
        await pointerOver(page, 'Bookmarks →');
        await expect(page.getByText('Inbox', { exact: true })).toBeVisible();
        await pointerExitRightToLeft(page, 'Bookmarks →');
        await expect(page.getByText('Inbox', { exact: true })).toBeVisible();

        // Test at collision edge
        // Moving away
        await pointerOver(page, 'WorkOS →');
        await expect(page.getByText('Radix', { exact: true })).toBeVisible();
        await pointerExitRightToLeft(page, 'WorkOS →');
        await expect(page.getByText('Radix', { exact: true })).toHaveCount(0);

        // Moving towards
        await pointerOver(page, 'WorkOS →');
        await expect(page.getByText('Radix', { exact: true })).toBeVisible();
        await pointerExitLeftToRight(page, 'WorkOS →');
        await expect(page.getByText('Radix', { exact: true })).toBeVisible();
      });
    });

    test.describe('When using keyboard in RTL', () => {
      test.beforeEach(async ({ page }) => {
        // Close the menu opened by the parent beforeEach so the RTL toggle is
        // interactable (an open menu makes outside content pointer-events: none).
        await page.keyboard.press('Escape');
        await page.getByText('Right-to-left', { exact: true }).click();
        await page.getByText('Right Click Here', { exact: true }).click({ button: 'right' });
      });

      test('should open submenu and focus first item when pressing left arrow key but close when pressing right arrow key', async ({
        page,
      }) => {
        await keydown(page.getByText('Bookmarks →', { exact: true }), 'ArrowLeft');
        await expect(page.getByText('Inbox', { exact: true })).toBeFocused();
        await expect(page.getByText('Inbox', { exact: true })).toBeFocused();
        await keydown(page.getByText('Inbox', { exact: true }), 'ArrowRight');
        await expect(page.getByText('Inbox', { exact: true })).toHaveCount(0);

        // Root level menu should remain open
        await expect(page.getByText('New Tab', { exact: true })).toBeVisible();
      });
    });
  });
});

test.describe('ContextMenu extension overlay interactions', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'contextmenu--with-extension-overlay');
  });

  test('should close when an external overlay stops later mouse events', async ({ page }) => {
    await page.getByText('Trigger overlay', { exact: true }).click();
    await expect(page.getByTestId('external-overlay')).toBeAttached();
    await page.getByText('Right Click Here', { exact: true }).click({ button: 'right' });
    await expect(page.getByText('New Tab', { exact: true })).toBeVisible();

    await page.getByTestId('external-overlay-button').click();

    await expect(page.getByText('New Tab', { exact: true })).toHaveCount(0);
  });
});

test.describe('ContextMenu nested in Dialog', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'contextmenu--dismisses-only-context-menu-inside-dialog');
  });

  test('dismisses only the context menu when clicking inside dialog outside menu', async ({
    page,
  }) => {
    await page.getByText('Open dialog', { exact: true }).click();
    await page.getByText('Right click inside dialog', { exact: true }).click({ button: 'right' });

    await expect(page.getByText('Dialog with nested context menu', { exact: true })).toBeVisible();
    await expect(page.getByText('dialog: open | menu: open', { exact: true })).toBeVisible();

    await page.getByText('Dialog with nested context menu', { exact: true }).click({ force: true });

    await expect(page.getByText('Dialog with nested context menu', { exact: true })).toBeVisible();
    await expect(page.getByText('dialog: open | menu: closed', { exact: true })).toBeVisible();
    await expect(page.getByText('Item one', { exact: true })).toHaveCount(0);
  });
});
