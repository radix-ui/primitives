import { expect, test, type Page } from '@playwright/test';
import { visitStoryById } from './helpers';

type ViewTransitionRecord = { snapshot: string[] | null };

/**
 * Wraps `document.startViewTransition` so each transition records the item
 * text at the moment the browser captures the "after" snapshot, which happens
 * once the update callback settles.
 */
async function recordViewTransitions(page: Page) {
  await page.addInitScript(() => {
    const records: ViewTransitionRecord[] = [];
    Object.assign(window, { __viewTransitionRecords: records });
    const startViewTransition = document.startViewTransition?.bind(document);
    if (!startViewTransition) {
      return;
    }
    document.startViewTransition = ((options: any) => {
      const update = typeof options === 'function' ? options : options?.update;
      const record: ViewTransitionRecord = { snapshot: null };
      records.push(record);
      const recordingUpdate = async () => {
        await update?.();
        record.snapshot = Array.from(
          document.querySelectorAll('[data-fruit]'),
          (item) => item.textContent ?? '',
        );
      };
      return startViewTransition(
        typeof options === 'function' ? recordingUpdate : { ...options, update: recordingUpdate },
      );
    }) as typeof document.startViewTransition;
  });
}

function getViewTransitionRecords(page: Page) {
  return page.evaluate(
    () =>
      (window as unknown as { __viewTransitionRecords: ViewTransitionRecord[] })
        .__viewTransitionRecords,
  );
}

test.describe('Collection', () => {
  test.describe('given items wrapped in ViewTransition', () => {
    test.beforeEach(async ({ page }) => {
      await recordViewTransitions(page);
      await visitStoryById(page, 'utilities-collection--view-transition-reorder');
      await expect(page.locator('[data-fruit]')).toHaveText([
        'Apple 1 of 3',
        'Banana 2 of 3',
        'Cherry 3 of 3',
      ]);
    });

    test('should animate a reorder and settle on up-to-date positions', async ({ page }) => {
      await page.getByRole('button', { name: 'Reverse' }).click();
      await expect.poll(async () => (await getViewTransitionRecords(page)).length).toBe(1);
      await expect(page.locator('[data-fruit]')).toHaveText([
        'Cherry 1 of 3',
        'Banana 2 of 3',
        'Apple 3 of 3',
      ]);
    });

    test('should animate a removal and settle on up-to-date positions', async ({ page }) => {
      await page.getByRole('button', { name: 'Remove first' }).click();
      await expect.poll(async () => (await getViewTransitionRecords(page)).length).toBe(1);
      await expect(page.locator('[data-fruit]')).toHaveText(['Banana 1 of 2', 'Cherry 2 of 2']);
    });

    // Known limitation: items register and re-sort in effects and a
    // MutationObserver, which update the collection in a commit after the
    // animated one. UI derived from the collection is stale in the view
    // transition's "after" snapshot and only updates once the animation runs.
    test.fail(
      'should include up-to-date positions in the view transition snapshot',
      async ({ page }) => {
        await page.getByRole('button', { name: 'Reverse' }).click();
        await expect
          .poll(async () => (await getViewTransitionRecords(page))[0]?.snapshot ?? null, {
            timeout: 5_000,
          })
          .not.toBeNull();
        const [record] = await getViewTransitionRecords(page);
        expect(record?.snapshot).toEqual(['Cherry 1 of 3', 'Banana 2 of 3', 'Apple 3 of 3']);
      },
    );
  });
});
