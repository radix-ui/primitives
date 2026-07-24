import { parseAstAsync, transformWithEsbuild, type Plugin } from 'vite';

/**
 * Determines whether a module declares the `"use client"` directive as one of
 * its first statements.
 */
export function hasUseClientDirective(code: string): boolean {
  const withoutBom = code.replace(/^\uFEFF/, '');
  const leading = withoutBom.match(/^(?:\s+|\/\/[^\n]*\n|\/\*[\s\S]*?\*\/)*/);
  const rest = leading ? withoutBom.slice(leading[0].length) : withoutBom;
  return /^(['"])use client\1\s*;?/.test(rest);
}

/**
 * Simulates how an RSC bundler treats `"use client"` modules. They become
 * client references and their module bodies never execute in the server graph.
 *
 * Without this, importing an otherwise server-safe module under the
 * `react-server` condition would eagerly evaluate the client module's body and
 * throw on client-only APIs in the module scope. Stubbing the client module
 * lets us verify that the server-reachable graph of every package is RSC-safe.
 */
export function rscClientBoundaryStub(): Plugin {
  return {
    name: 'rsc-client-boundary-stub',
    enforce: 'pre',
    async transform(code, id) {
      if (id.includes('/node_modules/')) {
        return null;
      }
      if (!hasUseClientDirective(code)) {
        return null;
      }

      // Strip TypeScript types so the parser only sees the runtime exports.
      const { code: js } = await transformWithEsbuild(code, id);
      const ast = await parseAstAsync(js);

      const namedExports = new Set<unknown>();
      for (const node of ast.body) {
        if (node.type === 'ExportNamedDeclaration') {
          for (const specifier of node.specifiers) {
            const exported = specifier.exported;
            const name = exported.type === 'Identifier' ? exported.name : exported.value;
            if (name && name !== 'default') {
              namedExports.add(name);
            }
          }
          const declaration = node.declaration;
          if (declaration && 'declarations' in declaration) {
            for (const decl of declaration.declarations) {
              if (decl.id.type === 'Identifier') {
                namedExports.add(decl.id.name);
              }
            }
          } else if (declaration && 'id' in declaration && declaration.id?.type === 'Identifier') {
            namedExports.add(declaration.id.name);
          }
        } else if (node.type === 'ExportAllDeclaration' && node.exported) {
          const name =
            node.exported.type === 'Identifier' ? node.exported.name : node.exported.value;
          if (name) {
            namedExports.add(name);
          }
        }
      }

      // A client reference may be imported, referenced, and rendered, but
      // calling it as a function on the server throws. This behaves exactly
      // like React's runtime.
      const lines = [
        `function __rscClientReference(name) {`,
        `  return new Proxy(function () {}, {`,
        `    apply() {`,
        `      throw new Error(`,
        `        "Attempted to call " + name + "() from the server but " + name + " is on the client. " +`,
        `        "It's not possible to invoke a client function from the server, it can only be " +`,
        `        "rendered as a Component or passed to props of a Client Component."`,
        `      );`,
        `    },`,
        `    construct() {`,
        `      throw new Error("Attempted to construct " + name + " from the server but it is on the client.");`,
        `    },`,
        `    get(_target, prop) {`,
        `      if (prop === '__esModule') return true;`,
        `      if (prop === 'then' || typeof prop === 'symbol') return undefined;`,
        `      return __rscClientReference(name + '.' + String(prop));`,
        `    },`,
        `  });`,
        `}`,
        ...[...namedExports].map(
          (name) => `export const ${name} = __rscClientReference(${JSON.stringify(name)});`,
        ),
        `export default __rscClientReference('default');`,
      ];

      return { code: lines.join('\n'), map: null };
    },
  };
}
