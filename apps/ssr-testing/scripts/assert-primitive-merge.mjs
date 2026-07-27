// @ts-check

// Regression guard for the client/server boundary behavior of `Slot.Provider`.
//
// The `/primitive-merge` route is a Server Component that renders every
// `Primitive.<node>` with `asChild` inside a client `Slot.Provider` whose
// custom `mergeProps` stamps `data-provider-merged="true"`. Because
// `@radix-ui/react-primitive` is a client component, each primitive's internal
// `Slot` renders on the client under the provider and must apply that custom
// merge, even if the code composing them is authored as an RSC-safe Server
// Component.
//
// This asserts, per primitive, that the marker landed in the prerendered HTML
// rather than trusting the unit stub. Run after `next build`.

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
  test(`Primitive.${node} (asChild) honors the client Slot.Provider mergeProps across the RSC boundary`, () => {
    const tag = findElementTag(node);
    assert.ok(
      tag,
      `No prerendered element with data-testid="primitive-${node}" was found. ` +
        `The Primitive did not render.`,
    );
    assert.match(
      tag,
      /\bdata-provider-merged="true"/,
      `Primitive.${node} rendered without the provider's custom merge marker. ` +
        `The client Slot.Provider did not reach it (tag: ${tag}).`,
    );
  });
}
