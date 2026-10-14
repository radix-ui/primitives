import { afterAll, bench, describe } from 'vitest';
import { hideOthers } from './aria-hidden';

const TREE_DEPTH = 6;
const TREE_BREADTH = 4;

function buildTree(depth: number, breadth: number): HTMLElement {
  const element = document.createElement('div');
  if (depth > 0) {
    for (let index = 0; index < breadth; index++) {
      element.append(buildTree(depth - 1, breadth));
    }
  }
  return element;
}

function getDeepestDescendant(element: Element, childIndex: number): Element {
  let current = element;
  while (current.children.length > 0) {
    current = current.children[Math.min(childIndex, current.children.length - 1)]!;
  }
  return current;
}

interface Scenario {
  appRoot: HTMLElement;
  content: HTMLElement;
  cleanup: () => void;
}

function setupScenario(decorateApp?: (appRoot: HTMLElement) => void): Scenario {
  const appRoot = buildTree(TREE_DEPTH, TREE_BREADTH);
  decorateApp?.(appRoot);

  const portal = document.createElement('div');
  const content = document.createElement('div');
  portal.append(content);
  document.body.append(appRoot, portal);

  return {
    appRoot,
    content,
    cleanup: () => {
      appRoot.remove();
      portal.remove();
    },
  };
}

function countHiddenElements(scenario: Scenario): number {
  const undo = hideOthers(new Set([scenario.content]), document.body);
  const count = document.querySelectorAll('[data-aria-hidden]').length;
  undo();
  return count;
}

const hiddenElementCounts: Record<string, number> = {};

afterAll(() => {
  console.table(hiddenElementCounts);
});

describe('hideOthers + undo', () => {
  {
    const name = 'portaled content, no scripts or live regions';
    let scenario: Scenario;
    bench(
      name,
      () => {
        hideOthers(new Set([scenario.content]), document.body)();
      },
      {
        setup: () => {
          scenario = setupScenario();
          hiddenElementCounts[name] = countHiddenElements(scenario);
        },
        teardown: () => {
          scenario.cleanup();
        },
      },
    );
  }

  {
    const name = 'one script nested deep inside the app';
    let scenario: Scenario;
    bench(
      name,
      () => {
        hideOthers(new Set([scenario.content]), document.body)();
      },
      {
        setup: () => {
          scenario = setupScenario((appRoot) => {
            getDeepestDescendant(appRoot, 0).append(document.createElement('script'));
          });
          hiddenElementCounts[name] = countHiddenElements(scenario);
        },
        teardown: () => {
          scenario.cleanup();
        },
      },
    );
  }

  {
    const name = 'fifty style elements directly inside body';
    let scenario: Scenario;
    let styles: HTMLStyleElement[] = [];
    bench(
      name,
      () => {
        hideOthers(new Set([scenario.content]), document.body)();
      },
      {
        setup: () => {
          scenario = setupScenario();
          styles = Array.from({ length: 50 }, () => document.createElement('style'));
          document.body.append(...styles);
          hiddenElementCounts[name] = countHiddenElements(scenario);
        },
        teardown: () => {
          scenario.cleanup();
          for (const style of styles) {
            style.remove();
          }
        },
      },
    );
  }

  {
    const name = 'four aria-live="polite" regions nested deep inside the app';
    let scenario: Scenario;
    bench(
      name,
      () => {
        hideOthers(new Set([scenario.content]), document.body)();
      },
      {
        setup: () => {
          scenario = setupScenario((appRoot) => {
            for (let childIndex = 0; childIndex < TREE_BREADTH; childIndex++) {
              const liveRegion = document.createElement('div');
              liveRegion.setAttribute('aria-live', 'polite');
              getDeepestDescendant(appRoot, childIndex).append(liveRegion);
            }
          });
          hiddenElementCounts[name] = countHiddenElements(scenario);
        },
        teardown: () => {
          scenario.cleanup();
        },
      },
    );
  }

  {
    const name = 'one aria-live="off" region per leaf';
    let scenario: Scenario;
    bench(
      name,
      () => {
        hideOthers(new Set([scenario.content]), document.body)();
      },
      {
        setup: () => {
          scenario = setupScenario((appRoot) => {
            const leaves = Array.from(appRoot.querySelectorAll('div')).filter(
              (element) => element.children.length === 0,
            );
            for (const leaf of leaves) {
              const liveRegion = document.createElement('span');
              liveRegion.setAttribute('aria-live', 'off');
              leaf.append(liveRegion);
            }
          });
          hiddenElementCounts[name] = countHiddenElements(scenario);
        },
        teardown: () => {
          scenario.cleanup();
        },
      },
    );
  }
});
