// @ts-check
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { PRIMITIVE_NODES } from '../app/primitive-merge/nodes.mjs';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.resolve(scriptDir, '..');
const prerenderDir = path.join(appDir, '.next', 'server', 'app');

/** Locate the prerendered HTML for the `/primitive-merge` route. */
function readPrerenderedHtml() {
  const expected = path.join(prerenderDir, 'primitive-merge.html');
  if (fs.existsSync(expected)) {
    return fs.readFileSync(expected, 'utf8');
  }

  // Fallback: search for a matching prerendered file in case Next changes the layout.
  if (fs.existsSync(prerenderDir)) {
    const match = fs
      .readdirSync(prerenderDir)
      .find((file) => /^primitive-merge.*\.html$/.test(file));
    if (match) {
      return fs.readFileSync(path.join(prerenderDir, match), 'utf8');
    }
  }

  throw new Error(
    `Could not find the prerendered HTML for /primitive-merge under ${prerenderDir}. ` +
      `Run \`next build\` for @repo/ssr-testing before this assertion.`,
  );
}

const html = readPrerenderedHtml();

/**
 * Returns the opening tag string for the element carrying the given test id, or
 * `null` if no such element exists in the HTML.
 *
 * @param {string} node
 * @returns {string | null}
 */
function findElementTag(node) {
  const tagPattern = new RegExp(
    `<[a-zA-Z][a-zA-Z0-9]*\\b[^>]*\\bdata-testid="primitive-${node}"[^>]*>`,
  );
  const match = html.match(tagPattern);
  return match ? match[0] : null;
}

for (const node of PRIMITIVE_NODES) {
  test(`Primitive.${node} (asChild) renders in the prerendered HTML`, () => {
    const tag = findElementTag(node);
    assert.ok(
      tag,
      `No prerendered element with data-testid="primitive-${node}" was found. ` +
        `The Primitive did not render.`,
    );
  });
}
