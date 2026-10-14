import { hideOthers } from '../src/aria-hidden';

const TREE_DEPTH = 6;
const TREE_BREADTH = 4;
const WARMUP_CYCLES = 20;
const SAMPLES = 30;
const CYCLES_PER_SAMPLE = 10;

const PAGE_STYLES = `
  div { display: flex; flex-wrap: wrap; padding: 1px; font: 12px sans-serif; }
`;

// Browsers only recalculate style for an attribute change when some selector
// depends on that attribute, so the rendering cost of `hideOthers` depends on
// whether or not the app styles hidden content
const ARIA_HIDDEN_STYLES = `
  [aria-hidden='true'] span { color: gray; }
`;

interface ScenarioDefinition {
  name: string;
  decorate?: (appRoot: HTMLElement) => void;
}

interface ScenarioOptions {
  ariaHiddenStyles: boolean;
}

interface ScenarioResult {
  hiddenElements: number;
  scriptMedianMs: number;
  totalMedianMs: number;
}

function buildTree(depth: number, breadth: number): HTMLElement {
  const element = document.createElement('div');
  if (depth > 0) {
    for (let index = 0; index < breadth; index++) {
      element.append(buildTree(depth - 1, breadth));
    }
  } else {
    const text = document.createElement('span');
    text.textContent = 'leaf';
    element.append(text);
  }
  return element;
}

function getDeepestDescendant(element: Element, childIndex: number): Element {
  let current = element;
  while (current.firstElementChild?.localName === 'div') {
    current = current.children[Math.min(childIndex, current.children.length - 1)]!;
  }
  return current;
}

const scenarios: ScenarioDefinition[] = [
  { name: 'portaled content, no scripts or live regions' },
  {
    name: 'one script nested deep inside the app',
    decorate: (appRoot) => {
      getDeepestDescendant(appRoot, 0).append(document.createElement('script'));
    },
  },
  {
    name: 'fifty style elements directly inside body',
    decorate: () => {
      for (let index = 0; index < 50; index++) {
        document.body.append(document.createElement('style'));
      }
    },
  },
  {
    name: 'four aria-live="polite" regions nested deep inside the app',
    decorate: (appRoot) => {
      for (let childIndex = 0; childIndex < TREE_BREADTH; childIndex++) {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        getDeepestDescendant(appRoot, childIndex).append(liveRegion);
      }
    },
  },
  {
    name: 'one aria-live="off" region per leaf',
    decorate: (appRoot) => {
      const leaves = Array.from(appRoot.querySelectorAll('div')).filter(
        (element) => element.firstElementChild?.localName === 'span',
      );
      for (const leaf of leaves) {
        const liveRegion = document.createElement('span');
        liveRegion.setAttribute('aria-live', 'off');
        leaf.append(liveRegion);
      }
    },
  },
];

export const scenarioNames = scenarios.map((scenario) => scenario.name);

function forceStyleAndLayout() {
  document.body.getBoundingClientRect();
}

function getMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1]! + sorted[middle]!) / 2 : sorted[middle]!;
}

function measureMedianMs(runCycle: () => void): number {
  for (let cycle = 0; cycle < WARMUP_CYCLES; cycle++) {
    runCycle();
  }

  const samples: number[] = [];
  for (let sample = 0; sample < SAMPLES; sample++) {
    const start = performance.now();
    for (let cycle = 0; cycle < CYCLES_PER_SAMPLE; cycle++) {
      runCycle();
    }
    samples.push((performance.now() - start) / CYCLES_PER_SAMPLE);
  }

  forceStyleAndLayout();
  return getMedian(samples);
}

export function runScenario(name: string, options: ScenarioOptions): ScenarioResult {
  const scenario = scenarios.find((definition) => definition.name === name);
  if (!scenario) {
    throw new Error(`Unknown scenario: ${name}`);
  }

  const style = document.createElement('style');
  style.textContent = options.ariaHiddenStyles ? PAGE_STYLES + ARIA_HIDDEN_STYLES : PAGE_STYLES;
  document.head.append(style);

  const appRoot = buildTree(TREE_DEPTH, TREE_BREADTH);
  scenario.decorate?.(appRoot);
  const portal = document.createElement('div');
  const content = document.createElement('div');
  portal.append(content);
  document.body.append(appRoot, portal);
  forceStyleAndLayout();

  const targets = new Set([content]);

  const undoForCount = hideOthers(targets, document.body);
  const hiddenElements = document.querySelectorAll('[data-aria-hidden]').length;
  undoForCount();

  const scriptMedianMs = measureMedianMs(() => {
    hideOthers(targets, document.body)();
  });

  const totalMedianMs = measureMedianMs(() => {
    const undo = hideOthers(targets, document.body);
    forceStyleAndLayout();
    undo();
    forceStyleAndLayout();
  });

  document.body.replaceChildren();
  style.remove();

  return { hiddenElements, scriptMedianMs, totalMedianMs };
}
