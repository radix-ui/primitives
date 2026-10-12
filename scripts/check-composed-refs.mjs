// @ts-check
/**
 * Guards against reintroducing the unstable composed-ref footgun that caused the
 * React 19 "Maximum update depth exceeded" crashes in issue #3963.
 *
 * It fails CI when it finds either of these anti-patterns in package source:
 *
 *   1. An inline function passed to `useComposedRefs(...)`, e.g.
 *        useComposedRefs(forwardedRef, (node) => setContent(node))
 *      The inline callback is recreated every render, so the memoized composed
 *      ref changes identity every render. Pass the stable ref (e.g. the state
 *      setter) directly, or wrap the callback in `useCallbackRef` first.
 *
 *   2. A render-inline `composeRefs(...)` used as a `ref`, e.g.
 *        <Foo ref={composeRefs(forwardedRef, context.triggerRef)} />
 *      This builds a brand new ref callback every render. Hoist it into the
 *      memoized `useComposedRefs(...)` hook instead.
 */
import { globSync } from 'glob';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const files = globSync('packages/*/*/src/**/*.{ts,tsx}', {
  cwd: root,
  absolute: true,
  ignore: ['**/*.test.*', '**/*.stories.*', '**/dist/**', '**/node_modules/**'],
});

/** @type {{ file: string; line: number; message: string }[]} */
const violations = [];

/**
 * @param {ts.SourceFile} sourceFile
 * @param {string} file
 * @param {ts.Node} node
 * @param {string} message
 */
function report(sourceFile, file, node, message) {
  const { line } = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  violations.push({ file: path.relative(root, file), line: line + 1, message });
}

const INLINE_USE_COMPOSED_REFS =
  'Inline ref callback passed to `useComposedRefs`. Pass a stable ref (e.g. a state setter) ' +
  'directly, or wrap the callback in `useCallbackRef` before composing (see issue #3963).';

const RENDER_INLINE_COMPOSE_REFS =
  'Render-inline `composeRefs(...)` used as a ref. This recreates the ref on every render; ' +
  'hoist it into the memoized `useComposedRefs(...)` hook instead (see issue #3963).';

/**
 * @param {ts.Node} node
 * @returns {node is ts.CallExpression}
 */
function isCallTo(node, name) {
  return (
    ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === name
  );
}

for (const file of files) {
  const sourceFile = ts.createSourceFile(
    file,
    readFileSync(file, 'utf8'),
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    ts.ScriptKind.TSX,
  );

  /** @param {ts.Node} node */
  const findComposeRefs = (node) => {
    if (isCallTo(node, 'composeRefs')) {
      report(sourceFile, file, node, RENDER_INLINE_COMPOSE_REFS);
    }
    ts.forEachChild(node, findComposeRefs);
  };

  /** @param {ts.Node} node */
  const visit = (node) => {
    if (isCallTo(node, 'useComposedRefs')) {
      for (const arg of node.arguments) {
        if (ts.isArrowFunction(arg) || ts.isFunctionExpression(arg)) {
          report(sourceFile, file, arg, INLINE_USE_COMPOSED_REFS);
        }
      }
    }

    // Flag `composeRefs(...)` used anywhere inside a JSX attribute (e.g. `ref={...}`).
    if (
      ts.isJsxAttribute(node) &&
      node.initializer &&
      ts.isJsxExpression(node.initializer) &&
      node.initializer.expression
    ) {
      findComposeRefs(node.initializer.expression);
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);
}

if (violations.length > 0) {
  console.error(`\n✖ Found ${violations.length} unstable composed-ref pattern(s):\n`);
  for (const violation of violations) {
    console.error(`  ${violation.file}:${violation.line}`);
    console.error(`    ${violation.message}\n`);
  }
  console.error(
    'These patterns cause React 19 to detach/re-attach refs every commit, which can trigger\n' +
      'infinite render loops ("Maximum update depth exceeded"). See issue #3963.\n',
  );
  process.exit(1);
}

console.log(
  `✓ check-composed-refs: no unstable composed-ref patterns found (${files.length} files).`,
);
