import { expect, test } from '@playwright/test';
import { touchSwipe, visitStoryById } from './helpers';

test.describe('RemoveScroll', () => {
  test.describe('scroll isolation', () => {
    test.beforeEach(async ({ page }) => {
      await visitStoryById(page, 'lock--scroll-isolation');
      // The lock engages on mount.
      await expect
        .poll(() => page.evaluate(() => document.body.hasAttribute('data-scroll-locked')))
        .toBe(true);
    });

    test('scrolls the inner region but never the outer container while locked', async ({
      page,
    }) => {
      const inner = page.getByTestId('inner');
      const outer = page.getByTestId('outer');

      await inner.hover();
      // Wheel far more than the inner can absorb; the overflow must NOT chain to `outer`.
      await page.mouse.wheel(0, 2000);

      // Inner scrolled to (or near) its max...
      await expect.poll(() => inner.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
      // ...but the outer container never moved.
      expect(await outer.evaluate((el) => el.scrollTop)).toBe(0);
    });

    test('allows the outer container to scroll once the lock is disabled', async ({ page }) => {
      const outer = page.getByTestId('outer');

      // While locked, wheeling over the outer area outside the lock is blocked (isolation).
      const box = (await outer.boundingBox())!;
      const overOuterBackground = { x: box.x + box.width / 2, y: box.y + box.height - 5 };
      await page.mouse.move(overOuterBackground.x, overOuterBackground.y);
      await page.mouse.wheel(0, 500);
      expect(await outer.evaluate((el) => el.scrollTop)).toBe(0);

      // Disabling the lock restores normal scrolling of the outer container.
      await page.getByTestId('toggle').click();
      await expect
        .poll(() => page.evaluate(() => document.body.hasAttribute('data-scroll-locked')))
        .toBe(false);
      await page.mouse.move(overOuterBackground.x, overOuterBackground.y);
      await page.mouse.wheel(0, 500);
      await expect.poll(() => outer.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    });
  });

  // Regression: https://github.com/theKashey/react-remove-scroll/issues/74
  test.describe('textarea', () => {
    test('allows a textarea inside the lock to scroll its own content', async ({ page }) => {
      await visitStoryById(page, 'lock--text-area-overflow');
      const textarea = page.locator('textarea');
      await textarea.hover();
      await page.mouse.wheel(0, 300);
      await expect.poll(() => textarea.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    });
  });

  // Regression: https://github.com/radix-ui/primitives/issues/3423
  test.describe('shards', () => {
    test.beforeEach(async ({ page }) => {
      await visitStoryById(page, 'lock--shard-scroll');
      await expect
        .poll(() => page.evaluate(() => document.body.hasAttribute('data-scroll-locked')))
        .toBe(true);
    });

    test('keeps a shard (registered outside the lock) scrollable while locked', async ({
      page,
    }) => {
      const shard = page.getByTestId('shard');
      await shard.hover();
      await page.mouse.wheel(0, 400);
      await expect.poll(() => shard.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    });

    test('still blocks scrolling of unrelated background while locked', async ({ page }) => {
      const outer = page.getByTestId('outer');
      const box = (await outer.boundingBox())!;
      await page.mouse.move(box.x + box.width / 2, box.y + box.height - 5);
      await page.mouse.wheel(0, 500);
      expect(await outer.evaluate((el) => el.scrollTop)).toBe(0);
    });
  });

  test.describe('touch', () => {
    test('touch-swipe over the locked region scrolls the inner region only', async ({ page }) => {
      await visitStoryById(page, 'lock--scroll-isolation');
      await expect
        .poll(() => page.evaluate(() => document.body.hasAttribute('data-scroll-locked')))
        .toBe(true);
      const inner = page.getByTestId('inner');
      const outer = page.getByTestId('outer');
      await touchSwipe(page, inner, 'toTop', 200);
      await expect.poll(() => inner.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
      expect(await outer.evaluate((el) => el.scrollTop)).toBe(0);
    });
  });

  test.describe('inert', () => {
    test.beforeEach(async ({ page }) => {
      await visitStoryById(page, 'lock--inert-lock');
    });

    test('blocks pointer interaction outside the lock but allows the lock and its shards', async ({
      page,
    }) => {
      // Clicking outside the inert lock is blocked (pointer-events: none via block-interactivity).
      await page.getByTestId('outside').click({ force: true });
      await expect(page.getByTestId('outside-count')).toHaveText('0');

      // The lock content and registered shards remain interactive (allow-interactivity).
      await page.getByTestId('inside').click();
      await expect(page.getByTestId('inside-count')).toHaveText('1');
      await page.getByTestId('shard').click();
      await expect(page.getByTestId('shard-count')).toHaveText('1');
    });
  });

  // Still deferred: reliably synthesizing a pinch-zoom gesture, and asserting lock stacking, need
  // dedicated harnesses. Kept as `fixme` so they are tracked.
  test.describe('deferred coverage', () => {
    test.fixme('allows pinch-zoom gestures when allowPinchZoom is set', async () => {});
    test.fixme('only the topmost of stacked locks governs document scroll', async () => {});
  });
});
