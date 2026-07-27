import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Navigate to a Storybook story's isolated iframe preview.
 *
 * Mirrors the old `cy.visitStory(...)` custom command: story ids under the
 * `Components/*` namespace are prefixed with `components-`.
 */
export async function visitStory(page: Page, storyName: string): Promise<void> {
  await page.goto(`/iframe.html?id=components-${storyName}`);
}

/**
 * Navigate to any Storybook story by its fully-qualified id (e.g.
 * `utilities-popper--...`).
 */
export async function visitStoryById(page: Page, storyId: string): Promise<void> {
  await page.goto(`/iframe.html?id=${storyId}`);
}

type Position =
  | 'topLeft'
  | 'top'
  | 'topRight'
  | 'left'
  | 'center'
  | 'right'
  | 'bottomLeft'
  | 'bottom'
  | 'bottomRight';

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Convert a named position (matching `cypress-real-events` semantics) into a
 * pixel offset relative to the element's top-left corner. Edges are inset by a
 * pixel so Playwright accepts them as being inside the element.
 */
function offsetFor(box: Box, position: Position): { x: number; y: number } {
  const maxX = Math.max(0, box.width - 1);
  const maxY = Math.max(0, box.height - 1);
  const midX = box.width / 2;
  const midY = box.height / 2;
  switch (position) {
    case 'topLeft':
      return { x: 1, y: 1 };
    case 'top':
      return { x: midX, y: 1 };
    case 'topRight':
      return { x: maxX, y: 1 };
    case 'left':
      return { x: 1, y: midY };
    case 'center':
      return { x: midX, y: midY };
    case 'right':
      return { x: maxX, y: midY };
    case 'bottomLeft':
      return { x: 1, y: maxY };
    case 'bottom':
      return { x: midX, y: maxY };
    case 'bottomRight':
      return { x: maxX, y: maxY };
    default:
      return position satisfies never;
  }
}

async function boundingBoxOf(locator: Locator): Promise<Box> {
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error('Expected element to have a bounding box but it was not visible.');
  }
  return box;
}

/** `cy.realHover({ position })` — move the real pointer over the element. */
export async function hoverAt(locator: Locator, position: Position = 'center'): Promise<void> {
  const box = await boundingBoxOf(locator);
  await locator.hover({ position: offsetFor(box, position) });
}

/**
 * `cy.trigger('pointerout', position, { pointerType: 'mouse' })` — dispatch a
 * synthetic bubbling `pointerout` at the given position within the element.
 */
export async function pointerOutAt(locator: Locator, position: Position): Promise<void> {
  const box = await boundingBoxOf(locator);
  const offset = offsetFor(box, position);
  await locator.dispatchEvent('pointerout', {
    pointerType: 'mouse',
    bubbles: true,
    cancelable: true,
    clientX: box.x + offset.x,
    clientY: box.y + offset.y,
  });
}

/** `cy.trigger('keydown', { key })` — dispatch a synthetic bubbling keydown. */
export async function keydown(locator: Locator, key: string): Promise<void> {
  await locator.dispatchEvent('keydown', { key, bubbles: true, cancelable: true });
}

/**
 * Hover a menu item by its visible text, asserting it is visible first (matches
 * the `cy.findByText(text).should('be.visible').realHover()` helper).
 */
export async function pointerOver(page: Page, text: string): Promise<Locator> {
  const locator = page.getByText(text, { exact: true });
  await expect(locator).toBeVisible();
  await locator.hover();
  return locator;
}

/** Exit a submenu trigger moving the pointer right-to-left (away on the right side). */
export async function pointerExitRightToLeft(page: Page, text: string): Promise<void> {
  const locator = page.getByText(text, { exact: true });
  await expect(locator).toBeVisible();
  await hoverAt(locator, 'right');
  await hoverAt(locator, 'bottomLeft');
  await pointerOutAt(locator, 'bottomLeft');
}

/** Exit a submenu trigger moving the pointer left-to-right (away on the left side). */
export async function pointerExitLeftToRight(page: Page, text: string): Promise<void> {
  const locator = page.getByText(text, { exact: true });
  await expect(locator).toBeVisible();
  await hoverAt(locator, 'left');
  await hoverAt(locator, 'bottomRight');
  await pointerOutAt(locator, 'bottomRight');
}

/**
 * `longTouch` helper from the ContextMenu spec: hold a primary touch pointer
 * over the element for 750ms to trigger the long-press interaction.
 */
export async function longTouch(page: Page, text: string): Promise<void> {
  const locator = page.getByText(text, { exact: true });
  await expect(locator).toBeVisible();
  await locator.dispatchEvent('pointerdown', {
    button: 0,
    buttons: 1,
    clientX: 100,
    clientY: 100,
    isPrimary: true,
    pointerId: 1,
    pointerType: 'touch',
    bubbles: true,
    cancelable: true,
  });
  await page.waitForTimeout(750);
}

/**
 * Simulate a touch swipe on an element, replicating `cy.realSwipe(...)`.
 * Uses the Chrome DevTools Protocol so the browser emits genuine touch and
 * pointer events (Playwright's `touchscreen` only supports taps).
 */
export async function touchSwipe(
  page: Page,
  locator: Locator,
  direction: 'toTop' | 'toBottom' | 'toLeft' | 'toRight',
  length: number,
): Promise<void> {
  const box = await boundingBoxOf(locator);
  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;
  let endX = startX;
  let endY = startY;
  switch (direction) {
    case 'toTop':
      endY = startY - length;
      break;
    case 'toBottom':
      endY = startY + length;
      break;
    case 'toLeft':
      endX = startX - length;
      break;
    case 'toRight':
      endX = startX + length;
      break;
    default:
      direction satisfies never;
  }

  const client = await page.context().newCDPSession(page);
  try {
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchStart',
      touchPoints: [{ x: startX, y: startY }],
    });
    const steps = 6;
    for (let step = 1; step <= steps; step += 1) {
      const progress = step / steps;
      await client.send('Input.dispatchTouchEvent', {
        type: 'touchMove',
        touchPoints: [
          { x: startX + (endX - startX) * progress, y: startY + (endY - startY) * progress },
        ],
      });
    }
    await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } finally {
    await client.detach();
  }
}
