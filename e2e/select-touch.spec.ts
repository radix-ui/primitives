import { writeFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { touchSwipe, visitStory } from './helpers';

test.afterEach(async ({ page }, testInfo) => {
  if (page.isClosed()) {
    return;
  }
  const trace = await page.evaluate(
    () => (window as unknown as { selectTouchTrace: unknown[] }).selectTouchTrace,
  );
  if (!trace) return;
  const path = testInfo.outputPath('events.json');
  await writeFile(path, JSON.stringify(trace, null, 2));
  await testInfo.attach('event-trace', { path, contentType: 'application/json' });
});

for (const variant of ['plain', 'container', 'auto', 'portal-sheet']) {
  test(`touch hit testing: ${variant}`, async ({ page }) => {
    await visitStory(page, 'select--trigger-touch-hit-testing');
    await page.evaluate(() => {
      const trace: unknown[] = [];
      Object.assign(window, { selectTouchTrace: trace });
      for (const type of ['pointerdown', 'pointerup', 'pointercancel', 'click']) {
        document.addEventListener(
          type,
          (event) => {
            const pointer = event as PointerEvent;
            const target = event.target as Element;
            const ancestors: unknown[] = [];
            for (let element: Element | null = target; element; element = element.parentElement) {
              ancestors.push({
                tag: element.tagName,
                testId: element.getAttribute('data-testid'),
                pointerEvents: getComputedStyle(element).pointerEvents,
              });
            }
            trace.push({
              type,
              pointerType: pointer.pointerType,
              pointerId: pointer.pointerId,
              detail: pointer.detail,
              trusted: event.isTrusted,
              time: performance.now(),
              bodyPointerEvents: getComputedStyle(document.body).pointerEvents,
              ancestors,
            });
          },
          true,
        );
      }
    });
    const trigger = page.getByTestId(`touch-trigger-${variant}`);
    const icon = page.getByTestId(`touch-icon-${variant}`);
    await icon.tap();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByRole('listbox')).toBeVisible();
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    // Coordinate input intentionally allows body hit testing to decide the target.
    // locator.tap() would wait for pointer-events:none to stop intercepting the trigger.
    const box = await icon.boundingBox();
    if (!box) throw new Error('Missing trigger icon');
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false', { timeout: 1000 });
    await expect(trigger).toHaveAttribute('data-open-changes', 'true,false');
    // With inherited pointer-events:none, the closing click targets HTML rather than the trigger.
    await expect(trigger).toHaveAttribute(
      'data-consumer-clicks',
      variant === 'auto' || variant === 'portal-sheet' ? '2' : '1',
    );
    // A fresh gesture must reopen even when the browser reuses pointer IDs.
    await icon.tap();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  test(`touch scroll cancellation: ${variant}`, async ({ page }) => {
    await visitStory(page, 'select--trigger-touch-scroll');
    await page.evaluate(() => {
      const trace: unknown[] = [];
      Object.assign(window, { selectTouchTrace: trace });
      for (const type of ['pointerdown', 'pointermove', 'pointercancel', 'pointerup', 'click']) {
        document.addEventListener(
          type,
          (event) => {
            const pointer = event as PointerEvent;
            trace.push({
              type,
              pointerId: pointer.pointerId,
              pointerType: pointer.pointerType,
              trusted: event.isTrusted,
              target: (event.target as Element).tagName,
            });
          },
          true,
        );
      }
    });
    const trigger = page.getByTestId(`touch-trigger-scroll-${variant}`);
    const icon = page.getByTestId(`touch-icon-scroll-${variant}`);
    const viewport = page.getByTestId(`touch-viewport-scroll-${variant}`);
    await icon.tap();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(viewport).toBeVisible();
    await viewport.evaluate((element) => {
      element.setAttribute('data-scroll-ended', 'false');
      element.addEventListener(
        'scrollend',
        () => element.setAttribute('data-scroll-ended', 'true'),
        { once: true },
      );
    });
    await touchSwipe(page, viewport, 'toTop', 80);
    await expect.poll(() => viewport.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    await expect
      .poll(() =>
        page.evaluate(() =>
          (
            window as unknown as { selectTouchTrace: { type: string; trusted: boolean }[] }
          ).selectTouchTrace.some((event) => event.type === 'pointercancel' && event.trusted),
        ),
      )
      .toBe(true);
    // A tap during a fling may only stop scrolling and produce no click at all.
    await expect(viewport).toHaveAttribute('data-scroll-ended', 'true');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const box = await icon.boundingBox();
    if (!box) throw new Error('Missing trigger icon');
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    await expect(trigger).toHaveAttribute('aria-expanded', 'false', { timeout: 1000 });
    await expect(trigger).toHaveAttribute('data-open-changes', 'true,false', { timeout: 1000 });
    await expect(trigger).toHaveAttribute(
      'data-consumer-clicks',
      variant === 'auto' || variant === 'portal-sheet' ? '2' : '1',
    );
    await icon.tap();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
}
