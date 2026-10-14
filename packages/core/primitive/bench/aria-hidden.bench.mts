import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { chromium, firefox, webkit } from '@playwright/test';
import { build } from 'vite';

// oxlint-disable-next-line typescript/consistent-type-imports
declare const ariaHiddenBench: typeof import('./aria-hidden.page.ts');

const browserTypes = { chromium, firefox, webkit };
type BrowserName = keyof typeof browserTypes;

function isBrowserName(name: string): name is BrowserName {
  return name in browserTypes;
}

const { values } = parseArgs({
  options: {
    browser: { type: 'string', multiple: true },
  },
});

const browserNames = values.browser ?? Object.keys(browserTypes);
for (const browserName of browserNames) {
  if (!isBrowserName(browserName)) {
    throw new Error(
      `Unknown browser "${browserName}". Expected one of: ${Object.keys(browserTypes).join(', ')}`,
    );
  }
}

async function bundlePage(): Promise<string> {
  const result = await build({
    configFile: false,
    logLevel: 'warn',
    build: {
      write: false,
      lib: {
        entry: fileURLToPath(new URL('./aria-hidden.page.ts', import.meta.url)),
        formats: ['iife'],
        name: 'ariaHiddenBench',
        fileName: 'aria-hidden.page',
      },
    },
  });

  const outputs = Array.isArray(result) ? result : [result];
  for (const output of outputs) {
    if ('output' in output) {
      for (const chunk of output.output) {
        if (chunk.type === 'chunk') {
          return chunk.code;
        }
      }
    }
  }
  throw new Error('Vite did not produce a bundle for the benchmark page');
}

const bundle = await bundlePage();
const styleModes = [
  { ariaHiddenStyles: false, title: 'Without CSS that depends on aria-hidden' },
  { ariaHiddenStyles: true, title: 'With CSS that depends on aria-hidden' },
];
const tables = styleModes.map(() => new Map<string, Record<string, number>>());

for (const browserName of browserNames as BrowserName[]) {
  const browser = await browserTypes[browserName].launch();
  try {
    const scenarioNames = await (async () => {
      const page = await browser.newPage();
      await page.addScriptTag({ content: bundle });
      const names = await page.evaluate(() => ariaHiddenBench.scenarioNames);
      await page.close();
      return names;
    })();

    for (const [styleModeIndex, styleMode] of styleModes.entries()) {
      for (const scenarioName of scenarioNames) {
        // A fresh page per scenario keeps garbage and style caches from one
        // scenario from affecting the next one
        const page = await browser.newPage();
        await page.addScriptTag({ content: bundle });
        const result = await page.evaluate(
          ([name, ariaHiddenStyles]) => ariaHiddenBench.runScenario(name, { ariaHiddenStyles }),
          [scenarioName, styleMode.ariaHiddenStyles] as const,
        );
        await page.close();

        const table = tables[styleModeIndex]!;
        const row = table.get(scenarioName) ?? { 'hidden elements': result.hiddenElements };
        row[`${browserName} script ms`] = Number(result.scriptMedianMs.toFixed(3));
        row[`${browserName} total ms`] = Number(result.totalMedianMs.toFixed(3));
        table.set(scenarioName, row);
      }
    }
  } finally {
    await browser.close();
  }
}

console.log(
  `Median time per open and close cycle:

- "script" is hideOthers and its undo alone
- "total" also forces style and layout after each
`,
);
for (const [styleModeIndex, styleMode] of styleModes.entries()) {
  console.log(`\n${styleMode.title}:`);
  console.table(Object.fromEntries(tables[styleModeIndex]!));
}
