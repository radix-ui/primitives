import { expect, test, type Page } from '@playwright/test';
import { visitStoryById } from './helpers';

// `Popper` stories live under the `Utilities/*` namespace, so they can't be
// reached through the `components-` prefixed `visitStory` helper.
function visitPopperStory(page: Page, storyName: string) {
  return visitStoryById(page, `utilities-popper--${storyName}`);
}

test.describe('Popper', () => {
  test.describe('transform origin after collision shifting', () => {
    for (const side of ['top', 'right', 'bottom', 'left'] as const) {
      for (const align of ['start', 'center', 'end'] as const) {
        test(`keeps the origin attached to the anchor for ${side}-${align} without an arrow`, async ({
          page,
        }) => {
          await visitPopperStory(page, 'transform-origin');
          await page.getByRole('combobox', { name: 'Side', exact: true }).selectOption(side);
          await page.getByRole('combobox', { name: 'Align', exact: true }).selectOption(align);
          const vertical = side === 'top' || side === 'bottom';
          const viewport = page.viewportSize()!;
          await page.getByTestId('anchor').evaluate(
            (element, { vertical, align, viewport }) => {
              element.style.left = `${vertical ? (align === 'end' ? 10 : viewport.width - 40) : 400}px`;
              element.style.top = `${vertical ? 300 : align === 'end' ? 10 : viewport.height - 40}px`;
            },
            { vertical, align, viewport },
          );

          const content = page.getByTestId('content');
          await expect(content).toHaveAttribute('data-side', side);
          await expect(content).toHaveAttribute('data-align', align);
          await expect
            .poll(async () => {
              const anchor = await page.getByTestId('anchor').boundingBox();
              return content.evaluate(
                (element, { anchor, vertical, align }) => {
                  const rect = element.getBoundingClientRect();
                  const origin = getComputedStyle(element)
                    .transformOrigin.split(' ')
                    .map(parseFloat);
                  const fraction = { start: 0, center: 0.5, end: 1 }[align];
                  return Math.abs(
                    vertical
                      ? rect.left + origin[0]! - (anchor!.x + anchor!.width * fraction)
                      : rect.top + origin[1]! - (anchor!.y + anchor!.height * fraction),
                  );
                },
                { anchor, vertical, align },
              );
            })
            .toBeLessThan(1);
        });
      }

      test(`preserves the arrow-tip origin for ${side} after shifting`, async ({ page }) => {
        await visitPopperStory(page, 'transform-origin');
        await page.getByRole('combobox', { name: 'Side', exact: true }).selectOption(side);
        await page.getByRole('checkbox', { name: 'Arrow', exact: true }).check();
        const vertical = side === 'top' || side === 'bottom';
        const viewport = page.viewportSize()!;
        await page.getByTestId('anchor').evaluate(
          (element, { vertical, viewport }) => {
            element.style.left = `${vertical ? viewport.width - 40 : 400}px`;
            element.style.top = `${vertical ? 300 : viewport.height - 40}px`;
          },
          { vertical, viewport },
        );
        const content = page.getByTestId('content');
        await expect(content).toHaveAttribute('data-side', side);
        await expect
          .poll(() =>
            content.evaluate((element) => {
              const contentRect = element.getBoundingClientRect();
              const arrowRect = element.querySelector('svg')!.getBoundingClientRect();
              const [originX, originY] = getComputedStyle(element)
                .transformOrigin.split(' ')
                .map(parseFloat);
              const side = element.dataset.side;
              const tipX =
                side === 'right'
                  ? arrowRect.left
                  : side === 'left'
                    ? arrowRect.right
                    : arrowRect.left + arrowRect.width / 2;
              const tipY =
                side === 'bottom'
                  ? arrowRect.top
                  : side === 'top'
                    ? arrowRect.bottom
                    : arrowRect.top + arrowRect.height / 2;
              return Math.max(
                Math.abs(contentRect.left + originX! - tipX),
                Math.abs(contentRect.top + originY! - tipY),
              );
            }),
          )
          .toBeLessThan(1);
      });
    }

    test('preserves the fallback origin when an arrow cannot be centered', async ({ page }) => {
      await visitPopperStory(page, 'transform-origin');
      await page.getByRole('checkbox', { name: 'Arrow', exact: true }).check();
      await page.getByTestId('anchor').evaluate((element) => {
        element.style.top = `${window.innerHeight - 40}px`;
      });
      await page.getByRole('spinbutton', { name: 'Arrow padding' }).fill('80');
      await expect(page.getByTestId('arrow')).toHaveCSS('visibility', 'hidden');
      await expect(page.getByTestId('content')).toHaveCSS('transform-origin', '0px 0px');
    });

    test('updates the origin on resize and scroll, and preserves the unshifted value', async ({
      page,
    }) => {
      await visitPopperStory(page, 'transform-origin');
      const content = page.getByTestId('content');
      await expect(content).toHaveCSS('transform-origin', '0px 0px');
      await page.setViewportSize({ width: 1024, height: 500 });
      await expect
        .poll(() =>
          content.evaluate((element) => {
            const originY = parseFloat(getComputedStyle(element).transformOrigin.split(' ')[1]!);
            return element.getBoundingClientRect().top + originY;
          }),
        )
        .toBeCloseTo(375, 0);
      await page.evaluate(() => window.scrollTo(0, 200));
      await expect(content).toHaveCSS('transform-origin', '0px 0px');
    });
  });

  // Regression test for https://github.com/radix-ui/primitives/pull/3237
  test.describe('given hideWhenDetached and no explicit collisionBoundary', () => {
    test.beforeEach(async ({ page }) => {
      await visitPopperStory(page, 'hide-when-detached-in-scroll-container');
    });

    test('hides the content when the anchor is clipped by its scroll container but still within the viewport', async ({
      page,
    }) => {
      await expect(page.getByTestId('content')).toBeVisible();

      // Scroll the anchor out of the (200px tall) scroll container while keeping
      // it on screen. Detach detection must fall back to clipping ancestors, not
      // the viewport, otherwise the content would incorrectly stay visible.
      await page.getByTestId('scroll-container').evaluate((el) => el.scrollTo(0, 200));

      await expect(page.getByTestId('content')).not.toBeVisible();
    });
  });

  // Regression test for the 1.3.0 custom-portal regression.
  test.describe('given content in a transformed, overflow-clipping custom portal host', () => {
    test.beforeEach(async ({ page }) => {
      await visitPopperStory(page, 'available-size-with-custom-portal');
    });

    test('measures available size against the viewport, not the portal host', async ({ page }) => {
      // The portal host is only 120px tall. If the collision/size middlewares
      // clamped to it (the regression), available height would be <= ~120px.
      const wrapper = page.locator('[data-radix-popper-content-wrapper]');
      await expect
        .poll(async () =>
          wrapper.evaluate((el) =>
            parseFloat(getComputedStyle(el).getPropertyValue('--radix-popper-available-height')),
          ),
        )
        .toBeGreaterThan(300);
    });
  });
});
