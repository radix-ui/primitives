import { expect, test } from '@playwright/test';
import {
  keydown,
  pointerExitLeftToRight,
  pointerExitRightToLeft,
  pointerOver,
  visitStory,
} from './helpers';

test.describe('DropdownMenu', () => {
  test.describe('given submenu user', () => {
    test.beforeEach(async ({ page }) => {
      await visitStory(page, 'dropdownmenu--submenus');
      await page.getByText('Open', { exact: true }).click();
    });

    test.describe('when using pointer', () => {
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

        test('should select an item in a collision-flipped submenu after a single pointer move', async ({
          page,
        }) => {
          await page.getByText('Bookmarks →', { exact: true }).click();
          await page.getByText('WorkOS →', { exact: true }).click();

          const submenu = page.getByRole('menu').filter({ hasText: 'Radix' });
          await expect(submenu).toHaveAttribute('data-side', 'left');

          const consoleMessages: string[] = [];
          page.on('console', (message) => consoleMessages.push(message.text()));

          // `locator.click()` retries when its target detaches, which would
          // hide the submenu closing mid-gesture. Raw mouse input jumps to the
          // item in one move and clicks once.
          const radixBox = (await page.getByText('Radix', { exact: true }).boundingBox())!;
          expect(radixBox).not.toBeNull();

          await page.mouse.move(radixBox.x + radixBox.width / 2, radixBox.y + radixBox.height / 2);
          await page.mouse.down();
          await page.mouse.up();

          await expect.poll(() => consoleMessages).toContain('radix');
          await expect(page.getByText('New Tab', { exact: true })).toHaveCount(0);
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
        await page.getByText('Open', { exact: true }).click();
        await pointerOver(page, 'Bookmarks →');
        await page.getByText('Inbox', { exact: true }).click();
        await expect(page.getByText('New Tab', { exact: true })).toHaveCount(0);
        await expect(page.getByText('Inbox', { exact: true })).toHaveCount(0);

        // Click outside
        await page.getByText('Open', { exact: true }).click();
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
        await page.getByText('New Window', { exact: true }).press('Escape');
        await expect(page.getByText('New Window', { exact: true })).toHaveCount(0);

        // Reopen menu and test keys from within the submenu
        await page.getByText('Open', { exact: true }).click();
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
        await page.getByText('Open', { exact: true }).click();
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
        await page.getByText('Open', { exact: true }).click();
      });

      test('should open submenu and focus first item when pressing left arrow key but close when pressing right arrow key', async ({
        page,
      }) => {
        await keydown(page.getByText('Bookmarks →', { exact: true }), 'ArrowLeft');
        await expect(page.getByText('Inbox', { exact: true })).toBeFocused();
        await keydown(page.getByText('Inbox', { exact: true }), 'ArrowRight');
        await expect(page.getByText('Inbox', { exact: true })).toHaveCount(0);

        // Root level menu should remain open
        await expect(page.getByText('New Tab', { exact: true })).toBeVisible();
      });
    });
  });
});

test.describe('DropdownMenu extension overlay interactions', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'dropdownmenu--with-extension-overlay');
  });

  test('should close when an external overlay stops later mouse events', async ({ page }) => {
    await page.getByText('Trigger overlay', { exact: true }).click();
    await expect(page.getByTestId('external-overlay')).toBeAttached();
    await page.getByText('Open', { exact: true }).click();
    await expect(page.getByText('New Tab', { exact: true })).toBeVisible();

    await page.getByTestId('external-overlay-button').click();

    await expect(page.getByText('New Tab', { exact: true })).toHaveCount(0);
  });
});

test.describe('DropdownMenu nested in Dialog', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'dropdownmenu--dismisses-only-menu-inside-dialog');
  });

  test('dismisses only the menu when clicking inside dialog outside menu', async ({ page }) => {
    await page.getByText('Open dialog', { exact: true }).click();
    await page.getByText('Open menu', { exact: true }).click();

    await expect(page.getByText('Dialog with nested dropdown', { exact: true })).toBeVisible();
    await expect(page.getByText('dialog: open | menu: open', { exact: true })).toBeVisible();

    await page.getByText('Dialog with nested dropdown', { exact: true }).click({ force: true });

    await expect(page.getByText('Dialog with nested dropdown', { exact: true })).toBeVisible();
    await expect(page.getByText('dialog: open | menu: closed', { exact: true })).toBeVisible();
    await expect(page.getByText('Item one', { exact: true })).toHaveCount(0);
  });
});

test.describe('DropdownMenu on a touch screen (#4221)', () => {
  test.beforeEach(async ({ page }) => {
    await visitStory(page, 'dropdownmenu--styled');
  });

  test('opens on tap and closes on a tap on the trigger', async ({ page }) => {
    const trigger = page.locator('button[aria-haspopup="menu"]');
    await trigger.tap();
    await expect(page.getByRole('menuitem', { name: 'Undo' })).toBeVisible();

    // A finger on the trigger of the open menu: the press closes it, and the click that
    // follows must not open it again.
    const box = await trigger.boundingBox();
    if (!box) throw new Error('trigger not rendered');
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    await expect(page.getByRole('menuitem', { name: 'Undo' })).toHaveCount(0);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('does not open when a scroll starts on the trigger', async ({ page }) => {
    const trigger = page.locator('button[aria-haspopup="menu"]');
    // The story centres the trigger on a 200vh page, just below the fold.
    await trigger.scrollIntoViewIfNeeded();
    const scrollYBefore = await page.evaluate(() => window.scrollY);
    const box = await trigger.boundingBox();
    if (!box) throw new Error('trigger not rendered');
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;

    // A finger that lands on the trigger and drags up: the page scrolls, and the browser
    // sends pointercancel instead of a click.
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let step = 1; step <= 10; step++) {
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [{ x, y: y - step * 20 }],
      });
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('menuitem', { name: 'Undo' })).toHaveCount(0);
    // An open modal menu would also have locked the page, so it would not have scrolled.
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(scrollYBefore);
  });

  test('still opens on mouse press', async ({ page }) => {
    await page.getByRole('button', { name: 'Open' }).click();
    await expect(page.getByRole('menuitem', { name: 'Undo' })).toBeVisible();
  });
});
