import { expect, test, type Page } from '@playwright/test';
import { visitStoryById } from './helpers';

type ViewTransitionRecord = { firstAnimationFrame: string[] | null };

/**
 * Wraps `document.startViewTransition` so each transition records the item
 * text in the first frame after the animation starts. The browser renders the
 * live DOM as the "new" view while the animation runs, so this is what users
 * see for nearly the whole transition.
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
      const record: ViewTransitionRecord = { firstAnimationFrame: null };
      records.push(record);
      const transition = startViewTransition(options);
      transition.ready.then(
        () => {
          requestAnimationFrame(() => {
            record.firstAnimationFrame = Array.from(
              document.querySelectorAll('[data-fruit]'),
              (item) => item.textContent ?? '',
            );
          });
        },
        () => {},
      );
      return transition;
    }) as typeof document.startViewTransition;
  });
}

async function getFirstAnimationFrame(page: Page) {
  await expect
    .poll(async () => (await getViewTransitionRecords(page))[0]?.firstAnimationFrame ?? null)
    .not.toBeNull();
  const [record] = await getViewTransitionRecords(page);
  return record?.firstAnimationFrame;
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

    test('should show up-to-date positions from the first frame of a reorder animation', async ({
      page,
    }) => {
      await page.getByRole('button', { name: 'Reverse' }).click();
      expect(await getFirstAnimationFrame(page)).toEqual([
        'Cherry 1 of 3',
        'Banana 2 of 3',
        'Apple 3 of 3',
      ]);
      await expect(page.locator('[data-fruit]')).toHaveText([
        'Cherry 1 of 3',
        'Banana 2 of 3',
        'Apple 3 of 3',
      ]);
    });

    test('should show up-to-date positions from the first frame of a removal animation', async ({
      page,
    }) => {
      await page.getByRole('button', { name: 'Remove first' }).click();
      expect(await getFirstAnimationFrame(page)).toEqual(['Banana 1 of 2', 'Cherry 2 of 2']);
      await expect(page.locator('[data-fruit]')).toHaveText(['Banana 1 of 2', 'Cherry 2 of 2']);
    });
  });
});
